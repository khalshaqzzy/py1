import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Trophy, Medal, Award } from 'lucide-react-native';
import api from '../../src/services/api';
import { useAuthStore } from '../../src/stores/authStore';

interface LeaderboardEntry {
  username: string;
  score: number;
  time: number;
}

type Category = 'overall' | '1' | '2' | '3';

export default function LeaderboardScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>('overall');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const currentUser = useAuthStore((state) => state.user);

  const categories = [
    { id: 'overall', label: 'Overall' },
    { id: '1', label: 'Mod 1' },
    { id: '2', label: 'Mod 2' },
    { id: '3', label: 'Mod 3' },
  ];

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<LeaderboardEntry[]>(`/leaderboards/${activeCategory}`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [activeCategory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeaderboard();
  }, [activeCategory]);

  const formatTime = (seconds: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy size={20} color="#FACC15" />;
    if (rank === 2) return <Medal size={20} color="#94A3B8" />;
    if (rank === 3) return <Award size={20} color="#B45309" />;
    return null;
  };

  return (
    <View className="flex-1 bg-[#121212]">
      {/* Category Tabs */}
      <View className="px-4 py-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id as Category)}
              className={`px-6 py-3 rounded-2xl mr-3 border ${
                activeCategory === cat.id ? 'bg-white border-white' : 'bg-[#1E1E1E] border-[#333]'
              }`}
            >
              <Text className={`font-bold ${activeCategory === cat.id ? 'text-[#121212]' : 'text-gray-400'}`}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
      >
        {isLoading && !refreshing ? (
          <ActivityIndicator color="#fff" size="large" className="mt-20" />
        ) : leaderboard.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500">No data available yet.</Text>
          </View>
        ) : (
          <View className="bg-[#1E1E1E] rounded-3xl border border-[#333] overflow-hidden mb-10">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.username === currentUser?.username;
              return (
                <View 
                  key={rank} 
                  className={`flex-row items-center p-5 border-b border-[#333] ${isCurrentUser ? 'bg-[#252525]' : ''}`}
                >
                  <View className="w-10 items-center justify-center">
                    {getRankIcon(rank) || <Text className="text-gray-500 font-bold">#{rank}</Text>}
                  </View>
                  
                  <View className="flex-1 ml-2">
                    <Text className={`text-lg font-bold ${isCurrentUser ? 'text-white' : 'text-gray-300'}`}>
                      {entry.username} {isCurrentUser && <Text className="text-xs text-gray-500">(You)</Text>}
                    </Text>
                    <Text className="text-gray-500 text-xs font-mono">{formatTime(entry.time)}</Text>
                  </View>

                  <View className="items-end">
                    <Text className="text-white text-xl font-bold font-mono">{Math.round(entry.score)}</Text>
                    <Text className="text-gray-500 text-[10px] uppercase font-bold">Points</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}