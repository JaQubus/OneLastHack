import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Vintage yellow/old paper background */}
      <div className="fixed inset-0 bg-[#f4e4bc] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSIjZjBkODk1IiBmaWxsLW9wYWNpdHk9Ii4xNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')]"></div>
      
      {/* Sepia/vintage filter overlays for aged paper effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-200/30 via-transparent to-amber-300/20 mix-blend-multiply"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(139,69,19,0.05)_100%)]"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-amber-100/40 via-transparent to-amber-200/30"></div>
      
      {/* Vintage stains/age spots */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-amber-800 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-amber-700 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 h-24 w-24 rounded-full bg-amber-900 blur-2xl"></div>
      </div>
      
      <main className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center gap-8 px-4 py-12 text-center sm:gap-12 sm:px-6 sm:py-16">
        {/* Game Title with vintage styling */}
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <h1 className="text-6xl font-bold flex flex-row tracking-wider  drop-shadow-[2px_2px_4px_rgba(139,69,19,0.3)] sm:text-7xl md:text-8xl lg:text-9xl">
            <div className="text-amber-900">KULT</div>
            <div className="text-amber-700">UR</div>
            <div className="text-amber-800"> KAMPF</div>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg font-semibold text-amber-900 drop-shadow-sm sm:text-xl md:text-2xl">
          Odzyskaj skradzione dzieła sztuki z II wojny światowej
        </p>
        <p className="max-w-xl text-base text-amber-800 sm:text-lg">
          Wciel się w szefa wywiadu polskiego państwa podziemnego
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>i prowadź operację odzyskania zagrabionych skarbów kultury.
        </p>

        {/* Main CTA Button - VERY CLICKABLE! */}
        <Link href="/map" className="mt-4 sm:mt-6">
          <button className="group relative btn btn-lg h-16 min-w-[240px] border-2 border-amber-800 bg-amber-700 text-lg font-bold uppercase tracking-widest text-amber-50 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-amber-800 hover:shadow-2xl active:scale-95 sm:h-20 sm:min-w-[300px] sm:text-xl rounded-xl">
            <span className="relative z-10">Rozpocznij Misję</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-800 to-amber-900 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </button>
        </Link>

        {/* Additional Info Cards */}
        <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          <div className="card bg-amber-100/80 border-2 border-amber-800/30 shadow-xl backdrop-blur-sm rounded-xl">
            <div className="card-body items-center p-4 text-center sm:p-6">
              <div className="mb-2 text-4xl">🗺️</div>
              <h3 className="card-title text-amber-900 text-base sm:text-lg">Strategiczna Mapa</h3>
              <p className="text-sm text-amber-800 sm:text-base">
                Śledź wydarzenia na interaktywnej mapie Europy
              </p>
            </div>
          </div>

          <div className="card bg-amber-100/80 border-2 border-amber-800/30 shadow-xl backdrop-blur-sm rounded-xl">
            <div className="card-body items-center p-4 text-center sm:p-6">
              <div className="mb-2 text-4xl">🕵️</div>
              <h3 className="card-title text-amber-900 text-base sm:text-lg">Siatka Wywiadowcza</h3>
              <p className="text-sm text-amber-800 sm:text-base">
                Rekrutuj agentów i zarządzaj operacjami
              </p>
            </div>
          </div>

          <div className="card bg-amber-100/80 border-2 border-amber-800/30 shadow-xl backdrop-blur-sm rounded-xl">
            <div className="card-body items-center p-4 text-center sm:p-6">
              <div className="mb-2 text-4xl">🎨</div>
              <h3 className="card-title text-amber-900 text-base sm:text-lg">Kolekcja Dzieł</h3>
              <p className="text-sm text-amber-800 sm:text-base">
                Odzyskaj najcenniejsze skarby kultury
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Indicator */}
        <div className="mt-6 flex items-center gap-2 text-sm font-mono text-amber-800 sm:mt-8 sm:text-base">
          <span className="font-semibold">1939</span>
          <div className="h-px w-12 bg-amber-800 sm:w-16"></div>
          <span className="font-semibold">1945</span>
        </div>
      </main>
    </div>
  );
}
