import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  duration?: number; // Total duration in seconds
  onComplete?: () => void;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  duration = 480,
  onComplete = () => {},
  label = "Postęp rabunku"
}) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / duration);
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 100);
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [duration, onComplete]);

  const roundedProgress = Math.round(progress);

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-base font-semibold text-amber-50 drop-shadow-sm w-[280px] text-center whitespace-nowrap">
        {label}
      </label>
      <div className="relative bg-amber-800/50 h-12 w-[260px] rounded-lg border border-amber-700/50 shadow-inner overflow-hidden">
        <div
          className="absolute inset-0 h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg transition-all duration-300 shadow-lg"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 h-full flex items-center justify-center">
          <span className="text-lg font-bold text-amber-200">{roundedProgress}%</span>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;