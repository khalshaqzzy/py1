import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  password?: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

// Skema Mongoose untuk User
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook untuk hash password sebelum disimpan
UserSchema.pre<IUser>('save', async function (next) {
  // Hanya hash password jika dimodifikasi (baru)
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    if (error instanceof Error) {
        return next(error);
    }
    return next(new Error('Error hashing password'));
  }
});

// Method untuk membandingkan password
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>('User', UserSchema);

export default User;
