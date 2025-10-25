
import { Router } from 'express';
import { getUserProgress, updateUserProgress } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/user/progress
 * @desc    Mengambil progres belajar pengguna yang login
 * @access  Protected
 */
router.get('/progress', protect, getUserProgress);

/**
 * @route   POST /api/user/progress
 * @desc    Memperbarui progres belajar pengguna
 * @access  Protected
 */
router.post('/progress', protect, updateUserProgress);

export default router;
