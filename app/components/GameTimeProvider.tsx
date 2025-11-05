"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type ScheduledOnce = {
  id: string;
  dateISO: string; // YYYY-MM-DD
  callback: () => void;
};

type ScheduledEvery = {
  id: string;
  nextDayNumber: number; // absolute day number (days since epoch)
  intervalDays: number;
  callback: () => void;
};

type GameTimeContextType = {
  currentDate: Date;
  isRunning: boolean;
  speed: number;
  start: () => void;
  stop: () => void;
  toggle: () => void;
  setSpeed: (msPerDay: number) => void;
  fastForward: (days: number) => void;
  reset: (date?: Date) => void;
  scheduleOnce: (date: Date | string, cb: () => void) => string;
  scheduleEvery: (intervalDays: number, cb: () => void, startInDays?: number) => string;
  cancelScheduled: (id: string) => void;
};

const GameTimeContext = createContext<GameTimeContextType | undefined>(undefined);

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function dayNumber(d: Date) {
  // number of days since unix epoch start
  return Math.floor(startOfDay(d).getTime() / 86400000);
}

let globalIdCounter = 1;

export function GameTimeProvider({ children }: { children: React.ReactNode }) {
  const defaultDate = useMemo(() => startOfDay(new Date("1939-09-01")), []);
  const [currentDate, setCurrentDate] = useState<Date>(defaultDate);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeedState] = useState<number>(500);

  const onceRef = useRef<ScheduledOnce[]>([]);
  const everyRef = useRef<ScheduledEvery[]>([]);

  const intervalRef = useRef<number | null>(null);
  const currentDateRef = useRef<Date>(currentDate);

  useEffect(() => {
    currentDateRef.current = currentDate;
  }, [currentDate]);

  const start = React.useCallback(() => setIsRunning(true), []);
  const stop = React.useCallback(() => setIsRunning(false), []);
  const toggle = React.useCallback(() => setIsRunning((v) => !v), []);

  const setSpeed = React.useCallback((msPerDay: number) => setSpeedState(msPerDay), []);

  const reset = React.useCallback((date?: Date) => {
    setCurrentDate(startOfDay(date ?? defaultDate));
    stop();
  }, [defaultDate, stop]);

  const fastForward = React.useCallback((days: number) => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + days);
      return startOfDay(d);
    });
  }, []);

  // scheduling APIs
  const scheduleOnce = React.useCallback((date: Date | string, cb: () => void) => {
    const dt = typeof date === "string" ? new Date(date) : date;
    const iso = toISODate(startOfDay(dt));
    const id = `once_${globalIdCounter++}`;
    onceRef.current.push({ id, dateISO: iso, callback: cb });
    return id;
  }, []);

  const scheduleEvery = React.useCallback((intervalDays: number, cb: () => void, startInDays?: number) => {
    const id = `every_${globalIdCounter++}`;
    const currentDay = dayNumber(currentDate);
    const next = currentDay + (typeof startInDays === "number" ? startInDays : intervalDays);
    everyRef.current.push({ id, nextDayNumber: next, intervalDays, callback: cb });
    return id;
  }, [currentDate]);

  const cancelScheduled = React.useCallback((id: string) => {
    onceRef.current = onceRef.current.filter((s) => s.id !== id);
    everyRef.current = everyRef.current.filter((s) => s.id !== id);
  }, []);

  // tick handler: advances date by one day and runs schedule checks
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // start interval
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      // compute next day based on the currentDateRef to avoid stale closures
      const prev = currentDateRef.current;
      const next = new Date(prev);
      next.setDate(next.getDate() + 1);
      const nextDay = startOfDay(next);

      // prepare callbacks to run AFTER we update state
      const iso = toISODate(nextDay);
      const toRunOnce = onceRef.current.filter((s) => s.dateISO <= iso);
      if (toRunOnce.length) {
        // remove them from the queue
        onceRef.current = onceRef.current.filter((s) => s.dateISO > iso);
      }

      // process every: collect callbacks that should run and advance their nextDayNumber
      const currentDayNumber = dayNumber(nextDay);
      const everyToRun: (() => void)[] = [];
      everyRef.current.forEach((s) => {
        if (currentDayNumber >= s.nextDayNumber) {
          everyToRun.push(s.callback);
          s.nextDayNumber = s.nextDayNumber + s.intervalDays;
        }
      });

      // Update state and ref synchronously
      setCurrentDate(nextDay);
      currentDateRef.current = nextDay;

      // Run callbacks asynchronously so we don't trigger setState during another component's render
      if (toRunOnce.length || everyToRun.length) {
        const allCallbacks = [...toRunOnce.map(s => s.callback), ...everyToRun];
        setTimeout(() => {
          allCallbacks.forEach(cb => {
            try {
              cb();
            } catch {
              // swallow errors in callbacks
            }
          });
        }, 0);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning, speed]);

  const value = useMemo(() => ({
    currentDate,
    isRunning,
    speed,
    start,
    stop,
    toggle,
    setSpeed,
    fastForward,
    reset,
    scheduleOnce,
    scheduleEvery,
    cancelScheduled,
  }), [currentDate, isRunning, speed, start, stop, toggle, setSpeed, fastForward, reset, scheduleOnce, scheduleEvery, cancelScheduled]);

  return <GameTimeContext.Provider value={value}>{children}</GameTimeContext.Provider>;
}

export function useGameTime() {
  const ctx = useContext(GameTimeContext);
  if (!ctx) throw new Error("useGameTime must be used inside GameTimeProvider");
  return ctx;
}
