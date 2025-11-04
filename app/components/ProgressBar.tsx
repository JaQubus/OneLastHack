interface ProgressBarProps {
  progress: number;
  label: string;
}

export default function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="flex flex-col items-end gap-2" style={{ width: '20%' }}>
      <label className="text-sm font-semibold text-amber-50 drop-shadow-sm">{label}</label>
      <div className="w-full bg-amber-800/50 rounded-full h-6 border border-amber-700/50 shadow-inner overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center text-xs font-bold text-amber-50 transition-all duration-300 shadow-lg"
          style={{ width: `${progress}%` }}
        >
          {progress > 10 && `${progress}%`}
        </div>
      </div>
    </div>
  );
}