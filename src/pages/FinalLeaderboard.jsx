import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import classNames from "classnames";

export default function FinalLeaderboard() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [finalResults, setFinalResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState("podium"); // 'podium' | 'result'

  useEffect(() => {
    fetchFinalLeaderboard();
  }, []);

  const fetchFinalLeaderboard = async () => {
    try {
      const res = await fetch(`https://edugame-api.fly.dev/final_leaderboard/${roomId}`);
      if (!res.ok) throw new Error("Belum semua peserta selesai.");
      const data = await res.json();
      setFinalResults(data);
    } catch (err) {
      alert("Leaderboard belum bisa ditampilkan. Coba lagi nanti.");
      navigate(`/`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (finalResults.length >= 3) {
      setTimeout(() => triggerConfetti(), 1000);
      setTimeout(() => setStage("result"), 3500);
    }
  }, [finalResults]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 250,
      spread: 100,
      origin: { y: 0.6 },
    });
  };

  const getMedal = (rank) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return `${rank + 1}.`;
  };

  const getLabels = (player, idx) => {
    const labels = [];
    if (idx === 0 && player.skor >= 80) labels.push("Si Profesor 🧠");
    if (player.skor < 50 && player.waktu < 60) labels.push("Si Ceroboh 😵");
    else if (player.waktu < 60) labels.push("Si Kilat ⚡");
    if (idx === finalResults.length - 1) labels.push("Si Santai 💤");
    return labels;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white p-6 overflow-hidden font-sans transition-all duration-1000">
      {/* Background bintang */}
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover opacity-10 pointer-events-none" />

      {/* Judul */}
      <h1 className="text-5xl font-extrabold text-yellow-300 text-center drop-shadow-lg animate-pulse mb-6 z-10 transition-all">
        🎉 Final Leaderboard 🎉
      </h1>

      {/* RESULT LAYOUT */}
      {stage === "result" && !loading && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-1000 ease-in-out h-[calc(100vh-12rem)]">
          {/* KIRI: PODIUM + KLASIFIKASI */}
          <div className="flex flex-col items-center w-full h-full relative">
            {/* PODIUM (mini) */}
            <div
              className={classNames(
                "z-30 absolute -top-50 transition-all duration-1000 ease-in-out",
                stage === "result" ? "scale-90 opacity-100" : "scale-0 opacity-0"
              )}
            >
              <div className="flex items-end justify-center gap-6">
                {[1, 0, 2].map((rank, i) => {
                  const player = finalResults[rank];
                  const height = [100, 160, 130][i];
                  const bg =
                    rank === 0 ? "bg-yellow-300" : rank === 1 ? "bg-gray-300" : "bg-amber-300";
                  return (
                    <div
                      key={rank}
                      className={`flex flex-col items-center justify-end text-center rounded-xl px-4 py-3 text-black font-bold shadow-2xl ${bg} animate-rise`}
                      style={{ height: `${height}px`, width: "100px" }}
                    >
                      <div className="text-2xl mb-1">{getMedal(rank)}</div>
                      <div className="text-sm">{player?.nama}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Klasifikasi */}
            <div className="w-full h-1/2 mt-40 animate-fade-in-up bg-white/10 p-6 rounded-xl backdrop-blur-md shadow-lg border border-purple-400/30 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-purple-200">🏆 Klasifikasi Unik</h2>
              <ul className="space-y-3 text-sm">
                {finalResults.map((player, idx) => {
                  const labels = getLabels(player, idx);
                  return labels.map((label, i) => (
                    <li
                      key={`${idx}-${i}`}
                      className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg shadow-inner"
                    >
                      <span className="font-semibold text-purple-100">{label}</span>
                      <div className="text-white/80 ml-2 text-xs">{player.nama}</div>
                    </li>
                  ));
                })}
              </ul>
            </div>
          </div>

          {/* KANAN: URUTAN PERINGKAT */}
          <div className="w-full h-full animate-fade-in-down bg-white/10 p-6 rounded-xl backdrop-blur-md shadow-lg border border-purple-400/30 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-purple-200">🏁 Urutan Peringkat</h2>
            <ul className="space-y-3 overflow-hidden">
              {finalResults.map((player, idx) => {
                const bg =
                  idx === 0
                    ? "bg-yellow-500/20"
                    : idx === 1
                    ? "bg-gray-400/20"
                    : idx === 2
                    ? "bg-amber-400/20"
                    : "bg-white/10";
                return (
                  <li
                    key={idx}
                    className={`${bg} border border-purple-300/20 px-4 py-3 rounded-lg flex justify-between items-center shadow animate-fade-in-down`}
                    style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "forwards" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getMedal(idx)}</span>
                      <span className="font-semibold">{player.nama}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-lg">{player.skor} pts</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* PODIUM BESAR (awal) */}
      {stage === "podium" && finalResults.length >= 3 && (
        <div
          className={classNames(
            "z-40 fixed inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out",
            stage === "podium" ? "scale-100 opacity-100" : "scale-90 opacity-0"
          )}
        >
          <div className="flex items-end justify-center gap-6">
            {[1, 0, 2].map((rank, i) => {
              const player = finalResults[rank];
              const height = [100, 160, 130][i];
              const bg =
                rank === 0 ? "bg-yellow-300" : rank === 1 ? "bg-gray-300" : "bg-amber-300";
              return (
                <div
                  key={rank}
                  className={`flex flex-col items-center justify-end text-center rounded-xl px-4 py-3 text-black font-bold shadow-2xl ${bg} animate-rise`}
                  style={{ height: `${height}px`, width: "100px" }}
                >
                  <div className="text-2xl mb-1">{getMedal(rank)}</div>
                  <div className="text-sm">{player?.nama}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TOMBOL KEMBALI */}
      {stage === "result" && !loading && (
        <button
          onClick={() => navigate("/")}
          className="mt-10 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white text-lg font-semibold rounded-full shadow-xl transition"
        >
          🔙 Kembali ke Beranda
        </button>
      )}
    </div>
  );
}
