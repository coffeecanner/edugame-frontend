import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ParticleCanvas from '@/components/ParticleCanvas';

const WaitingRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [roomStatus, setRoomStatus] = useState('waiting');
  const [roomInfo, setRoomInfo] = useState(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [bigCountdown, setBigCountdown] = useState(null);

  // Fetch peserta
  const fetchParticipants = async () => {
    try {
      const res = await fetch(`https://edugame-api.fly.dev/room_peserta/${roomId}`);
      const data = await res.json();
      setParticipants(data || []);
    } catch (err) {
      console.error('Gagal ambil peserta:', err);
    }
  };

  // Cek status room
  const fetchRoomStatus = async () => {
    try {
      const res = await fetch(`https://edugame-api.fly.dev/status_room/${roomId}`);
      const data = await res.json();
      if (data.waktu_mulai && !isCountingDown) {
        setRoomStatus('started');
        setIsCountingDown(true);
      }
    } catch (err) {
      console.error('Gagal cek status room:', err);
    }
  };

  // Info room
  const fetchRoomInfo = async () => {
    try {
      const res = await fetch(`https://edugame-api.fly.dev/info_room/${roomId}`);
      const data = await res.json();
      setRoomInfo(data);
    } catch (err) {
      console.error('Gagal ambil info room:', err);
    }
  };

  // 🔥 Megah countdown 5..4..3..2..1..MULAI!
  useEffect(() => {
    if (isCountingDown) {
      let current = 5;

      const interval = setInterval(() => {
        if (current === 0) {
          setBigCountdown("MULAI!");
          setTimeout(() => setBigCountdown(null), 1000);
          navigate(`/live-leaderboard/${roomId}`);
          clearInterval(interval);
        } else {
          setBigCountdown(current);
          current--;
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCountingDown]);

  // Auto refresh data
  useEffect(() => {
    fetchParticipants();
    fetchRoomStatus();
    fetchRoomInfo();

    const interval = setInterval(() => {
      fetchParticipants();
      fetchRoomStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Start game
  const handleStartGame = async () => {
    try {
      const res = await fetch(`https://edugame-api.fly.dev/start_room/${roomId}`, { method: 'POST' });
      const data = await res.json();
      if (data.start_time) {
        setRoomStatus('started');
        setIsCountingDown(true);
      }
    } catch (err) {
      console.error('Gagal mulai game:', err);
    }
  };

  if (!roomId) return <div className="text-center mt-20 text-red-500">Room ID tidak ditemukan</div>;

  return (
    <div className="relative min-h-screen font-sans text-white">
      <ParticleCanvas />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-90" />

      {/* Countdown Megah Fullscreen */}
      {bigCountdown && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center">
          <h1 className="text-white text-[12vw] font-extrabold countdown-number select-none drop-shadow-2xl">
            {bigCountdown}
          </h1>
        </div>
      )}

      <div className="relative z-20 grid grid-cols-3 gap-6 p-10 min-h-screen">
        {/* Info Room */}
        <div className="col-span-1 bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-xl border border-purple-300">
          <h2 className="text-xl font-semibold text-purple-200 mb-4">📋 Info Room</h2>
          <p><strong>Room ID:</strong> {roomId}</p>
          {roomInfo && (
            <>
              <p><strong>Nama:</strong> {roomInfo.nama_room}</p>
              <p><strong>Tema:</strong> {roomInfo.tema}</p>
              <p><strong>Durasi:</strong> {roomInfo.durasi_menit} menit</p>
              <p><strong>Materi:</strong> {roomInfo.jumlah_materi}</p>
              <p><strong>Total Soal:</strong> {roomInfo.jumlah_soal}</p>
            </>
          )}

          {roomStatus === 'waiting' && (
            <Button
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl w-full"
              onClick={handleStartGame}
            >
              🚀 Mulai Game
            </Button>
          )}

          {roomStatus === 'started' && (
            <div className="mt-4 text-purple-300 text-lg font-bold">
              🔥 Get Ready...
            </div>
          )}
        </div>

        {/* List Peserta */}
        <div className="col-span-2 bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-xl border border-purple-300 overflow-y-auto">
          <h2 className="text-xl font-semibold text-purple-200 mb-4">🧑‍🤝‍🧑 Daftar Peserta</h2>
          <ul className="space-y-2 max-h-[65vh] overflow-y-auto pr-2">
            {participants.map((p, i) => (
              <li key={i} className="bg-white/5 border border-purple-400/10 rounded-md px-4 py-2">
                <span className="font-bold mr-2">{i + 1}.</span> 🌟 {p.nama}
              </li>
            ))}
            {participants.length === 0 && (
              <li className="text-gray-300">Belum ada peserta yang masuk.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
