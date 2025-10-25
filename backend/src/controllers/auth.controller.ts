import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';

/**
 * Membuat token JWT untuk user.
 * @param userId - ID dari user.
 * @returns Token JWT.
 */
const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET tidak ditemukan di environment variables.');
  }
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '1d', // 1 hari
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Mendaftarkan user baru
 * @access  Public
 */
export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password harus diisi.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username sudah digunakan.' });
    }

    const user: IUser = new User({ username, password });
    await user.save();

    const token = generateToken(user._id.toString());

    res.status(201).json({ token });

  } catch (error) {
    let errorMessage = 'Terjadi kesalahan pada server saat registrasi.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password harus diisi.' });
  }

  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Username atau password salah.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Username atau password salah.' });
    }

    const token = generateToken(user._id.toString());

    res.json({ token });

  } catch (error) {
    let errorMessage = 'Terjadi kesalahan pada server saat login.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
};