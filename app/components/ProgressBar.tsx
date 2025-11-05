import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress value 0-100
  label?: string;
}

const ProgressBar = ({
  progress,
  label = "Postęp rabunku"
}: ProgressBarProps) => {
  // Clamp progress to 0-100 for safety
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const displayProgress = Math.round(clampedProgress * 10) / 10; // Round to 1 decimal

  return (
    <div className="rounded-lg p-4" style={{ width: '20%' }}>
      {/* Label centered at top */}
      <div className="text-center mb-3">
        <label className="text-sm font-bold text-amber-50">
          {label}
        </label>
      </div>
      
      {/* Progress bar container */}
      <div className="relative bg-amber-800 h-10 rounded-lg overflow-hidden">
        {/* Fill portion - solid color, no gradient */}
        <div
          className="absolute inset-0 h-full bg-amber-700 transition-all duration-300"
          style={{ width: `${clampedProgress}%` }}
        />
        
        {/* Percentage text centered over entire bar */}
        <div className="absolute inset-0 h-full flex items-center justify-center">
          <span className="text-base font-bold text-yellow-500">
            {displayProgress.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
export default ProgressBar;
