import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ParticleCanvas from '@/components/ParticleCanvas';
import { Button } from '@/components/ui/button';
import Lottie from 'lottie-react';
import rocketAnimation from '@/assets/rocket.json'; // optional

const LiveLeaderboard = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [leaderboard, setLeaderboard] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState('--:--');
  const [endTime, setEndTime] = useState(null);
  const [lastScores, setLastScores] = useState({});
  const [lastRanks, setLastRanks] = useState({});
  const [rankChanges, setRankChanges] = useState({});

  const fetchRoomInfo = async () => {
    try {
      const res = await fetch(`https://edugame-api.fly.dev/info_room/${roomId}`);
      const data = await res.json();
      setRoomInfo(data);

      if (data.waktu_mulai && data.durasi_menit) {
        const mulai = new Date(data.waktu_mulai + 'Z');
        const end = new Date(mulai.getTime() + data.durasi_menit * 60000);
        setEndTime(end);
        updateTimeLeft(end);
      }
    } catch (err) {
      console.error('Gagal fetch info room:', err);
    }
  };

  const updateTimeLeft = (targetTime = endTime) => {
    if (!targetTime) return;
    const now = new Date();
    const diff = targetTime - now;

    if (diff <= 0) {
      setTimeLeft('00:00');
    } else {
      const minutes = String(Math.floor(diff / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setTimeLeft(`${minutes}:${seconds}`);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`https://edugame-api.fly.dev/leaderboard/${roomId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const updatedScores = {};
        data.forEach((entry) => {
          const prevScore = lastScores[entry.nama_user] || 0;
          if (entry.skor > prevScore) {
            updatedScores[entry.nama_user] = entry.skor;
          }
        });
        setLastScores((prev) => ({ ...prev, ...updatedScores }));

        const newRanks = {};
        data.forEach((entry, idx) => {
          newRanks[entry.nama_user] = idx;
        });

        const changes = {};
        Object.keys(newRanks).forEach((nama_user) => {
          if (nama_user in lastRanks) {
            const diff = lastRanks[nama_user] - newRanks[nama_user];
            if (diff !== 0) {
              changes[nama_user] = diff;
            }
          }
        });

        setLastRanks(newRanks);
        setRankChanges(changes);
        setLeaderboard(data);
      }
    } catch (err) {
      console.error('Gagal ambil leaderboard:', err);
    }
  };

  const handleSelesaikan = async () => {
    try {
      await fetch(`https://edugame-api.fly.dev/selesai_room/${roomId}`, { method: 'POST' });
      fetchLeaderboard();
    } catch (err) {
      alert('Gagal menyelesaikan game.');
    }
  };

  const cekStatusRoom = async () => {
    try {
      const res = await fetch(`https://edugame-api.fly.dev/status_room/${roomId}`);
      const data = await res.json();
      if (data.aktif === false) {
        navigate(`/final-leaderboard/${roomId}`);
      }
    } catch (err) {
      console.error('Gagal cek status room:', err);
    }
  };

  useEffect(() => {
    fetchRoomInfo();
    fetchLeaderboard();
    const interval = setInterval(() => {
      fetchLeaderboard();
      cekStatusRoom();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!endTime) return;
    const interval = setInterval(() => {
      updateTimeLeft();
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="relative min-h-screen font-sans text-white overflow-hidden bg-[#0d1117]">
      <ParticleCanvas />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-purple-900 via-indigo-900 to-black opacity-80" />

      <div className="relative z-20 grid grid-cols-3 gap-8 p-10 min-h-screen items-start">
        {/* KOTAK INFO */}
        <div className="col-span-1 bg-white/10 backdrop-blur-2xl p-6 rounded-2xl shadow-xl border border-purple-400/40 space-y-4 animate-fadeIn">
          <h2 className="text-xl font-bold text-purple-200">🕒 Waktu Tersisa</h2>
          <div className="text-5xl font-mono text-purple-100">{timeLeft}</div>

          {roomInfo && (
            <div className="text-sm text-purple-100 mt-4 space-y-1">
              <p><strong>📛 Nama Room:</strong> {roomInfo.nama_room}</p>
              <p><strong>🎨 Tema:</strong> {roomInfo.tema}</p>
              <p><strong>⏳ Durasi:</strong> {roomInfo.durasi_menit} menit</p>
              <p><strong>📚 Materi:</strong> {roomInfo.jumlah_materi}</p>
              <p><strong>❓ Total Soal:</strong> {roomInfo.jumlah_soal}</p>
            </div>
          )}

          <Button
            onClick={handleSelesaikan}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
          >
            ❌ Selesaikan Game Sekarang
          </Button>
        </div>

        {/* LEADERBOARD */}
        <div className="col-span-2 bg-white/10 backdrop-blur-2xl p-8 rounded-2xl shadow-xl border border-purple-400/40 animate-fadeInUp">
          <h2 className="text-3xl font-extrabold text-purple-200 mb-6">🏁 Leaderboard Langsung</h2>

          {leaderboard.length === 0 ? (
            <div className="text-center text-gray-300">⏳ Menunggu peserta menyelesaikan permainan...</div>
          ) : (
            <ul className="space-y-3">
              {leaderboard.map((entry, index) => {
                const newScore = lastScores[entry.nama_user] === entry.skor;
                const rankDiff = rankChanges[entry.nama_user] || 0;

                return (
                  <li
                    key={index}
                    className={`flex justify-between items-center px-6 py-4 rounded-xl shadow-lg transition-all duration-300 transform
                      ${index === 0
                        ? 'bg-yellow-400/30 text-yellow-100 font-bold'
                        : index === 1
                        ? 'bg-gray-400/20 text-gray-200'
                        : index === 2
                        ? 'bg-amber-300/20 text-amber-100'
                        : 'bg-white/5 text-white'}
                      ${newScore ? 'animate-pulse scale-[1.02]' : ''}
                      ${rankDiff > 0 ? 'animate-rise' : rankDiff < 0 ? 'animate-fall' : ''}`}
                  >
                    <span className="flex-1">
                      #{index + 1} — {entry.nama_user}
                    </span>
                    <span className="font-mono text-xl">{entry.skor} pts</span>
                  </li>
                );
              })}
            </ul>
          )}

          {/* <div className="absolute bottom-4 right-4 w-24 opacity-60">
  <Lottie animationData={rocketAnimation} loop autoplay />
</div> */}

        </div>
      </div>
    </div>
  );
};

export default LiveLeaderboard;
