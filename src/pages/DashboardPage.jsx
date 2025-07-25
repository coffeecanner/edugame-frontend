import ParticleCanvas from "@/components/ParticleCanvas";

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white font-sans">
      {/* Animated star background */}
      <ParticleCanvas />

      <div className="relative z-10 flex min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
        {/* Sidebar */}
        <aside className="w-64 p-6 space-y-6 bg-black/30 backdrop-blur-md shadow-lg">
          <h1 className="text-3xl font-bold text-purple-300">EduGame🚀</h1>
          <nav className="space-y-2 text-purple-200">
            <a href="#" className="block hover:bg-purple-700/30 p-2 rounded transition-all">🏠 Dashboard</a>
            <a href="#" className="block hover:bg-purple-700/30 p-2 rounded transition-all">📊 Leaderboard</a>
            <a href="#" className="block hover:bg-purple-700/30 p-2 rounded transition-all">📚 Materi</a>
            <a href="#" className="block hover:bg-purple-700/30 p-2 rounded transition-all">❓ Soal</a>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-10">
          <h2 className="text-4xl font-bold text-purple-300 animate-pulse">
            ✨ Selamat datang di Galaksi EduGame! ✨
          </h2>
          <p className="mt-4 text-purple-100">
            Pilih menu di kiri untuk menjelajahi sistem tata surya pembelajaran.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="bg-purple-800/40 p-6 rounded-xl shadow-lg hover:scale-105 hover:rotate-1 transition-transform">
              🌟 Materi
            </div>
            <div className="bg-indigo-800/40 p-6 rounded-xl shadow-lg hover:scale-105 hover:-rotate-1 transition-transform">
              🚀 Soal
            </div>
            <div className="bg-pink-800/40 p-6 rounded-xl shadow-lg hover:scale-105 hover:rotate-2 transition-transform">
              🪐 Leaderboard
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
