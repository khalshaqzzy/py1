import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import api from '../../../src/services/api';
import CodeEditor from '../../../src/components/CodeEditor';
import { Play, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, XCircle } from 'lucide-react-native';
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

  const fetchSession = async () => {
    try {
      const response = await api.get(`/sessions/${sessionId}`);
      setSession(response.data);
    } catch (error) {
      console.error('Failed to fetch session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const handleSubmit = async () => {
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
  };

  if (isLoading || !session) {
    return (
      <View className="flex-1 bg-[#121212] items-center justify-center">
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  const problem = session.problemIds[currentProblemIdx];

  // --- VIEWS ---
  const ProblemView = () => (
    <ScrollView className="flex-1 p-6 bg-[#121212]">
      <Text className="text-white text-2xl font-bold mb-4">
        Problem {currentProblemIdx + 1} of {session.problemIds.length}
      </Text>
      <Text className="text-[#EAEAEA] text-lg leading-7 mb-6">
        {problem.description.replace(/<br\s*\/?>/gi, '\n')}
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

  const EditorView = () => (
    <View className="flex-1 bg-[#121212]">
      <CodeEditor code={code} onChange={setCode} />
      <View className="p-4 bg-[#1E1E1E] border-t border-[#333]">
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

  const ResultsView = () => (
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

  const renderScene = SceneMap({
    problem: ProblemView,
    editor: EditorView,
    results: ResultsView,
  });

  return (
    <SafeAreaView className="flex-1 bg-[#1E1E1E]">
      <View className="px-6 py-4 flex-row justify-between items-center bg-[#1E1E1E]">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg">Workspace</Text>
        <View className="w-6" />
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
