import { Request, Response } from 'express';
import Problem from '../models/problem.model';

// Data statis untuk modul pembelajaran
const modules = [
  { id: 1, title: 'Conditional', description: 'Mempelajari penggunaan struktur kondisional seperti if, else, dan elif untuk mengontrol alur program.' },
  { id: 2, title: 'Looping', description: 'Mempelajari perulangan menggunakan for dan while untuk eksekusi kode berulang.' },
  { id: 3, title: 'Function & Procedure', description: 'Mempelajari cara membuat dan menggunakan fungsi dan prosedur untuk kode yang modular.' },
];

/**
 * @route   GET /api/content/modules
 * @desc    Mengembalikan daftar semua modul pembelajaran
 * @access  Public
 */
export const getModules = async (req: Request, res: Response) => {
  res.json(modules);
};

/**
 * @route   GET /api/content/exam-problems/:moduleId
 * @desc    Mengambil soal-soal ujian berdasarkan ID modul
 * @access  Public (atau terproteksi, sesuai kebutuhan nanti)
 */
export const getExamProblems = async (req: Request, res: Response) => {
  try {
    const moduleId = parseInt(req.params.moduleId, 10);

    // Validasi input
    if (isNaN(moduleId)) {
      return res.status(400).json({ message: 'Module ID tidak valid.' });
    }

    // Cari soal ujian di database
    const problems = await Problem.find({
      source: 'exam',
      moduleId: moduleId,
    });

    if (!problems || problems.length === 0) {
      return res.status(404).json({ message: 'Soal ujian untuk modul ini tidak ditemukan.' });
    }

    res.json(problems);

  } catch (error) {
    let errorMessage = 'Terjadi kesalahan pada server.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
};
