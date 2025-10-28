import { Schema, model, Document, Types } from 'mongoose';

// Interface untuk Submission (sub-document)
export interface ISubmission {
  problemId: Types.ObjectId;
  code: string;
  score: number;
  nonSampleScore: number;
  submittedAt: Date;
}

// Interface untuk Session Document
export interface ISession extends Document {
  userId: Types.ObjectId;
  type: 'exam' | 'ai';
  moduleId: number;
  problemIds: Types.ObjectId[];
  status: 'in-progress' | 'completed';
  startTime: Date;
  endTime?: Date; // Opsional, hanya untuk exam
  submissions: ISubmission[];
  finalScore?: number;
  timeTakenSeconds?: number;
  lastSubmissionResult?: {
    problemId: Types.ObjectId;
    result: object; // Store the raw result object
  };
}

// Skema untuk Submission (sub-document)
const SubmissionSchema = new Schema<ISubmission>({
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  nonSampleScore: {
    type: Number,
    required: true,
    default: 0,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

// Skema Mongoose untuk Session
const SessionSchema = new Schema<ISession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['exam', 'ai'],
    required: true,
  },
  moduleId: {
    type: Number,
    required: true,
  },
  problemIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Problem',
  }],
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress',
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  submissions: {
    type: [SubmissionSchema],
    default: [],
  },
  finalScore: {
    type: Number,
  },
  timeTakenSeconds: {
    type: Number,
  },
  lastSubmissionResult: {
    type: {
      problemId: { type: Schema.Types.ObjectId, ref: 'Problem' },
      result: { type: Object },
    },
    default: undefined,
  },
});

const Session = model<ISession>('Session', SessionSchema);

export default Session;
