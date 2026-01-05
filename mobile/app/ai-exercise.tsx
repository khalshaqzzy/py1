import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useModuleStore } from '../src/stores/moduleStore';
import { useSessionStore } from '../src/stores/sessionStore';
import { Sparkles, Loader2, ChevronLeft } from 'lucide-react-native';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

export default function AIExerciseScreen() {
  const router = useRouter();
  const { modules } = useModuleStore();
  const { createSession } = useSessionStore();

  const [selectedModId, setSelectedModId] = useState<number>(modules[0]?.id || 1);
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [instructions, setInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const session = await createSession({
        type: 'ai',
        moduleId: selectedModId,
        difficulty,
        instructions
      });
      router.replace(`/workspace/ai/${session._id}`);
    } catch (error) {
      console.error('Failed to create AI session:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#121212]"
    >
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <TouchableOpacity onPress={() => router.back()} className="mb-6">
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-3 mb-8">
          <Sparkles size={32} color="#fff" />
          <Text className="text-3xl font-bold text-white">AI Exercise</Text>
        </View>

        {/* Module Selection */}
        <View className="mb-8">
          <Text className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Select Module</Text>
          <View className="space-y-3">
            {modules.map((mod) => (
              <TouchableOpacity
                key={mod.id}
                onPress={() => setSelectedModId(mod.id)}
                className={`p-5 rounded-2xl border-2 ${
                  selectedModId === mod.id ? 'border-white bg-[#1E1E1E]' : 'border-[#333] bg-[#121212]'
                }`}
              >
                <Text className={`font-bold text-lg ${selectedModId === mod.id ? 'text-white' : 'text-gray-500'}`}>
                  {mod.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Difficulty Selection */}
        <View className="mb-8">
          <Text className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Difficulty Level</Text>
          <View className="flex-row gap-3">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setDifficulty(level)}
                className={`flex-1 py-4 rounded-xl items-center border ${
                  difficulty === level ? 'bg-white border-white' : 'bg-[#1E1E1E] border-[#333]'
                }`}
              >
                <Text className={`font-bold ${difficulty === level ? 'text-[#121212]' : 'text-gray-500'}`}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Instructions */}
        <View className="mb-10">
          <Text className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Custom Instructions (Optional)</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={instructions}
            onChangeText={setInstructions}
            className="bg-[#1E1E1E] border border-[#333] rounded-2xl p-5 text-white text-base text-start"
            placeholder="e.g. Create a problem about finding prime numbers..."
            placeholderTextColor="#555"
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          onPress={handleGenerate}
          disabled={isGenerating}
          className="bg-white py-5 rounded-2xl items-center flex-row justify-center gap-3"
          activeOpacity={0.8}
        >
          {isGenerating ? (
            <ActivityIndicator color="#121212" />
          ) : (
            <>
              <Sparkles size={20} color="#121212" fill="#121212" />
              <Text className="text-[#121212] font-bold text-xl">Generate Problems</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
