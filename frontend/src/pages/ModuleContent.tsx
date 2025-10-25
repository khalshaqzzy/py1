import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModule } from '../modules';
import { useModuleStore } from '../stores/moduleStore';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ModuleContent() {
  const { moduleId, sectionId } = useParams<{ moduleId: string; sectionId: string }>();
  const navigate = useNavigate();
  const { progress, updateProgress } = useModuleStore();

  const module = getModule(moduleId ?? '');
  const sectionIndex = module?.sections.findIndex((s) => s.id === sectionId) ?? -1;
  const section = sectionIndex !== -1 ? module?.sections[sectionIndex] : undefined;

  useEffect(() => {
    if (module && section) {
      updateProgress(moduleId!, sectionId!, module.sections.length);
    }
  }, [moduleId, sectionId, module, section, updateProgress]);

  // Validasi moduleId dan sectionId
  if (!moduleId || !sectionId || !module || !section) {
    return <div className="p-8 text-[#888888]">Invalid Module or Section ID.</div>;
  }

  const previousSection = sectionIndex > 0 ? module.sections[sectionIndex - 1] : null;
  const nextSection = sectionIndex < module.sections.length - 1 ? module.sections[sectionIndex + 1] : null;
  const SectionComponent = section.component;
  
  const moduleProgress = progress.find(p => p.moduleId === moduleId);
  const completedSections = moduleProgress?.completedSections || [];

  return (
    <div className="flex h-screen">
      <aside className="w-80 bg-[#1E1E1E] border-r border-[#333333] overflow-y-auto flex-shrink-0">
        <div className="p-6">
          <button
            onClick={() => navigate('/modules')}
            className="flex items-center gap-2 text-[#888888] hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Modules</span>
          </button>

          <h2 className="text-white font-semibold text-lg mb-6">{module.title}</h2>

          <nav className="space-y-2">
            {module.sections.map((s) => {
              const isCompleted = completedSections.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => navigate(`/modules/${moduleId}/${s.id}`)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    s.id === sectionId
                      ? 'bg-[#121212] text-white'
                      : 'text-[#888888] hover:text-white hover:bg-[#121212]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle size={16} className="text-white flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-[#333333] flex-shrink-0" />
                  )}
                  <span className="text-sm">{s.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          <SectionComponent />

          <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#333333]">
            {previousSection ? (
              <button
                onClick={() => navigate(`/modules/${moduleId}/${previousSection.id}`)}
                className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
                <span>{previousSection.title}</span>
              </button>
            ) : (
              <div />
            )}

            {nextSection ? (
              <button
                onClick={() => navigate(`/modules/${moduleId}/${nextSection.id}`)}
                className="flex items-center gap-2 bg-white text-[#121212] font-semibold px-6 py-3 rounded-lg hover:scale-[1.02] transition-transform"
              >
                <span>Next: {nextSection.title}</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={() => navigate('/modules')}
                className="bg-white text-[#121212] font-semibold px-6 py-3 rounded-lg hover:scale-[1.02] transition-transform"
              >
                Finish & Back to Modules
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

