import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress value 0-100
  label?: string;
}

const ProgressBar = ({
  progress,
  label = "Postęp rabunku"
}: ProgressBarProps) => {
  const roundedProgress = Math.round(progress);

  return (
    <div className="flex flex-row items-center gap-3" style={{ width: '20%' }}>
      <label className="text-sm font-semibold text-amber-50 drop-shadow-sm whitespace-nowrap flex-shrink-0">
        {label}
      </label>
      <div className="relative bg-amber-800/50 h-6 flex-1 rounded-full border border-amber-700/50 shadow-inner overflow-hidden">
        <div
          className="absolute inset-0 h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center"
          style={{ width: `${progress}%` }}
        >
          {progress > 10 && (
            <span className="text-xs font-bold text-amber-50">{roundedProgress}%</span>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProgressBar;
