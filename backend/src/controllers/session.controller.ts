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
  console.log(`[SESSION] Permintaan pembuatan sesi diterima. UserID: ${userId}, Body: ${JSON.stringify(req.body)}`);

  if (!type || !moduleId) {
    console.warn(`[SESSION] Gagal membuat sesi: Tipe atau moduleId kosong.`);
    return res.status(400).json({ message: 'Tipe sesi dan moduleId harus diisi.' });
  }
  if (type !== 'exam' && type !== 'ai') {
    console.warn(`[SESSION] Gagal membuat sesi: Tipe tidak valid: ${type}`);
    return res.status(400).json({ message: 'Tipe sesi tidak valid.' });
  }

  try {
    let problemIds = [];

    if (type === 'exam') {
      console.log(`[SESSION] Membuat sesi UJIAN untuk moduleId: ${moduleId}`);
      const examProblems = await Problem.find({ source: 'exam', moduleId: moduleId }).select('_id');
      if (examProblems.length < 3) {
        console.warn(`[SESSION] Gagal membuat sesi ujian: Soal tidak lengkap untuk moduleId: ${moduleId}. Ditemukan: ${examProblems.length}`);
        return res.status(404).json({ message: 'Soal ujian untuk modul ini tidak lengkap atau tidak ditemukan.' });
      }
      problemIds = examProblems.map(p => p._id);
      console.log(`[SESSION] Berhasil mendapatkan ${problemIds.length} soal ujian.`);
    } else { // type === 'ai'
      console.log(`[SESSION] Membuat sesi LATIHAN AI untuk moduleId: ${moduleId}, Kesulitan: ${difficulty}`);
      if (!difficulty) {
        console.warn(`[SESSION] Gagal membuat sesi AI: Tingkat kesulitan kosong.`);
        return res.status(400).json({ message: 'Tingkat kesulitan harus diisi untuk sesi AI.' });
      }
      const moduleName = moduleNames[moduleId];
      if (!moduleName) {
        console.warn(`[SESSION] Gagal membuat sesi AI: Module ID tidak valid: ${moduleId}`);
        return res.status(400).json({ message: 'Module ID tidak valid.' });
      }

      const problemPromises = [
        generateAIProblem(moduleName, moduleId, difficulty, instructions),
        generateAIProblem(moduleName, moduleId, difficulty, instructions),
        generateAIProblem(moduleName, moduleId, difficulty, instructions),
      ];
      
      const generatedProblems = await Promise.all(problemPromises);

      if (generatedProblems.some(p => p === null)) {
        console.error('[SESSION] Gagal membuat sesi AI: Satu atau lebih soal gagal digenerate oleh AI.');
        return res.status(500).json({ message: 'Gagal menghasilkan soal dari AI. Silakan coba lagi.' });
      }

      const newProblemDocs = await Problem.insertMany(
        generatedProblems.map(p => ({
          ...(p!),
          source: 'ai',
          moduleId: moduleId,
        }))
      );

      problemIds = newProblemDocs.map(p => p._id);
      console.log(`[SESSION] Berhasil membuat dan menyimpan ${problemIds.length} soal dari AI.`);
    }

    const newSession = new Session({
      userId,
      type,
      moduleId,
      problemIds,
      status: 'in-progress',
      startTime: new Date(),
      ...(type === 'exam' && { endTime: new Date(Date.now() + 60 * 60 * 1000) }),
    });

    await newSession.save();
    console.log(`[SESSION] Sesi baru berhasil dibuat dengan ID: ${newSession._id}`);

    res.status(201).json(newSession);

  } catch (error) {
    let errorMessage = 'Terjadi kesalahan pada server.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(`[SESSION] Error saat membuat sesi: ${errorMessage}`, error);
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
  console.log(`[SESSION] Permintaan untuk mengambil sesi. SessionID: ${sessionId}, UserID: ${userId}`);

  try {
    const session = await Session.findById(sessionId).populate('problemIds');

    if (!session) {
      console.warn(`[SESSION] Gagal mengambil sesi: Sesi tidak ditemukan untuk ID: ${sessionId}`);
      return res.status(404).json({ message: 'Sesi tidak ditemukan.' });
    }

    if (session.userId.toString() !== userId) {
      console.warn(`[SESSION] Gagal mengambil sesi: Akses ditolak. User ${userId} mencoba mengakses sesi milik user ${session.userId}`);
      return res.status(403).json({ message: 'Akses ditolak.' });
    }

    const problemScores: { [key: string]: number } = {};
    for (const problemId of session.problemIds) {
      const lastSubmission = session.submissions
        .filter(s => s.problemId.toString() === problemId.toString())
        .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())[0];

      problemScores[problemId.toString()] = lastSubmission ? lastSubmission.nonSampleScore : 0;
    }
    console.log(`[SESSION] Berhasil menghitung skor per soal: ${JSON.stringify(problemScores)}`);

    const sessionObject = session.toObject();
    (sessionObject as any).problemScores = problemScores;

    res.json(sessionObject);
    console.log(`[SESSION] Berhasil mengirim data sesi untuk ID: ${sessionId}`);

  } catch (error) {
    let errorMessage = 'Terjadi kesalahan pada server.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(`[SESSION] Error saat mengambil sesi ID ${sessionId}: ${errorMessage}`);
    res.status(500).json({ message: errorMessage });
  }
};

/**
 * @route   GET /api/sessions/active
 * @desc    Mengambil semua sesi aktif (in-progress) milik pengguna
 * @access  Protected
 */
export const getActiveSessions = async (req: IRequest, res: Response) => {
  const userId = req.user?.id;
  console.log(`[SESSION] Permintaan untuk mengambil sesi aktif untuk UserID: ${userId}`);

  try {
    const activeSessions = await Session.find({
      userId: userId,
      status: 'in-progress',
    }).sort({ startTime: -1 });

    console.log(`[SESSION] Berhasil menemukan ${activeSessions.length} sesi aktif untuk UserID: ${userId}`);
    res.json(activeSessions);

  } catch (error) {
    let errorMessage = 'Terjadi kesalahan pada server saat mengambil sesi aktif.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(`[SESSION] Error saat mengambil sesi aktif untuk UserID ${userId}: ${errorMessage}`);
    res.status(500).json({ message: errorMessage });
  }
};

/**
 * @route   GET /api/sessions/completed
 * @desc    Mengambil semua sesi yang telah selesai milik pengguna
 * @access  Protected
 */
export const getCompletedSessions = async (req: IRequest, res: Response) => {
  const userId = req.user?.id;
  console.log(`[SESSION] Permintaan untuk mengambil sesi yang telah selesai untuk UserID: ${userId}`);

  try {
    const completedSessions = await Session.find({
      userId: userId,
      status: 'completed',
    }).sort({ startTime: -1 });

    console.log(`[SESSION] Berhasil menemukan ${completedSessions.length} sesi yang telah selesai untuk UserID: ${userId}`);
    res.json(completedSessions);

  } catch (error) {
    let errorMessage = 'Terjadi kesalahan pada server saat mengambil sesi yang telah selesai.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(`[SESSION] Error saat mengambil sesi yang telah selesai untuk UserID ${userId}: ${errorMessage}`);
    res.status(500).json({ message: errorMessage });
  }
};
