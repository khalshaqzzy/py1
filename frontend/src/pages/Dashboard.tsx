import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useModuleStore } from '../stores/moduleStore';
import { useSessionStore } from '../stores/sessionStore';
import { Clock, CheckCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

// Timer component - countdown logic
const Timer = ({ endTime }: { endTime?: string }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (endTime) {
      const interval = setInterval(() => {
        const end = new Date(endTime).getTime();
        const now = new Date().getTime();
        const distance = end - now;
        setTimeRemaining(Math.max(0, Math.floor(distance / 1000)));
        if (distance < 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [endTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return <span className="text-white font-mono">{formatTime(timeRemaining)}</span>;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { modules, progress } = useModuleStore();
  const { activeSessions } = useSessionStore();

  const inProgressSessions = activeSessions.filter(s => s.status === 'in-progress');


  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">
        Welcome, {user?.username || 'Student'}!
      </h1>

      {inProgressSessions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Continue Your Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressSessions.map((session) => {
              const module = modules.find(m => m.id === session.moduleId);
              return (
                <button
                  key={session._id}
                  onClick={() => navigate(`/workspace/${session.type}/${session._id}`)}
                  className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-6 text-left hover:border-white transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[#888888] text-sm mb-1 capitalize flex items-center gap-2">
                        {session.type === 'ai' ? <Sparkles size={14}/> : <Clock size={14} />} 
                        {session.type === 'ai' ? 'AI Exercise' : 'Exam'}
                      </p>
                      <h3 className="text-white font-semibold text-lg group-hover:text-white">
                        {module?.title || 'Loading...'}
                      </h3>
                    </div>
                  </div>
                  {session.type === 'exam' && (
                     <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[#888888]">Time Remaining</span>
                          <Timer endTime={session.endTime} />
                        </div>
                      </div>
                  )}
                   <p className="text-[#888888] text-sm">
                    {session.problemIds.length} problems
                  </p>
                </button>
              )
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold text-white mb-6">
          Start Learning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const moduleProgress = progress.find(p => p.moduleId === String(module.id))?.progress || 0;
            return (
              <button
                key={module.id}
                onClick={() => navigate(`/modules/${module.id}/1`)}
                className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-6 text-left hover:border-white transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white font-semibold text-lg">
                    {module.title}
                  </h3>
                  {moduleProgress === 100 && (
                    <CheckCircle size={20} className="text-white" />
                  )}
                </div>
                <p className="text-[#888888] text-sm mb-4 line-clamp-2">
                  {module.description}
                </p>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#888888]">Progress</span>
                    <span className="text-white">{moduleProgress}%</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all"
                      style={{ width: `${moduleProgress}%` }}
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  );
}
