import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useModuleStore } from '../src/stores/moduleStore';
import { useSessionStore } from '../src/stores/sessionStore';
import { Clock, FileText, ChevronLeft, CheckCircle } from 'lucide-react-native';

export default function ExamListScreen() {
  const router = useRouter();
  const { modules } = useModuleStore();
  const { activeSessions, completedSessions, createSession } = useSessionStore();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const getStatus = (modId: number) => {
    const active = activeSessions.find(s => s.type === 'exam' && s.moduleId === modId);
    if (active) return { status: 'in-progress', session: active };

    const completed = completedSessions.filter(s => s.type === 'exam' && s.moduleId === modId);
    if (completed.length > 0) {
      const best = Math.max(...completed.map(s => s.finalScore || 0));
      return { status: 'completed', score: best };
    }
    return { status: 'not-started' };
  };

  const handleStart = async (modId: number) => {
    setLoadingId(modId);
    try {
      const session = await createSession({ type: 'exam', moduleId: modId });
      router.replace(`/workspace/exam/${session._id}`);
    } catch (error) {
      console.error('Failed to start exam:', error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#121212]" contentContainerStyle={{ padding: 24 }}>
      <TouchableOpacity onPress={() => router.back()} className="mb-6">
        <ChevronLeft size={24} color="#fff" />
      </TouchableOpacity>

      <Text className="text-3xl font-bold text-white mb-8">Exams</Text>

      <View className="space-y-6">
        {modules.map((mod) => {
          const info = getStatus(mod.id);
          const isLoading = loadingId === mod.id;

          return (
            <View key={mod.id} className="bg-[#1E1E1E] border border-[#333] rounded-3xl p-6 mb-6">
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1">
                  <Text className="text-white text-2xl font-bold mb-2">{mod.title}</Text>
                  <View className="flex-row items-center gap-4">
                    <View className="flex-row items-center gap-1">
                      <Clock size={14} color="#888" />
                      <Text className="text-gray-500 text-xs">60 Min</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <FileText size={14} color="#888" />
                      <Text className="text-gray-500 text-xs">3 Problems</Text>
                    </View>
                  </View>
                </View>
                {info.status === 'completed' && (
                  <View className="items-end">
                    <Text className="text-gray-500 text-[10px] font-bold uppercase">Best Score</Text>
                    <Text className="text-white text-2xl font-bold font-mono">{info.score}/30</Text>
                  </View>
                )}
              </View>

              {info.status === 'in-progress' ? (
                <TouchableOpacity 
                  onPress={() => router.push(`/workspace/exam/${info.session?._id}`)}
                  className="bg-white py-4 rounded-2xl items-center"
                >
                  <Text className="text-[#121212] font-bold">Continue Exam</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  onPress={() => handleStart(mod.id)}
                  disabled={isLoading}
                  className="bg-white py-4 rounded-2xl items-center flex-row justify-center gap-2"
                >
                  {isLoading ? <ActivityIndicator color="#121212" /> : (
                    <Text className="text-[#121212] font-bold">
                      {info.status === 'completed' ? 'Retake Exam' : 'Start Exam'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
