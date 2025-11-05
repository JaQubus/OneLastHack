import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  duration?: number; // Total duration in seconds
  onComplete?: () => void;
}

const ProgressBar = ({ 
  duration = 480,
  onComplete = () => {}
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
  }, [progress, duration, onComplete]);

  return (
    <div className="flex flex-col items-end gap-2" style={{ width: '10%' }}>
      <label className="text-sm font-semibold text-amber-50 drop-shadow-sm">
        Postęp rabunku
      </label>
      
      <div className="w-full bg-amber-800/50 rounded-full h-6 border border-amber-700/50 shadow-inner overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-xs font-bold text-amber-50 transition-all duration-300 shadow-lg"
          style={{ width: `${progress}%` }}
        >
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;