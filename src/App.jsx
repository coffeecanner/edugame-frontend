// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import GameLobbyPage from '@/pages/GameLobby.jsx'
import WaitingRoom from '@/pages/WaitingRoom.jsx'
import LiveLeaderboard from '@/pages/LiveLeaderboard.jsx'
import FinalLeaderboard from '@/pages/FinalLeaderboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GameLobbyPage />} />
      <Route path="/room_peserta/:roomId" element={<WaitingRoom />} />
      <Route path="/live-leaderboard/:roomId" element={<LiveLeaderboard />} />
      <Route path="/final-leaderboard/:roomId" element={<FinalLeaderboard />} />
    </Routes>
  )
}
