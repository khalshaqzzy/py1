import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../src/services/api';
import CodeEditor from '../../../src/components/CodeEditor';
import { Play, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react-native';
import { useSessionStore } from '../../../src/stores/sessionStore';

// --- TYPES ---
interface ITestCase {
  input: string;
  expectedOutput: string;
  isExample: boolean;
}

interface IProblem {
  _id: string;
  moduleId: number;
  description: string;
  bannedFunctions: string[];
  testCases: ITestCase[];
}

interface ISession {
  _id: string;
  type: 'exam' | 'ai';
  problemIds: IProblem[];
  status: 'in-progress' | 'completed';
  problemScores?: { [key: string]: number };
}

export default function WorkspaceScreen() {
  const { sessionId, type } = useLocalSearchParams<{ sessionId: string; type: string }>();
  const layout = useWindowDimensions();
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'problem', title: 'Problem' },
    { key: 'editor', title: 'Editor' },
    { key: 'results', title: 'Results' },
  ]);

  const [session, setSession] = useState<ISession | null>(null);
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [code, setCode] = useState('# Write your solution here\n');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const fetchSession = async () => {
    try {
      const response = await api.get(`/sessions/${sessionId}`);
      const data = response.data;
      setSession(data);
      
      // Load saved draft code for current problem
      const draft = await AsyncStorage.getItem(`draft_${sessionId}_${data.problemIds[currentProblemIdx]._id}`);
      if (draft) setCode(draft);
      else setCode('# Write your solution here\n');

    } catch (error) {
      console.error('Failed to fetch session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [sessionId, currentProblemIdx]);

  // Timer Effect
  useEffect(() => {
    if (session?.type === 'exam' && (session as any).endTime) {
      const interval = setInterval(() => {
        const end = new Date((session as any).endTime).getTime();
        const now = new Date().getTime();
        const remaining = Math.max(0, Math.floor((end - now) / 1000));
        setTimeRemaining(remaining);

        if (remaining === 0) {
          clearInterval(interval);
          handleGradeExam(true); // Auto-submit
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const handleCodeChange = useCallback(async (newCode: string) => {
    setCode(newCode);
    if (session) {
      await AsyncStorage.setItem(`draft_${sessionId}_${session.problemIds[currentProblemIdx]._id}`, newCode);
    }
  }, [sessionId, currentProblemIdx, session]);

  const handleGradeExam = useCallback(async (isAuto = false) => {
    const performSubmit = async () => {
      try {
        await api.post(`/submit/${sessionId}/grade`);
        router.replace('/dashboard');
      } catch (error) {
        console.error('Final grading failed:', error);
      }
    };

    if (isAuto) {
      performSubmit();
    } else {
      Alert.alert(
        'Finish Exam',
        'Are you sure you want to submit your exam? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', onPress: performSubmit }
        ]
      );
    }
  }, [sessionId, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = useCallback(async () => {
    if (!session) return;
    const problem = session.problemIds[currentProblemIdx];
    
    setIsSubmitting(true);
    setIndex(2); // Auto switch to Results tab
    
    try {
      const response = await api.post('/submit', {
        sessionId,
        problemId: problem._id,
        code,
      });
      setSubmissionResult(response.data);
    } catch (error: any) {
      setSubmissionResult({
        message: 'Submission failed.',
        passed_count: 0,
        totalTestCases: 0,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [session, currentProblemIdx, sessionId, code]);

  // --- STABLE SCENES ---
  const renderScene = useCallback(({ route }: any) => {
    if (!session) return null;
    const problem = session.problemIds[currentProblemIdx];

    switch (route.key) {
      case 'problem':
        return (
          <ScrollView className="flex-1 p-6 bg-[#121212]">
            <Text className="text-white text-2xl font-bold mb-4">
              Problem {currentProblemIdx + 1} of {session.problemIds.length}
            </Text>
            <Text className="text-[#EAEAEA] text-lg leading-7 mb-6">
              {problem.description.replace(/<br\s*\/?\?>/gi, '\n')}
            </Text>
            
            {problem.bannedFunctions.length > 0 && (
              <View className="bg-red-950/20 border border-red-900/50 p-4 rounded-xl mb-6 flex-row gap-3">
                <AlertCircle size={20} color="#f87171" />
                <View className="flex-1">
                  <Text className="text-red-400 font-bold mb-1">Banned Functions</Text>
                  <Text className="text-red-400/80 text-sm">
                    You cannot use: {problem.bannedFunctions.join(', ')}
                  </Text>
                </View>
              </View>
            )}

            <Text className="text-white font-bold text-lg mb-3">Example Cases</Text>
            {problem.testCases.filter(tc => tc.isExample).map((tc, i) => (
              <View key={i} className="bg-[#1E1E1E] p-4 rounded-xl mb-4 border border-[#333]">
                <Text className="text-gray-500 font-bold text-xs uppercase mb-1">Input</Text>
                <Text className="text-white font-mono mb-3">{tc.input}</Text>
                <Text className="text-gray-500 font-bold text-xs uppercase mb-1">Expected Output</Text>
                <Text className="text-green-400 font-mono">{tc.expectedOutput}</Text>
              </View>
            ))}
          </ScrollView>
        );
      case 'editor':
        return (
          <View className="flex-1 bg-[#121212]">
            <CodeEditor 
              key={currentProblemIdx}
              code={code} 
              onChange={handleCodeChange} 
            />
            <View className="p-4 bg-[#1E1E1E] border-t border-[#333]">
              <View className="flex-row gap-3 mb-4">
                <TouchableOpacity 
                  onPress={() => setCurrentProblemIdx(Math.max(0, currentProblemIdx - 1))}
                  disabled={currentProblemIdx === 0}
                  className="flex-1 bg-[#121212] border border-[#333] py-3 rounded-xl items-center disabled:opacity-30"
                >
                  <Text className="text-white font-bold">Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setCurrentProblemIdx(Math.min(session.problemIds.length - 1, currentProblemIdx + 1))}
                  disabled={currentProblemIdx === session.problemIds.length - 1}
                  className="flex-1 bg-[#121212] border border-[#333] py-3 rounded-xl items-center disabled:opacity-30"
                >
                  <Text className="text-white font-bold">Next</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                onPress={handleSubmit}
                disabled={isSubmitting}
                className="bg-white py-4 rounded-2xl flex-row justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#121212" />
                ) : (
                  <>
                    <Play size={20} color="#121212" fill="#121212" />
                    <Text className="text-[#121212] font-bold text-lg">Run & Submit</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'results':
        return (
          <ScrollView className="flex-1 p-6 bg-[#121212]">
            {!submissionResult ? (
              <View className="items-center justify-center py-20">
                <Play size={48} color="#333" />
                <Text className="text-gray-500 mt-4">Run your code to see results.</Text>
              </View>
            ) : (
              <View>
                <View className={`p-6 rounded-2xl mb-6 flex-row items-center gap-4 ${ 
                  submissionResult.passed_count === submissionResult.totalTestCases 
                  ? 'bg-green-950/30 border border-green-900' 
                  : 'bg-red-950/30 border border-red-900'
                }`}>
                  {submissionResult.passed_count === submissionResult.totalTestCases 
                    ? <CheckCircle2 size={32} color="#4ADE80" />
                    : <XCircle size={32} color="#F87171" />
                  }
                  <View>
                    <Text className="text-white font-bold text-xl">
                      {submissionResult.passed_count} / {submissionResult.totalTestCases} Passed
                    </Text>
                    <Text className="text-gray-400">{submissionResult.message}</Text>
                  </View>
                </View>

                {submissionResult.results?.filter((r: any) => !r.passed).map((res: any, i: number) => (
                  <View key={i} className="bg-[#1E1E1E] p-5 rounded-2xl mb-4 border border-red-900/30">
                    <Text className="text-red-400 font-bold mb-3">Failed Test Case {i + 1}</Text>
                    <Text className="text-gray-500 text-xs font-bold uppercase">Input</Text>
                    <Text className="text-white font-mono mb-3">{res.testCase.input}</Text>
                    <Text className="text-gray-500 text-xs font-bold uppercase">Expected</Text>
                    <Text className="text-green-400 font-mono mb-3">{res.testCase.expectedOutput}</Text>
                    <Text className="text-gray-500 text-xs font-bold uppercase">Your Output</Text>
                    <Text className="text-red-400 font-mono">{res.actualOutput || '(No output)'}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        );
      default:
        return null;
    }
  }, [session, currentProblemIdx, code, isSubmitting, submissionResult, handleCodeChange, handleSubmit]);

  if (isLoading || !session) {
    return (
      <View className="flex-1 bg-[#121212] items-center justify-center">
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#1E1E1E]">
      <View className="px-6 py-4 flex-row justify-between items-center bg-[#1E1E1E]">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        
        <View className="items-center">
          <Text className="text-white font-bold text-lg">Workspace</Text>
          {timeRemaining !== null && (
            <View className="flex-row items-center gap-1">
              <Clock size={12} color={timeRemaining < 300 ? "#F87171" : "#888"} />
              <Text className={`text-xs font-mono ${timeRemaining < 300 ? "text-red-400" : "text-gray-400"}`}>
                {formatTime(timeRemaining)}
              </Text>
            </View>
          )}
        </View>

        {session.type === 'exam' ? (
          <TouchableOpacity onPress={() => handleGradeExam(false)}>
            <Text className="text-green-500 font-bold">Grade</Text>
          </TouchableOpacity>
        ) : <View className="w-6" />}
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'white', height: 3 }}
            style={{ backgroundColor: '#1E1E1E' }}
            activeColor="white"
            inactiveColor="#888"
          />
        )}
      />
    </SafeAreaView>
  );
}