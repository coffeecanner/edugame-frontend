import ParticleCanvas from "@/components/ParticleCanvas";

export default function GalacticLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-white">
      {/* Rasi bintang */}
      <ParticleCanvas />

      {/* Layer background gradasi gelap */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-90" />

      {/* Konten utama */}
      <main className="relative z-20 flex items-center justify-center min-h-screen px-4">
        {children}
      </main>
    </div>
  );
}
