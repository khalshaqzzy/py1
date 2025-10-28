import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import axios from 'axios';
import { Clock, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useSessionStore } from '../stores/sessionStore';
import WorkspaceHeader from '../components/WorkspaceHeader';

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
  title?: string; 
}

interface ISession {
  _id: string;
  type: 'exam' | 'ai';
  problemIds: IProblem[];
  status: 'in-progress' | 'completed';
  endTime?: string;
  problemScores?: { [key: string]: number };
  lastSubmissionResult?: {
    problemId: string;
    result: ISubmissionResult;
  };
}

interface ISubmissionResult {
  finalScore: number;
  totalTestCases: number;
  passed_count: number;
  results: {
    testCase: ITestCase;
    passed: boolean;
    actualOutput: string;
    error: string | null;
  }[];
  sessionStatus: 'in-progress' | 'completed';
  message: string;
  status?: string;
  problemScores?: { [key: string]: number };
}

export default function Workspace() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { gradeExam } = useSessionStore();

  const [sessionData, setSessionData] = useState<ISession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState('# Write your solution here\n');
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'examples' | 'results'>('examples');
  const [submissionResult, setSubmissionResult] = useState<ISubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const problem = sessionData?.problemIds[currentProblemIndex];

  const handleGradeExam = useCallback(async (isAutoSubmit = false) => {
    if (!sessionId || isGrading) return;

    if (!isAutoSubmit) {
      const confirmation = window.confirm('Are you sure you want to finish and submit your exam? This action cannot be undone.');
      if (!confirmation) return;
    }

    setIsGrading(true);
    try {
      await gradeExam(sessionId);
      if (isAutoSubmit) {
        alert("Timer has finished and your exam has been submitted.");
      }
      navigate('/dashboard');
    } catch (err) {
      console.error("Failed to grade exam:", err);
      setError("An error occurred while submitting the exam. Please try again.");
    } finally {
      setIsGrading(false);
    }
  }, [sessionId, isGrading, gradeExam, navigate]);

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      const response = await api.get<ISession>(`/sessions/${sessionId}`);
      const data = response.data;
      setSessionData(data);

      if (isLoading) {
        if (data.lastSubmissionResult) {
          const lastProblemId = data.lastSubmissionResult.problemId;
          const lastProblemIndex = data.problemIds.findIndex(p => p._id === lastProblemId);
          if (lastProblemIndex !== -1) {
            setCurrentProblemIndex(lastProblemIndex);
          }
          setSubmissionResult(data.lastSubmissionResult.result);
          setActiveTab('results');
        }
      }

    } catch {
      setError('Failed to load session. Please ensure the session exists and you have access.');
    } finally {
      if (isLoading) {
        setIsLoading(false);
      }
    }
  }, [sessionId, isLoading]);

  // Initial fetch
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Timer effect
  const hasSubmitted = useRef(false);
  useEffect(() => {
    if (sessionData?.type === 'exam' && sessionData.endTime) {
      const interval = setInterval(() => {
        const end = new Date(sessionData.endTime!).getTime();
        const now = new Date().getTime();
        const distance = end - now;
        const remaining = Math.max(0, Math.floor(distance / 1000));
        setTimeRemaining(remaining);

        if (remaining === 0 && !hasSubmitted.current) {
          hasSubmitted.current = true;
          clearInterval(interval);
          handleGradeExam(true); // Auto-submit
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sessionData, handleGradeExam]);

  useEffect(() => {
    if (problem) {
      const savedCode = localStorage.getItem(`code_${sessionId}_${problem._id}`);
      setCode(savedCode || '# Write your solution here\n');
    }
  }, [problem, sessionId]);

  // View reset effect when problem changes
  useEffect(() => {
    setSubmissionResult(null);
    setActiveTab('examples');
  }, [currentProblemIndex]);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    if (problem) {
      localStorage.setItem(`code_${sessionId}_${problem._id}`, newCode);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    setSubmissionResult(null);
    setActiveTab('results');
    try {
      const response = await api.post<ISubmissionResult>('/submit', {
        sessionId,
        problemId: problem._id,
        code,
      });
      const resultData = response.data;
      setSubmissionResult(resultData);

      // Update session langsung dari response
      if (resultData.problemScores) {
        setSessionData(currentData => {
          if (!currentData) return null;
          return {
            ...currentData,
            problemScores: resultData.problemScores,
          };
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setSubmissionResult(err.response.data as ISubmissionResult);
      } else {
        setSubmissionResult({
          message: 'An unexpected error occurred during submission.',
          finalScore: 0,
          totalTestCases: 0,
          passed_count: 0,
          results: [],
          sessionStatus: sessionData?.status || 'in-progress',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-[#121212] text-white"><Loader2 className="animate-spin mr-2" /> Loading session...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-400">{error}</div>;
  }

  if (!sessionData || !problem) {
    return <div className="p-8 text-[#888888]">Session or Problem not found.</div>;
  }

  const exampleTestCases = problem.testCases.filter(tc => tc.isExample);

  return (
    <div className="flex h-screen bg-[#121212] text-[#EAEAEA]">
      <div className="w-[40%] lg:w-[35%] border-r border-[#333333] overflow-y-auto bg-[#1E1E1E]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline gap-3">
              <h2 className="text-xl font-semibold text-white">
                Problem {currentProblemIndex + 1} of {sessionData.problemIds.length}
              </h2>
              <span className="text-sm font-mono text-gray-400">
                (Score: {sessionData.problemScores?.[problem._id] ?? 0}/10)
              </span>
            </div>
            {sessionData.type === 'exam' && timeRemaining !== null && (
              <div className={`flex items-center gap-2 text-white font-mono text-lg ${timeRemaining < 300 ? 'text-red-400' : ''}`}>
                <Clock size={20} />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">{problem.title || `Soal Modul ${problem.moduleId}`}</h3>
          <div className="prose prose-invert prose-sm max-w-none mb-6 text-[#EAEAEA]" dangerouslySetInnerHTML={{ __html: problem.description.replace(/\n/g, '<br />') }} />

          {problem.bannedFunctions && problem.bannedFunctions.length > 0 && (
            <div className="mb-6 p-4 bg-[#121212] border border-[#333333] rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-[#888888] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">Banned Functions</h4>
                  <p className="text-[#888888] text-sm">
                    You cannot use: {problem.bannedFunctions.map(f => `${f}()`).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="flex border-b border-[#333333]">
              <button onClick={() => setActiveTab('examples')} className={`px-4 py-2 font-semibold text-sm transition-colors ${activeTab === 'examples' ? 'text-white border-b-2 border-white' : 'text-[#888888] hover:text-white'}`}>Example Cases</button>
              <button onClick={() => setActiveTab('results')} className={`px-4 py-2 font-semibold text-sm transition-colors ${activeTab === 'results' ? 'text-white border-b-2 border-white' : 'text-[#888888] hover:text-white'}`}>Submission Results</button>
            </div>

            <div className="mt-4">
              {activeTab === 'examples' && (
                <div className="space-y-3">
                  {exampleTestCases.map((testCase, index) => (
                    <div key={index} className="bg-[#121212] border border-[#333333] rounded-lg p-4">
                      <div className="mb-2">
                        <span className="text-[#888888] text-sm">Input:</span>
                        <pre className="text-[#EAEAEA] text-sm mt-1 font-mono whitespace-pre-wrap">{testCase.input}</pre>
                      </div>
                      <div>
                        <span className="text-[#888888] text-sm">Expected Output:</span>
                        <pre className="text-[#EAEAEA] text-sm mt-1 font-mono whitespace-pre-wrap">{testCase.expectedOutput}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'results' && (
                <div>
                  {isSubmitting ? (
                     <div className="flex items-center justify-center h-40 text-white"><Loader2 className="animate-spin mr-2" /> Submitting...</div>
                  ) : submissionResult ? (
                    <div>
                      {submissionResult.status === 'Banned Function' ? (
                        <div className='p-4 rounded-lg mb-4 flex items-center gap-3 bg-red-950/30 border border-red-900'>
                           <XCircle size={24} className="text-red-400" />
                           <div>
                              <p className="text-white font-semibold">Banned Function Used</p>
                              <p className="text-red-400 text-sm">{submissionResult.message}</p>
                           </div>
                        </div>
                      ) : (
                        <div className={`p-4 rounded-lg mb-4 flex items-center gap-3 ${submissionResult.passed_count === submissionResult.totalTestCases ? 'bg-green-950/30 border border-green-900' : 'bg-red-950/30 border border-red-900'}`}>
                          {submissionResult.passed_count === submissionResult.totalTestCases ? <CheckCircle2 size={24} className="text-green-400" /> : <XCircle size={24} className="text-red-400" />}
                          <div>
                            <p className="text-white font-semibold">{submissionResult.passed_count === submissionResult.totalTestCases ? 'All Tests Passed!' : 'Some Tests Failed'}</p>
                            <p className="text-[#888888] text-sm">{submissionResult.passed_count} / {submissionResult.totalTestCases} test cases passed</p>
                          </div>
                        </div>
                      )}

                      {submissionResult.results && submissionResult.results.filter(r => !r.passed).length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-white font-semibold text-sm">Failed Test Cases:</h4>
                          {submissionResult.results.filter(r => !r.passed).map((res, index) => (
                            <div key={index} className="bg-[#121212] border border-red-900/50 rounded-lg p-4">
                              <div className="mb-2">
                                <span className="text-[#888888] text-sm">Input:</span>
                                <pre className="text-[#EAEAEA] text-sm mt-1 font-mono whitespace-pre-wrap">{res.testCase.input}</pre>
                              </div>
                              <div className="mb-2">
                                <span className="text-[#888888] text-sm">Your Output:</span>
                                <pre className="text-red-400 text-sm mt-1 font-mono whitespace-pre-wrap">{res.actualOutput || (res.error ? `Error: ${res.error}`: '(No output)')}</pre>
                              </div>
                              <div>
                                <span className="text-[#888888] text-sm">Expected Output:</span>
                                <pre className="text-green-400 text-sm mt-1 font-mono whitespace-pre-wrap">{res.testCase.expectedOutput}</pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[#888888] text-sm text-center py-10">Submit your code to see the results.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-2">
                {sessionData.problemIds.length > 1 && (
                    <>
                        <button onClick={() => setCurrentProblemIndex(Math.max(0, currentProblemIndex - 1))} disabled={currentProblemIndex === 0} className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#333333] rounded-lg text-[#EAEAEA] hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <button onClick={() => setCurrentProblemIndex(Math.min(sessionData.problemIds.length - 1, currentProblemIndex + 1))} disabled={currentProblemIndex === sessionData.problemIds.length - 1} className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#333333] rounded-lg text-[#EAEAEA] hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </>
                )}
            </div>
            {sessionData.type === 'exam' && (
              <button onClick={() => handleGradeExam(false)} disabled={isGrading || isSubmitting} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {isGrading ? <><Loader2 className="animate-spin" /> Grading...</> : 'Finish & Grade Exam'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {sessionData.problemScores && (
          <WorkspaceHeader problemScores={sessionData.problemScores} problemIds={sessionData.problemIds.map(p => p._id)} />
        )}
        <div className="flex-1 relative">
          <Editor height="100%" defaultLanguage="python" value={code} onChange={handleCodeChange} theme="vs-dark" options={{ minimap: { enabled: false }, fontSize: 14, fontFamily: 'JetBrains Mono, monospace', lineNumbers: 'on', scrollBeyondLastLine: false, automaticLayout: true, tabSize: 4, insertSpaces: true }} />
        </div>
        <div className="p-4 border-t border-[#333333] bg-[#1E1E1E]">
          <button onClick={handleSubmit} disabled={isSubmitting || isGrading} className="w-full bg-white text-[#121212] font-semibold py-3 rounded-lg hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isSubmitting ? <><Loader2 className="animate-spin" /> Submitting...</> : 'Submit Code'}
          </button>
        </div>
      </div>
    </div>
  );
}
