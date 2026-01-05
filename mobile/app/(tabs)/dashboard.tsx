import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useAuthStore } from '../../src/stores/authStore';
import { useModuleStore } from '../../src/stores/moduleStore';
import { useSessionStore } from '../../src/stores/sessionStore';
import { Clock, CheckCircle, Sparkles, ChevronRight, FileText, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { modules, progress, fetchModules, fetchProgress } = useModuleStore();
  const { activeSessions, completedSessions, fetchActiveSessions, fetchCompletedSessions } = useSessionStore();
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchModules(),
      fetchProgress(),
      fetchActiveSessions(),
      fetchCompletedSessions()
    ]);
    setRefreshing(false);
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        }
      },
    ]);
  };

  const inProgressSessions = activeSessions.filter(s => s.status === 'in-progress');
  const examResults = completedSessions.filter(s => s.type === 'exam');

  return (
    <ScrollView 
      className="flex-1 bg-[#121212]"
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
      }
    >
      <View className="mb-8 flex-row justify-between items-start">
        <View>
          <Text className="text-gray-400 text-lg">Hello,</Text>
          <Text className="text-white text-3xl font-bold">{user?.username || 'Student'}!</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="p-2 bg-[#1E1E1E] rounded-full border border-[#333]">
          <LogOut size={20} color="#F87171" />
        </TouchableOpacity>
      </View>

      {/* Continue Your Work */}
      {inProgressSessions.length > 0 && (
        <View className="mb-8">
          <Text className="text-white text-xl font-bold mb-4">Continue Your Work</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {inProgressSessions.map((session) => {
              const module = modules.find(m => m.id === session.moduleId);
              return (
                <TouchableOpacity
                  key={session._id}
                  onPress={() => router.push(`/workspace/${session.type}/${session._id}`)}
                  className="bg-[#1E1E1E] border border-[#333333] rounded-2xl p-5 mr-4 w-64"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center gap-2 mb-2">
                    {session.type === 'ai' ? <Sparkles size={16} color="#fff" /> : <Clock size={16} color="#fff" />}
                    <Text className="text-gray-400 text-sm capitalize">
                      {session.type === 'ai' ? 'AI Exercise' : 'Exam'}
                    </Text>
                  </View>
                  <Text className="text-white text-lg font-bold mb-1" numberOfLines={1}>
                    {module?.title || 'Loading...'}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {session.problemIds.length} problems
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Exam Results */}
      {examResults.length > 0 && (
        <View className="mb-8">
          <Text className="text-white text-xl font-bold mb-4">Exam Results</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {examResults.map((session) => {
              const module = modules.find(m => m.id === session.moduleId);
              return (
                <View
                  key={session._id}
                  className="bg-[#1E1E1E] border border-[#333333] rounded-2xl p-5 mr-4 w-48"
                >
                  <View className="flex-row justify-between items-center mb-3">
                    <CheckCircle size={16} color="#4ADE80" />
                    <Text className="text-white font-mono font-bold">{session.finalScore}/30</Text>
                  </View>
                  <Text className="text-gray-300 font-bold text-sm mb-1" numberOfLines={1}>
                    {module?.title || 'Exam'}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {new Date(session.startTime).toLocaleDateString()}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Action Shortcuts */}
      <View className="flex-row gap-4 mb-8">
        <TouchableOpacity 
          onPress={() => router.push('/exam-list')}
          className="flex-1 bg-[#1E1E1E] border border-[#333] p-5 rounded-3xl items-center"
        >
          <FileText size={24} color="#fff" />
          <Text className="text-white font-bold mt-2">Exam</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => router.push('/ai-exercise')}
          className="flex-1 bg-[#1E1E1E] border border-[#333] p-5 rounded-3xl items-center"
        >
          <Sparkles size={24} color="#fff" />
          <Text className="text-white font-bold mt-2">AI Practice</Text>
        </TouchableOpacity>
      </View>

      {/* Learning Progress */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-xl font-bold">Start Learning</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/modules')}>
            <Text className="text-gray-400">See all</Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          {modules.map((module) => {
            const moduleProgress = progress.find(p => p.moduleId === String(module.id))?.progress || 0;
            return (
              <TouchableOpacity
                key={module.id}
                onPress={() => router.push(`/modules/${module.id}/1`)}
                className="bg-[#1E1E1E] border border-[#333333] rounded-2xl p-5"
                activeOpacity={0.7}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-white text-lg font-bold mb-1">{module.title}</Text>
                    <Text className="text-gray-500 text-sm" numberOfLines={2}>{module.description}</Text>
                  </View>
                  {moduleProgress === 100 ? (
                    <CheckCircle size={24} color="#4ADE80" />
                  ) : (
                    <ChevronRight size={20} color="#555" />
                  )}
                </View>
                
                <View>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-400 text-xs font-semibold">Progress</Text>
                    <Text className="text-white text-xs font-bold">{moduleProgress}%</Text>
                  </View>
                  <View className="w-full bg-[#121212] rounded-full h-2">
                    <View 
                      className="bg-white h-2 rounded-full" 
                      style={{ width: `${moduleProgress}%` }} 
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
