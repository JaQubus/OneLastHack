import React from 'react';

interface ProgressBarProps {
  progress?: number; // Progress value 0-100
  label?: string;
}

const ProgressBar = ({ 
  progress = 0,
  label = "Postęp rabunku"
}: ProgressBarProps) => {

  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const roundedProgress = Math.round(clampedProgress);

  return (
    <div className="flex flex-col items-center gap-2">
      <label className="text-base font-semibold text-amber-50 drop-shadow-sm w-[280px] text-center whitespace-nowrap">
        {label}
      </label>
      <div className="relative bg-amber-800/50 h-12 w-[260px] rounded-lg border border-amber-700/50 shadow-inner overflow-hidden">
        <div
          className="absolute inset-0 h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg transition-all duration-300 shadow-lg"
          style={{ width: `${clampedProgress}%` }}
        />
        <div className="absolute inset-0 h-full flex items-center justify-center">
          <span className="text-lg font-bold text-amber-200">{roundedProgress}%</span>
        </div>
      </div>
    </div>
  );
}
export default ProgressBar;
