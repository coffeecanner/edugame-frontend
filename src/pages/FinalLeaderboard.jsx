import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

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
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 1000);
      setTimeout(() => setStage("result"), 3000);
    }
  }, [finalResults]);

  const getMedal = (rank) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return `${rank + 1}.`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8 font-sans flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-8 text-purple-700 drop-shadow-md">
        🎉 Final Leaderboard 🎉
      </h1>

      {loading && <p>Loading leaderboard...</p>}

      {/* PODIUM BESAR */}
      {stage === "podium" && finalResults.length >= 3 && !loading && (
        <div className="flex items-end justify-center gap-8 mb-10">
          {[1, 0, 2].map((rank, i) => {
            const player = finalResults[rank];
            const height = [120, 180, 140][i];
            const bgColor =
              rank === 0 ? "bg-yellow-400" : rank === 1 ? "bg-gray-400" : "bg-amber-400";
            return (
              <div
                key={rank}
                className={`flex flex-col items-center justify-end rounded-lg px-6 py-4 text-black font-bold shadow-md ${bgColor}`}
                style={{ height: `${height}px`, width: "120px" }}
              >
                <div className="text-3xl mb-2">{getMedal(rank)}</div>
                <div className="text-lg">{player?.nama}</div>
                <div className="text-sm mt-1 font-mono">{player?.skor} pts</div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST PERINGKAT */}
      {stage === "result" && !loading && (
        <div className="w-full max-w-xl bg-gray-100 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-700">🏁 Daftar Peringkat</h2>
          <ul>
            {finalResults.map((player, idx) => {
              const bg =
                idx === 0
                  ? "bg-yellow-200"
                  : idx === 1
                  ? "bg-gray-300"
                  : idx === 2
                  ? "bg-amber-300"
                  : "bg-white";
              return (
                <li
                  key={idx}
                  className={`${bg} border border-gray-300 px-4 py-3 rounded-md flex justify-between items-center mb-2`}
                >
                  <span className="text-lg font-semibold flex items-center gap-3">
                    <span>{getMedal(idx)}</span> {player.nama}
                  </span>
                  <span className="font-mono text-lg">{player.skor} pts</span>
                </li>
              );
            })}
          </ul>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold w-full"
          >
            🔙 Kembali ke Beranda
          </button>
        </div>
      )}
    </div>
  );
}
