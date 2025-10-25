import { Router } from 'express';
import { submitCode } from '../controllers/submission.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/submit
 * @desc    Menerima submisi kode untuk dinilai
 * @access  Protected
 */
router.post('/', protect, submitCode);

export default router;
