import Session, { ISession } from '../models/session.model';
import Problem from '../models/problem.model';
import { executeCodeInSandbox } from './code-execution.service';

/**
 * Menilai sesi ujian secara keseluruhan.
 * - Menghitung skor berdasarkan submisi terakhir untuk setiap soal.
 * - Skor dihitung dari jumlah test case non-contoh yang benar.
 * - Memperbarui status sesi menjadi 'completed'.
 * 
 * @param session - Objek sesi Mongoose yang akan dinilai.
 * @returns Sesi yang telah diperbarui dengan skor akhir.
 */
export const gradeExamSession = async (session: ISession): Promise<ISession> => {
  if (session.type !== 'exam' || session.status !== 'in-progress') {
    // Tidak melakukan apa-apa jika bukan sesi ujian yang sedang berlangsung
    return session;
  }

  let totalCorrectNonSampleCases = 0;

  // Iterasi melalui setiap soal yang ada di sesi
  for (const problemId of session.problemIds) {
    // Temukan submisi terakhir
    const lastSubmission = session.submissions
      .filter(s => s.problemId.toString() === problemId.toString())
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())[0];

    if (lastSubmission) {
      const problem = await Problem.findById(problemId);
      if (problem) {
        const nonSampleTestCases = problem.testCases.filter(tc => !tc.isExample);
        
        for (const testCase of nonSampleTestCases) {
          try {
            const executionResult = await executeCodeInSandbox(lastSubmission.code, testCase.input);
            const passed = executionResult.stdout.trim() === testCase.expectedOutput.trim() && executionResult.exit_code === 0;
            if (passed) {
              totalCorrectNonSampleCases++;
            }
          } catch (error) {
            console.error(`Error executing code for problem ${problemId} during final grading:`, error);
          }
        }
      }
    }
  }

  // Perbarui sesi
  session.status = 'completed';
  session.finalScore = totalCorrectNonSampleCases; // Skor akhir adalah jumlah total kasus uji non-sample yang benar
  
  // Hitung total waktu pengerjaan dalam detik
  const timeTaken = (new Date().getTime() - session.startTime.getTime()) / 1000;
  session.timeTakenSeconds = Math.round(timeTaken);

  await session.save();
  return session;
};
