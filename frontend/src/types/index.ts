export interface User {
  id: string;
  username: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  progress: number;
  sections: ModuleSection[];
}

export interface ModuleSection {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

export interface TestCase {
  input: string;
  expected_output: string;
}

export interface Problem {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  banned_functions: string[];
  example_test_cases: TestCase[];
  hidden_test_cases: TestCase[];
}

export interface ExamSession {
  id: string;
  moduleId: string;
  moduleName: string;
  problems: Problem[];
  timeRemaining: number;
  startedAt: string;
  isCompleted: boolean;
}

export interface ExerciseSession {
  id: string;
  moduleId: string;
  moduleName: string;
  difficulty: string;
  problems: Problem[];
  currentProblemIndex: number;
  isCompleted: boolean;
}

export interface SubmissionResult {
  success: boolean;
  passedTests: number;
  totalTests: number;
  failedTests?: {
    input: string;
    yourOutput: string;
    expectedOutput: string;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  timeTaken: number;
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
