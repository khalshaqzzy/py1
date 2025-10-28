import { Router } from 'express';
import { submitCode, gradeExam } from '../controllers/submission.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/submit
 * @desc    Menerima submisi kode untuk dinilai
 * @access  Protected
 */
router.post('/', protect, submitCode);

/**
 * @route   POST /api/submit/:sessionId/grade
 * @desc    Menilai keseluruhan sesi ujian dan menyelesaikannya
 * @access  Protected
 */
router.post('/:sessionId/grade', protect, gradeExam);

export default router;
