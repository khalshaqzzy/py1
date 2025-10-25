import { useNavigate } from 'react-router-dom';
import { allModules } from '../modules';
import { useModuleStore } from '../stores/moduleStore';
import { CheckCircle, ChevronRight } from 'lucide-react';

export default function ModuleList() {
  const navigate = useNavigate();
  const { progress: userProgress } = useModuleStore();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Modul Pembelajaran</h1>

      <div className="space-y-6">
        {allModules.map((module) => {
          const moduleData = userProgress.find(p => p.moduleId === module.id);
          const progress = moduleData?.progress || 0;
          const completedSections = moduleData?.completedSections || [];

          return (
            <div
              key={module.id}
              className="bg-[#1E1E1E] border border-[#333333] rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      {module.title}
                    </h2>
                    <p className="text-[#888888]">{module.description}</p>
                  </div>
                  {progress === 100 && (
                    <CheckCircle size={24} className="text-white ml-4" />
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#888888]">Progres</span>
                    <span className="text-white">{progress}%</span>
                  </div>
                  <div className="w-full bg-[#121212] rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  {module.sections.map((section) => {
                    const isCompleted = completedSections.includes(section.id);
                    return (
                      <button
                        key={section.id}
                        onClick={() => navigate(`/modules/${module.id}/${section.id}`)}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-[#121212] hover:bg-[#2A2A2A] transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle size={16} className="text-white" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-[#333333]" />
                          )}
                          <span className="text-[#EAEAEA] group-hover:text-white">
                            {section.title}
                          </span>
                        </div>
                        <ChevronRight size={16} className="text-[#888888] group-hover:text-white" />
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => navigate(`/modules/${module.id}/${module.sections[0].id}`)}
                  className="w-full bg-white text-[#121212] font-semibold py-3 rounded-lg hover:scale-[1.01] transition-transform"
                >
                  {progress === 0 ? 'Mulai Belajar' : 'Lanjutkan Belajar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

