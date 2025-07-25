import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ParticleCanvas from "@/components/ParticleCanvas"; // sesuaikan path-nya

export default function GameLobbyPage() {
  const [roomName, setRoomName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [durasiMenit, setDurasiMenit] = useState(10);
  const [temaList, setTemaList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://edugame-api.fly.dev/tema")
      .then((res) => res.json())
      .then((data) => setTemaList(data))
      .catch((err) => console.error("Gagal fetch tema:", err));
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return alert("Nama room wajib diisi!");
    if (!selectedTheme) return alert("Tema wajib dipilih!");
    if (durasiMenit < 1) return alert("Durasi minimal 1 menit!");

    try {
      const res = await fetch("https://edugame-api.fly.dev/buat_room", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: roomName,
          tema_id: selectedTheme,
          durasi_menit: parseInt(durasiMenit)
        })
      });

      const text = await res.text();
      console.log("Raw response:", text);
      const data = JSON.parse(text);

      if (res.ok) {
        alert(`Room berhasil dibuat: ${data.data.room_id}`);
        navigate(`/room_peserta/${data.data.room_id}`);
      } else {
        alert(`Gagal membuat room: ${data.message || "Unknown error"}`);
      }

    } catch (error) {
      console.error("Fetch error:", error);
      alert("Terjadi kesalahan saat membuat room.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-white bg-[#0d1117]">
      <ParticleCanvas />

      <div className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-90"></div>

      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-xl rounded-2xl shadow-xl border border-purple-500/30 text-center  ring-1 ring-purple-500/10">
          <h1 className="text-3xl font-bold text-purple-300 mb-6 animate-pulse">
            🚀 Buat Room EduGame
          </h1>

          <input
            type="text"
            placeholder="🪐 Nama Room"
            className="w-full mb-4 p-3 rounded-xl bg-white/10 border border-purple-400/50 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />

          <select
            className="w-full mb-4 p-3 rounded-xl bg-white/10 border border-purple-400/50 text-white focus:outline-none"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
          >
            <option value="">🌌 Pilih Tema</option>
            {temaList.map((tema) => (
              <option key={tema.id} value={tema.id} className="text-black">
                {tema.judul}
              </option>
            ))}
          </select>

          <p className="text-purple-200 mb-2">🕒 Durasi pengerjaan (menit)</p>
          <input
            type="number"
            min={1}
            className="w-full mb-6 p-3 rounded-xl bg-white/10 border border-purple-400/50 text-white focus:outline-none"
            value={durasiMenit}
            onChange={(e) => setDurasiMenit(e.target.value)}
          />

          <button
            onClick={handleCreateRoom}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300"
          >
            🚀 Mulai Game
          </button>
        </div>
      </div>
    </div>
  );
}
