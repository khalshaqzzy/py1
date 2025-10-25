import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboard.controller';

const router = Router();

/**
 * @route   GET /api/leaderboards/overall
 * @desc    Mengambil papan peringkat keseluruhan
 * @access  Public
 */
router.get('/overall', getLeaderboard);

/**
 * @route   GET /api/leaderboards/:moduleId
 * @desc    Mengambil papan peringkat per modul
 * @access  Public
 */
router.get('/:moduleId', getLeaderboard);

export default router;
