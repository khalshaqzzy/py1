import { Response } from 'express';
import { IRequest } from '../middleware/auth.middleware';
import Session from '../models/session.model';
import Problem from '../models/problem.model';
import { generateAIProblem } from '../services/gemini.service';

const moduleNames: { [key: number]: string } = {
  1: 'Conditional',
  2: 'Looping',
  3: 'Function & Procedure',
};

/**
 * @route   POST /api/sessions/create
 * @desc    Membuat sesi Ujian atau Latihan AI baru
 * @access  Protected
 */
export const createSession = async (req: IRequest, res: Response) => {
  const { type, moduleId, difficulty, instructions } = req.body;
  const userId = req.user?.id;

  if (!type || !moduleId) {
    return res.status(400).json({ message: 'Tipe sesi dan moduleId harus diisi.' });
  }
  if (type !== 'exam' && type !== 'ai') {
    return res.status(400).json({ message: 'Tipe sesi tidak valid.' });
  }

  try {
    let problemIds = [];

    if (type === 'exam') {
      const examProblems = await Problem.find({ source: 'exam', moduleId: moduleId }).select('_id');
      if (examProblems.length < 3) { // Ujian harus punya 3 soal
        return res.status(404).json({ message: 'Soal ujian untuk modul ini tidak lengkap atau tidak ditemukan.' });
      }
      problemIds = examProblems.map(p => p._id);
    } else { // type === 'ai'
      if (!difficulty) {
        return res.status(400).json({ message: 'Tingkat kesulitan harus diisi untuk sesi AI.' });
      }
      const moduleName = moduleNames[moduleId];
      if (!moduleName) {
        return res.status(400).json({ message: 'Module ID tidak valid.' });
      }

      // Membuat 3 soal secara paralel
      const problemPromises = [
        generateAIProblem(moduleName, moduleId, difficulty, instructions),
        generateAIProblem(moduleName, moduleId, difficulty, instructions),
        generateAIProblem(moduleName, moduleId, difficulty, instructions),
      ];
      
      const generatedProblems = await Promise.all(problemPromises);

      // Jika salah satu gagal, batalkan proses
      if (generatedProblems.some(p => p === null)) {
        return res.status(500).json({ message: 'Gagal menghasilkan soal dari AI. Silakan coba lagi.' });
      }

      // Simpan soal-soal baru ke database
      const newProblemDocs = await Problem.insertMany(
        generatedProblems.map(p => ({
          ...(p!),
          source: 'ai',
          moduleId: moduleId,
        }))
      );

      problemIds = newProblemDocs.map(p => p._id);
    }

    // Buat sesi baru di database
    const newSession = new Session({
      userId,
      type,
      moduleId,
      problemIds,
      status: 'in-progress',
      startTime: new Date(),
      // Tambahkan endTime jika sesi ujian
      ...(type === 'exam' && { endTime: new Date(Date.now() + 60 * 60 * 1000) }), // Durasi 60 menit
    });

    await newSession.save();

    res.status(201).json(newSession);

  } catch (error) {
    console.error('Server Error in createSession:', error);
    let errorMessage = 'Terjadi kesalahan pada server.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (!res.headersSent) {
      res.status(500).json({ message: errorMessage });
    }
  }
};

/**
 * @route   GET /api/sessions/:sessionId
 * @desc    Mengambil detail sesi yang sedang berjalan
 * @access  Protected
 */
export const getSession = async (req: IRequest, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user?.id;

  try {
    const session = await Session.findById(sessionId).populate('problemIds');

    if (!session) {
      return res.status(404).json({ message: 'Sesi tidak ditemukan.' });
    }

    // Pastikan user hanya bisa mengakses sesinya sendiri
    if (session.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Akses ditolak.' });
    }

    res.json(session);

  } catch (error) {
    let errorMessage = 'Terjadi kesalahan pada server.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
};
