
import { Response } from 'express';
import { IRequest } from '../middleware/auth.middleware';
import User from '../models/user.model';

/**
 * @route   GET /api/user/progress
 * @desc    Mengambil progres belajar pengguna yang login
 * @access  Protected
 */
export const getUserProgress = async (req: IRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('learningProgress');
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }
    res.json(user.learningProgress);
  } catch (error) {
    res.status(500).json({ message: 'Kesalahan server saat mengambil progres.' });
  }
};

/**
 * @route   POST /api/user/progress
 * @desc    Memperbarui progres belajar pengguna
 * @access  Protected
 */
export const updateUserProgress = async (req: IRequest, res: Response) => {
  const { moduleId, completedSections, progress } = req.body;
  const userId = req.user?.id;

  if (!moduleId || completedSections === undefined || progress === undefined) {
    return res.status(400).json({ message: 'moduleId, completedSections, dan progress harus diisi.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    const moduleIndex = user.learningProgress.findIndex(p => p.moduleId === moduleId);

    if (moduleIndex > -1) {
      // Jika progres untuk modul sudah ada, update
      user.learningProgress[moduleIndex].completedSections = completedSections;
      user.learningProgress[moduleIndex].progress = progress;
    } else {
      // Jika belum ada, tambah progres baru
      user.learningProgress.push({ moduleId, completedSections, progress });
    }

    await user.save();
    res.json(user.learningProgress);

  } catch (error) {
    res.status(500).json({ message: 'Kesalahan server saat memperbarui progres.' });
  }
};
