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
  console.log(`[SUBMIT] Permintaan submisi diterima. UserID: ${userId}, SessionID: ${sessionId}, ProblemID: ${problemId}`);

  if (!sessionId || !problemId || !code) {
    console.warn(`[SUBMIT] Gagal: Data tidak lengkap. Body: ${JSON.stringify(req.body)}`);
    return res.status(400).json({ message: 'sessionId, problemId, dan kode tidak boleh kosong.' });
  }

  try {
    const session = await Session.findById(sessionId);

    if (!session) {
      console.warn(`[SUBMIT] Gagal: Sesi tidak ditemukan untuk ID: ${sessionId}`);
      return res.status(404).json({ message: 'Sesi tidak ditemukan.' });
    }
    if (session.userId.toString() !== userId) {
      console.warn(`[SUBMIT] Gagal: Akses ditolak. User ${userId} mencoba submit ke sesi milik ${session.userId}`);
      return res.status(403).json({ message: 'Akses ke sesi ini ditolak.' });
    }
    if (session.status !== 'in-progress') {
      console.warn(`[SUBMIT] Gagal: Sesi ${sessionId} sudah selesai.`);
      return res.status(400).json({ message: 'Sesi ini sudah selesai.' });
    }
    if (!session.problemIds.map(id => id.toString()).includes(problemId)) {
      console.warn(`[SUBMIT] Gagal: Problem ${problemId} tidak ada di sesi ${sessionId}.`);
      return res.status(400).json({ message: 'Soal tidak ditemukan di dalam sesi ini.' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      console.warn(`[SUBMIT] Gagal: Detail problem tidak ditemukan untuk ID: ${problemId}`);
      return res.status(404).json({ message: 'Detail soal tidak ditemukan.' });
    }

    const { bannedFunctions, testCases } = problem;
    if (bannedFunctions && bannedFunctions.length > 0) {
      for (const bannedFunc of bannedFunctions) {
        const pattern = new RegExp(`\\b${bannedFunc}\\s*\\(`, 'g');
        if (pattern.test(code)) {
          console.warn(`[SUBMIT] Submisi ditolak: Penggunaan fungsi terlarang (${bannedFunc}) terdeteksi di sesi ${sessionId}`);
          return res.status(400).json({ 
            message: `Penggunaan fungsi yang dilarang terdeteksi: ${bannedFunc}`,
            status: 'Banned Function',
          });
        }
      }
    }

    let score = 0;
    let nonSampleScore = 0;
    const results = [];
    console.log(`[SUBMIT] Memulai eksekusi ${testCases.length} test case untuk ProblemID: ${problemId}`);
    for (const testCase of testCases) {
      const executionResult = await executeCodeInSandbox(code, testCase.input);
      
      const passed = executionResult.stdout.trim() === testCase.expectedOutput.trim() && executionResult.exit_code === 0;
      if (passed) {
        score++;
        if (!testCase.isExample) {
          nonSampleScore++;
        }
      }
      
      results.push({
        testCase: { input: testCase.input, expectedOutput: testCase.expectedOutput, isExample: testCase.isExample },
        passed,
        actualOutput: executionResult.stdout,
        error: executionResult.error || executionResult.stderr,
      });
    }
    console.log(`[SUBMIT] Eksekusi selesai. Lolos: ${score}/${testCases.length}. Lolos non-sample: ${nonSampleScore}`);

    const finalScore = (score / testCases.length) * 100;

    session.submissions.push({
      problemId,
      code,
      score: finalScore,
      nonSampleScore,
      submittedAt: new Date(),
    });

    // Hitung kembali skor untuk semua soal untuk dikirim ke frontend
    const problemScores: { [key: string]: number } = {};
    for (const pId of session.problemIds) {
      const lastSub = session.submissions
        .filter(s => s.problemId.toString() === pId.toString())
        .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())[0];
      problemScores[pId.toString()] = lastSub ? lastSub.nonSampleScore : 0;
    }

    const resultPayload = {
      message: 'Submisi berhasil dinilai.',
      finalScore,
      totalTestCases: testCases.length,
      passed_count: score,
      results,
      sessionStatus: session.status,
      problemScores,
    };

    session.lastSubmissionResult = {
      problemId,
      result: resultPayload,
    };

    await session.save();
    console.log(`[SUBMIT] Hasil submisi untuk sesi ${sessionId} berhasil disimpan.`);

    res.status(200).json(resultPayload);

  } catch (error) {
    let errorMessage = 'Terjadi kesalahan pada server saat memproses submisi.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(`[SUBMIT] Error saat memproses submisi untuk sesi ${sessionId}: ${errorMessage}`, error);
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
  console.log(`[SUBMIT] Permintaan penilaian ujian diterima. SessionID: ${sessionId}, UserID: ${userId}`);

  try {
    const session = await Session.findById(sessionId);

    if (!session) {
      console.warn(`[SUBMIT] Gagal menilai: Sesi tidak ditemukan untuk ID: ${sessionId}`);
      return res.status(404).json({ message: 'Sesi tidak ditemukan.' });
    }
    if (session.userId.toString() !== userId) {
      console.warn(`[SUBMIT] Gagal menilai: Akses ditolak. User ${userId} mencoba menilai sesi milik ${session.userId}`);
      return res.status(403).json({ message: 'Akses ke sesi ini ditolak.' });
    }
    if (session.status !== 'in-progress') {
      console.warn(`[SUBMIT] Gagal menilai: Sesi ${sessionId} sudah selesai atau tidak valid.`);
      return res.status(400).json({ message: 'Sesi ini sudah selesai atau tidak valid.' });
    }
    if (session.type !== 'exam') {
      console.warn(`[SUBMIT] Gagal menilai: Sesi ${sessionId} bukan merupakan sesi ujian.`);
      return res.status(400).json({ message: 'Fungsi ini hanya untuk sesi ujian.' });
    }

    const gradedSession = await gradeExamSession(session);
    console.log(`[SUBMIT] Sesi ujian ${sessionId} berhasil dinilai. Skor Akhir: ${gradedSession.finalScore}`);

    res.status(200).json(gradedSession);

  } catch (error) {
    let errorMessage = 'Terjadi kesalahan pada server saat menilai ujian.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(`[SUBMIT] Error saat menilai ujian sesi ${sessionId}: ${errorMessage}`, error);
    if (!res.headersSent) {
      res.status(500).json({ message: errorMessage });
    }
  }
};
