'use client';

import { useEffect } from 'react';
import { useGameTime } from './GameTimeProvider';

interface TimelineProps {
  initialDate?: Date;
  speed?: number; // milliseconds per day
  className?: string;
}

const Timeline = ({
  initialDate,
  speed = 500, // 1 second = 1 day
  className = ''
}: TimelineProps) => {
  const { currentDate, isRunning, toggle, reset, fastForward, setSpeed } = useGameTime();

  useEffect(() => {
    // if a speed prop is provided, apply it to global time
    if (typeof speed === 'number') setSpeed(speed);
  }, [speed, setSpeed]);

  useEffect(() => {
    // if an initialDate prop was passed, reset the global time to it once
    if (initialDate) reset(initialDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={`date-counter p-2 rounded-lg ${className}`}>
      <div className="text-center">
        <div className="text-2xl font-mono font-bold">{formatDate(currentDate)}</div>
        <div className="mt-2 flex items-center justify-center gap-2">
          <button 
            className="min-w-[80px] px-3 py-1.5 bg-amber-700/80 hover:bg-amber-700 text-amber-50 text-xs font-semibold rounded-lg border border-amber-600/50 shadow-md transition-all hover:scale-105 active:scale-95 text-center" 
            onClick={toggle}
          >
            {isRunning ? '⏸ Pause' : '▶ Play'}
          </button>
          <button 
            className="min-w-[60px] px-3 py-1.5 bg-amber-700/80 hover:bg-amber-700 text-amber-50 text-xs font-semibold rounded-lg border border-amber-600/50 shadow-md transition-all hover:scale-105 active:scale-95 text-center" 
            onClick={() => fastForward(10)}
          >
            +10d
          </button>
          <button 
            className="min-w-[60px] px-3 py-1.5 bg-amber-700/80 hover:bg-amber-700 text-amber-50 text-xs font-semibold rounded-lg border border-amber-600/50 shadow-md transition-all hover:scale-105 active:scale-95 text-center" 
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;