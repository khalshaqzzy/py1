import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModuleStore } from '../stores/moduleStore';
import { useSessionStore } from '../stores/sessionStore';
import { Sparkles, Loader2 } from 'lucide-react';
import type { DifficultyLevel } from '../types';

export default function AIExercise() {
  const navigate = useNavigate();
  const { modules } = useModuleStore();
  const { createSession } = useSessionStore();

  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(modules[0]?.id || null);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const difficulties: DifficultyLevel[] = ['Easy', 'Medium', 'Hard'];

  const handleGenerate = async () => {
    if (selectedModuleId === null) return;

    setIsGenerating(true);
    try {
      const newSession = await createSession({
        type: 'ai',
        moduleId: selectedModuleId,
        difficulty: difficulty,
        instructions: customInstructions,
      });
      navigate(`/workspace/ai/${newSession._id}`);
    } catch (error) {
      console.error("Failed to create AI session:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles size={32} className="text-white" />
        <h1 className="text-4xl font-bold text-white">AI Custom Exercise</h1>
      </div>

      <div className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-8">
        <div className="space-y-8">
          <div>
            <label className="block text-[#888888] text-sm mb-3">
              Select Module
            </label>
            <div className="grid grid-cols-1 gap-3">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setSelectedModuleId(module.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedModuleId === module.id
                      ? 'border-white bg-[#121212]'
                      : 'border-[#333333] hover:border-[#888888]'
                  }`}
                >
                  <h3
                    className={`font-semibold mb-1 ${
                      selectedModuleId === module.id ? 'text-white' : 'text-[#EAEAEA]'
                    }`}
                  >
                    {module.title}
                  </h3>
                  <p className="text-[#888888] text-sm">{module.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#888888] text-sm mb-3">
              Select Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`py-3 rounded-lg border-2 font-semibold transition-all ${
                    difficulty === level
                      ? 'border-white bg-white text-[#121212]'
                      : 'border-[#333333] text-[#EAEAEA] hover:border-[#888888]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="instructions" className="block text-[#888888] text-sm mb-3">
              Additional Instructions (Optional)
            </label>
            <textarea
              id="instructions"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="w-full bg-[#121212] border border-[#333333] rounded-lg px-4 py-3 text-[#EAEAEA] focus:outline-none focus:border-white transition-colors resize-none"
              rows={4}
              placeholder="Example: Create a problem about nested loops for finding prime factors..."
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedModuleId === null}
            className="w-full bg-white text-[#121212] font-semibold py-4 rounded-lg hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Generating Problems...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate Exercise</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-[#1E1E1E] border border-[#333333] rounded-lg p-6">
        <h3 className="text-white font-semibold mb-3">How it works:</h3>
        <ol className="space-y-2 text-[#888888] text-sm list-decimal list-inside">
          <li>Choose a module that matches what you want to practice</li>
          <li>Select a difficulty level based on your current skill</li>
          <li>Optionally provide specific instructions for problem generation</li>
          <li>Click "Generate Exercise" and wait while AI creates 3 custom problems</li>
          <li>Solve the problems at your own pace</li>
        </ol>
      </div>
    </div>
  );
}
