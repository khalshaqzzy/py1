import { Response } from 'express';
import { IRequest } from '../middleware/auth.middleware';
import Session from '../models/session.model';
import Problem from '../models/problem.model';
import { executeCodeInSandbox } from '../services/code-execution.service';

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

    // 5. Simpan hasil submisi dan perbarui status sesi jika perlu
    session.submissions.push({
      problemId,
      code,
      score: finalScore,
      submittedAt: new Date(),
    });

    // Cek apakah sesi ujian telah selesai
    if (session.type === 'exam') {
      const submittedProblemIds = new Set(session.submissions.map(s => s.problemId.toString()));
      if (submittedProblemIds.size === session.problemIds.length) {
        session.status = 'completed';
        
        // Hitung skor akhir sesi (rata-rata dari semua skor submisi)
        const totalScore = session.submissions.reduce((acc, s) => acc + s.score, 0);
        session.finalScore = totalScore / session.submissions.length;

        // Hitung total waktu pengerjaan dalam detik
        const timeTaken = (new Date().getTime() - session.startTime.getTime()) / 1000;
        session.timeTakenSeconds = Math.round(timeTaken);
      }
    }

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
