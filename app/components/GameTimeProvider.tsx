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
  const [isRunning, setIsRunning] = useState<boolean>(false);
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
    const prev = currentDateRef.current;
    const newDate = startOfDay(date ?? defaultDate);
    setCurrentDate(newDate);
    currentDateRef.current = newDate;
    stop();

    const prevNum = dayNumber(prev);
    const newNum = dayNumber(newDate);
    if (newNum > prevNum) processSchedulesBetween(prevNum, newNum);
  }, [defaultDate, stop]);

  // process schedules that were skipped when time is advanced from prevDayNum (exclusive)
  // to newDayNum (inclusive). Runs any one-off schedules in the range and runs recurring
  // callbacks once for each interval that passed.
  const processSchedulesBetween = (prevDayNum: number, newDayNum: number) => {
    if (newDayNum <= prevDayNum) return;

    const callbacks: (() => void)[] = [];

    // one-off schedules
    const toRunOnce = onceRef.current.filter((s) => {
      const sd = dayNumber(new Date(s.dateISO));
      return sd > prevDayNum && sd <= newDayNum;
    });
    if (toRunOnce.length) {
      callbacks.push(...toRunOnce.map(s => s.callback));
      onceRef.current = onceRef.current.filter((s) => {
        const sd = dayNumber(new Date(s.dateISO));
        return !(sd > prevDayNum && sd <= newDayNum);
      });
    }

    // recurring schedules: if multiple intervals passed, run callback multiple times
    everyRef.current.forEach((s) => {
      while (s.nextDayNumber <= newDayNum) {
        if (s.nextDayNumber > prevDayNum) {
          callbacks.push(s.callback);
        } else if (s.nextDayNumber <= prevDayNum) {
          // if nextDayNumber already behind prev, still advance without running until it passes prev
        }
        s.nextDayNumber += s.intervalDays;
      }
    });

    if (callbacks.length) {
      setTimeout(() => {
        callbacks.forEach(cb => {
          try { cb(); } catch { /* swallow */ }
        });
      }, 0);
    }
  };

  const fastForward = React.useCallback((days: number) => {
    // Advance time immediately and process any schedules that were skipped
    const prev = currentDateRef.current;
    const d = new Date(prev);
    d.setDate(d.getDate() + days);
    const newDate = startOfDay(d);
    setCurrentDate(newDate);
    currentDateRef.current = newDate;

    // process schedules for any days between prev (exclusive) and newDate (inclusive)
    const prevNum = dayNumber(prev);
    const newNum = dayNumber(newDate);
    if (newNum > prevNum) {
      processSchedulesBetween(prevNum, newNum);
    }
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
    // use the canonical current date from the ref to avoid stale closure
    const currentDay = dayNumber(currentDateRef.current);
    const next = currentDay + (typeof startInDays === "number" ? startInDays : intervalDays);
    everyRef.current.push({ id, nextDayNumber: next, intervalDays, callback: cb });
    return id;
  }, []);

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

      // process any schedules between prev (exclusive) and nextDay (inclusive)
      const prevNum = dayNumber(prev);
      const newNum = dayNumber(nextDay);
      processSchedulesBetween(prevNum, newNum);

      // Update state and ref synchronously
      setCurrentDate(nextDay);
      currentDateRef.current = nextDay;
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
