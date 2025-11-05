import Link from "next/link";
import Timeline from "./Timeline";

export default function TopBar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-amber-900/50 backdrop-blur-sm border-b-2 border-amber-800/50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
        <h1 className="text-2xl font-bold text-amber-50 drop-shadow-lg sm:text-3xl tracking-tight">Wojna o kulturę</h1>
        <div className="text-sm font-mono text-amber-100 bg-amber-800/50 px-3 py-1 rounded-md border border-amber-700/50">
          <Timeline />
        </div>
      </div>
    </header>
  );
}

