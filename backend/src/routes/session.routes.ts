import { Router } from 'express';
import { createSession, getSession, getActiveSessions, getCompletedSessions } from '../controllers/session.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/sessions/active
 * @desc    Mengambil semua sesi aktif (in-progress) milik pengguna
 * @access  Protected
 */
router.get('/active', protect, getActiveSessions);

/**
 * @route   GET /api/sessions/completed
 * @desc    Mengambil semua sesi yang telah selesai milik pengguna
 * @access  Protected
 */
router.get('/completed', protect, getCompletedSessions);

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
