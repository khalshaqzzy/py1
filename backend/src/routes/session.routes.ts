import { Router } from 'express';
import { createSession, getSession } from '../controllers/session.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/sessions/create
 * @desc    Membuat sesi Ujian atau Latihan AI baru
 * @access  Protected
 */
router.post('/create', protect, createSession);

/**
 * @route   GET /api/sessions/:sessionId
 * @desc    Mengambil detail sesi yang sedang berjalan
 * @access  Protected
 */
router.get('/:sessionId', protect, getSession);

export default router;
