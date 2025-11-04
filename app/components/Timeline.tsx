'use client';

import { useState, useEffect } from 'react';

interface TimelineProps {
  initialDate?: Date;
  speed?: number; // milliseconds per day
  className?: string;
}

const Timeline = ({ 
  initialDate = new Date('1939-09-01'), 
  speed = 500, // 1 second = 1 day
  className = '' 
}: TimelineProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleCounter = () => {
    setIsRunning(prev => !prev);
  };

  const resetCounter = () => {
    setCurrentDate(initialDate);
    setIsRunning(false);
  };

  const fastForward = (days: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  return (
    <div className={`date-counter p-2 rounded-lg ${className}`}>
      <div className="text-center ">  
        <div className="text-2xl font-mono font-bold">
          {formatDate(currentDate)}
        </div>
      </div>
    </div>
  );
}

export default Timeline;