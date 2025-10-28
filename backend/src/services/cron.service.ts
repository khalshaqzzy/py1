import Session, { ISession } from '../models/session.model';
import { gradeExamSession } from './grading.service';

/**
 * Menjalankan scheduler untuk memeriksa dan menilai ujian yang telah berakhir.
 */
export const startExpiredExamScheduler = () => {
  console.log('Scheduler untuk ujian yang berakhir telah dimulai. Pengecekan setiap menit.');

  // Jalan setiap 60 detik
  setInterval(async () => {
    try {
      const now = new Date();
      
      // Cari sesi ujian yang sedang berlangsung dan waktunya sudah habis
      const expiredSessions: ISession[] = await Session.find({
        type: 'exam',
        status: 'in-progress',
        endTime: { $lte: now },
      });

      if (expiredSessions.length > 0) {
        console.log(`Menemukan ${expiredSessions.length} sesi ujian yang telah berakhir. Memproses...`);
        for (const session of expiredSessions) {
          console.log(`Menilai sesi ujian dengan ID: ${session._id}`);
          await gradeExamSession(session);
        }
      }
    } catch (error) {
      console.error('Error selama pengecekan ujian yang berakhir:', error);
    }
  }, 60000); // 60000 ms
};
