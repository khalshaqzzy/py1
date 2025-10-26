import { Schema, model, Document } from 'mongoose';

// Interface untuk Test Case
export interface ITestCase {
  input: string;
  expectedOutput: string;
  isExample: boolean;
}

// Interface untuk Problem Document
export interface IProblem extends Document {
  source: 'exam' | 'ai';
  moduleId: number;
  description: string;
  bannedFunctions: string[];
  testCases: ITestCase[];
}

// Skema untuk Test Case (sub-document)
const TestCaseSchema = new Schema<ITestCase>({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
  },
  isExample: {
    type: Boolean,
    required: true,
    default: false,
  },
}, { _id: false }); 

// Skema Mongoose untuk Problem
const ProblemSchema = new Schema<IProblem>({
  source: {
    type: String,
    enum: ['exam', 'ai'],
    required: true,
  },
  moduleId: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  bannedFunctions: {
    type: [String],
    default: [],
  },
  testCases: {
    type: [TestCaseSchema],
    required: true,
  },
});

const Problem = model<IProblem>('Problem', ProblemSchema);

export default Problem;
