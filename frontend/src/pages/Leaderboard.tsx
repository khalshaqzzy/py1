import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';

interface LeaderboardEntry {
  username: string;
  score: number;
  time: number;
}

type LeaderboardCategory = '1' | '2' | '3' | 'overall';

export default function Leaderboard() {
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategory>('overall');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useAuthStore((state) => state.user);

  const categories: { id: LeaderboardCategory; label: string }[] = [
    { id: 'overall', label: 'Overall' },
    { id: '1', label: 'Conditional' },
    { id: '2', label: 'Looping' },
    { id: '3', label: 'Function & Procedure' },
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<LeaderboardEntry[]>(`/leaderboards/${activeCategory}`);
        setLeaderboard(response.data);
      } catch (err) {
        setError('Failed to load leaderboard data.');
        console.error(err);
      }
      setIsLoading(false);
    };

    fetchLeaderboard();
  }, [activeCategory]);

  const formatTime = (seconds: number) => {
    if (seconds === undefined || seconds === null) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={20} className="text-yellow-400" />;
      case 2:
        return <Medal size={20} className="text-gray-400" />;
      case 3:
        return <Award size={20} className="text-amber-700" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Trophy size={32} className="text-white" />
        <h1 className="text-4xl font-bold text-white">Leaderboard</h1>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeCategory === category.id
                  ? 'bg-white text-[#121212]'
                  : 'bg-[#1E1E1E] text-[#EAEAEA] border border-[#333333] hover:border-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1E1E1E] border border-[#333333] rounded-lg overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#333333]">
                <th className="text-left p-4 text-[#888888] font-semibold text-sm w-20">Rank</th>
                <th className="text-left p-4 text-[#888888] font-semibold text-sm">Username</th>
                <th className="text-right p-4 text-[#888888] font-semibold text-sm w-32">Score</th>
                <th className="text-right p-4 text-[#888888] font-semibold text-sm w-40">Time</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center p-10 text-[#888888]">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="text-center p-10 text-red-400">
                    {error}
                  </td>
                </tr>
              ) : leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-10 text-[#888888]">
                    No data available for this category yet.
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrentUser = entry.username === currentUser?.username;
                  return (
                    <tr
                      key={rank}
                      className={`border-b border-[#333333] last:border-b-0 transition-colors ${
                        isCurrentUser ? 'bg-[#2A2A2A]' : 'hover:bg-[#252525]'
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(rank)}
                          <span className={`font-semibold ${isCurrentUser ? 'text-white' : 'text-[#EAEAEA]'}`}>#{rank}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`${isCurrentUser ? 'text-white font-semibold' : 'text-[#EAEAEA]'}`}>
                          {entry.username}
                          {isCurrentUser && <span className="ml-2 text-xs text-[#888888]">(You)</span>}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-mono ${isCurrentUser ? 'text-white font-semibold' : 'text-[#EAEAEA]'}`}>
                          {Math.round(entry.score)}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-mono text-[#888888]`}>
                          {formatTime(entry.time)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-[#1E1E1E] border border-[#333333] rounded-lg p-6">
        <h3 className="text-white font-semibold mb-3">Ranking Information:</h3>
        <ul className="space-y-2 text-[#888888] text-sm list-disc list-inside">
          <li>Rankings are based on your best exam scores.</li>
          <li>Higher scores rank higher on the leaderboard.</li>
          <li>In case of a tie, faster completion time wins.</li>
          <li>Practice exercises do not affect your ranking.</li>
          <li>The 'Overall' category shows the best score from any module for each user.</li>
        </ul>
      </div>
    </div>
  );
}
