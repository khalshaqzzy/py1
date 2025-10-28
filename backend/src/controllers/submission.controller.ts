import { Response } from 'express';
import { IRequest } from '../middleware/auth.middleware';
import Session from '../models/session.model';
import Problem from '../models/problem.model';
import { executeCodeInSandbox } from '../services/code-execution.service';
import { gradeExamSession } from '../services/grading.service';

/**
 * @route   POST /api/submit
 * @desc    Menerima submisi kode, mengeksekusi, dan menilai
 * @access  Protected
 */
export const submitCode = async (req: IRequest, res: Response) => {
  const { sessionId, problemId, code } = req.body;
  const userId = req.user?.id;

  // 1. Ambil dan validasi data submisi
  if (!sessionId || !problemId || !code) {
    return res.status(400).json({ message: 'sessionId, problemId, dan kode tidak boleh kosong.' });
  }

  try {
    // 2. Ambil detail sesi dan soal dari database.
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Sesi tidak ditemukan.' });
    }
    if (session.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Akses ke sesi ini ditolak.' });
    }
    if (session.status !== 'in-progress') {
      return res.status(400).json({ message: 'Sesi ini sudah selesai.' });
    }
    if (!session.problemIds.map(id => id.toString()).includes(problemId)) {
      return res.status(400).json({ message: 'Soal tidak ditemukan di dalam sesi ini.' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Detail soal tidak ditemukan.' });
    }

    // 3. Lakukan pengecekan `bannedFunctions` melalui analisis statis.
    const { bannedFunctions, testCases } = problem;
    if (bannedFunctions && bannedFunctions.length > 0) {
      for (const bannedFunc of bannedFunctions) {
        const pattern = new RegExp(`\\b${bannedFunc}\\s*\\(`, 'g');
        if (pattern.test(code)) {
          return res.status(400).json({ 
            message: `Penggunaan fungsi yang dilarang terdeteksi: ${bannedFunc}`,
            status: 'Banned Function',
          });
        }
      }
    }

    // 4. Panggil service eksekutor kode untuk setiap test case
    let score = 0;
    const results = [];
    for (const testCase of testCases) {
      const executionResult = await executeCodeInSandbox(code, testCase.input);
      
      const passed = executionResult.stdout.trim() === testCase.expectedOutput.trim() && executionResult.exit_code === 0;
      if (passed) {
        score++;
      }
      
      results.push({
        testCase: { input: testCase.input, expectedOutput: testCase.expectedOutput, isExample: testCase.isExample },
        passed,
        actualOutput: executionResult.stdout,
        error: executionResult.error || executionResult.stderr,
      });
    }

    const finalScore = (score / testCases.length) * 100;

    // 5. Simpan hasil submisi
    session.submissions.push({
      problemId,
      code,
      score: finalScore,
      submittedAt: new Date(),
    });

    await session.save();

    // Kirim hasil kembali ke user
    res.status(200).json({
      message: 'Submisi berhasil dinilai.',
      finalScore,
      totalTestCases: testCases.length,
      passed_count: score,
      results,
      sessionStatus: session.status,
    });

  } catch (error) {
    console.error('Server Error in submitCode:', error);
    let errorMessage = 'Terjadi kesalahan pada server saat memproses submisi.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (!res.headersSent) {
      res.status(500).json({ message: errorMessage });
    }
  }
};

/**
 * @route   POST /api/submit/:sessionId/grade
 * @desc    Menilai keseluruhan sesi ujian dan menyelesaikannya
 * @access  Protected
 */
export const gradeExam = async (req: IRequest, res: Response) => {
  const { sessionId } = req.params;
  const userId = req.user?.id;

  try {
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Sesi tidak ditemukan.' });
    }
    if (session.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Akses ke sesi ini ditolak.' });
    }
    if (session.status !== 'in-progress') {
      return res.status(400).json({ message: 'Sesi ini sudah selesai atau tidak valid.' });
    }
    if (session.type !== 'exam') {
      return res.status(400).json({ message: 'Fungsi ini hanya untuk sesi ujian.' });
    }

    const gradedSession = await gradeExamSession(session);

    res.status(200).json(gradedSession);

  } catch (error) {
    console.error('Server Error in gradeExam:', error);
    let errorMessage = 'Terjadi kesalahan pada server saat menilai ujian.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (!res.headersSent) {
      res.status(500).json({ message: errorMessage });
    }
  }
};
