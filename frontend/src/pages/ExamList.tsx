import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModuleStore } from '../stores/moduleStore';
import { useSessionStore } from '../stores/sessionStore';
import { Clock, CheckCircle, Loader2 } from 'lucide-react';

export default function ExamList() {
  const navigate = useNavigate();
  const { modules } = useModuleStore();
  const { activeSessions, createSession } = useSessionStore();
  const [loadingModuleId, setLoadingModuleId] = useState<number | null>(null);

  const getExamStatus = (moduleId: number) => {
    return activeSessions.find(
      (session) => session.type === 'exam' && session.moduleId === moduleId
    );
  };

  const handleStartExam = async (moduleId: number) => {
    setLoadingModuleId(moduleId);
    try {
      const newSession = await createSession({ type: 'exam', moduleId });
      navigate(`/workspace/exam/${newSession._id}`);
    } catch (error) {
      console.error(`Failed to start exam for module ${moduleId}:`, error);
    } finally {
      setLoadingModuleId(null);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Exams</h1>

      <div className="space-y-6">
        {modules.map((module) => {
          const existingSession = getExamStatus(module.id);
          const isCompleted = existingSession?.status === 'completed';
          const isInProgress = existingSession?.status === 'in-progress';
          const isLoading = loadingModuleId === module.id;

          return (
            <div
              key={module.id}
              className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {module.title}
                  </h2>
                  <p className="text-[#888888] mb-4">{module.description}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-[#888888]" />
                      <span className="text-[#888888]">Duration: 60 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#888888]">Problems: 3</span>
                    </div>
                  </div>
                </div>
                {isCompleted && (
                  <CheckCircle size={24} className="text-white ml-4" />
                )}
              </div>

              {isInProgress ? (
                <button
                  onClick={() => navigate(`/workspace/exam/${existingSession._id}`)}
                  className="w-full bg-white text-[#121212] font-semibold py-3 rounded-lg hover:scale-[1.01] transition-transform"
                >
                  Continue Exam
                </button>
              ) : isCompleted ? (
                <div className="flex gap-3">
                  <button className="flex-1 bg-[#121212] text-[#EAEAEA] font-semibold py-3 rounded-lg border border-[#333333] hover:border-white transition-colors">
                    View Results
                  </button>
                  <button 
                    onClick={() => handleStartExam(module.id)}
                    disabled={isLoading}
                    className="flex-1 bg-white text-[#121212] font-semibold py-3 rounded-lg hover:scale-[1.01] transition-transform disabled:opacity-50 flex justify-center items-center gap-2">
                    {isLoading ? <><Loader2 className="animate-spin"/> Starting...</> : 'Retake Exam'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartExam(module.id)}
                  disabled={isLoading}
                  className="w-full bg-white text-[#121212] font-semibold py-3 rounded-lg hover:scale-[1.01] transition-transform disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isLoading ? <><Loader2 className="animate-spin"/> Starting...</> : 'Start Exam'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-[#1E1E1E] border border-[#333333] rounded-lg p-6">
        <h3 className="text-white font-semibold mb-3">Exam Guidelines:</h3>
        <ul className="space-y-2 text-[#888888] text-sm list-disc list-inside">
          <li>Each exam consists of 3 problems related to the module</li>
          <li>You have 60 minutes to complete all problems</li>
          <li>The timer continues running even if you close the browser</li>
          <li>You can save your progress and return later</li>
          <li>Code will be auto-submitted when time expires</li>
          <li>Your best score will be used for the leaderboard</li>
        </ul>
      </div>
    </div>
  );
}
