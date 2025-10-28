interface WorkspaceHeaderProps {
  problemScores: { [key: string]: number };
  problemIds: string[];
}

const WorkspaceHeader = ({ problemScores, problemIds }: WorkspaceHeaderProps) => {
  const totalScore = Object.values(problemScores).reduce((sum, score) => sum + score, 0);

  return (
    <div className="bg-[#1E1E1E] p-4 border-b border-[#333333] flex items-center gap-6">
      <div className="flex-shrink-0">
        <span className="text-sm text-[#888888]">Total Score: </span>
        <span className="font-bold text-white text-lg">{totalScore}/30</span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        {problemIds.map((id, index) => {
          const score = problemScores[id] ?? 0;
          const isPerfect = score === 10;
          return (
            <div key={index} className="flex-1 bg-[#121212] h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${isPerfect ? 'bg-green-500' : 'bg-white'}`}
                style={{ width: `${score * 10}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkspaceHeader;
