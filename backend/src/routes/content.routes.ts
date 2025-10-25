import { Router } from 'express';
import { getModules, getExamProblems } from '../controllers/content.controller';

const router = Router();

/**
 * @route   GET /api/content/modules
 * @desc    Mengembalikan daftar semua modul pembelajaran
 * @access  Public
 */
router.get('/modules', getModules);

/**
 * @route   GET /api/content/exam-problems/:moduleId
 * @desc    Mengambil soal-soal ujian berdasarkan ID modul
 * @access  Public
 */
router.get('/exam-problems/:moduleId', getExamProblems);

export default router;
