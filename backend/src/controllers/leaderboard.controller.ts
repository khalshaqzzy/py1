import { Request, Response } from 'express';
import Session from '../models/session.model';
import mongoose from 'mongoose';

/**
 * @route   GET /api/leaderboards/:moduleId
 * @route   GET /api/leaderboards/overall
 * @desc    Mengambil data papan peringkat
 * @access  Public
 */
export const getLeaderboard = async (req: Request, res: Response) => {
  const { moduleId } = req.params;

  try {
    const matchStage: any = {
      type: 'exam',
      status: 'completed',
      finalScore: { $exists: true },
      timeTakenSeconds: { $exists: true },
    };

    if (moduleId && moduleId !== 'overall') {
      const modId = parseInt(moduleId, 10);
      if (isNaN(modId)) {
        return res.status(400).json({ message: 'Module ID tidak valid.' });
      }
      matchStage.moduleId = modId;
    }

    const leaderboard = await Session.aggregate([
      // 1. Filter sesi yang relevan
      { $match: matchStage },

      // 2. Urutkan untuk mendapatkan skor terbaik dari setiap user
      { $sort: { finalScore: -1, timeTakenSeconds: 1 } },

      // 3. Kelompokkan berdasarkan user, ambil hanya entri skor tertinggi mereka
      {
        $group: {
          _id: "$userId",
          bestScore: { $first: "$finalScore" },
          timeTaken: { $first: "$timeTakenSeconds" },
          moduleId: { $first: "$moduleId" },
        },
      },

      // 4. Urutkan lagi hasil agregat final
      { $sort: { bestScore: -1, timeTaken: 1 } },

      // 5. Batasi hanya untuk top 50
      { $limit: 50 },

      // 6. Gabungkan dengan data user untuk mendapatkan username
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },

      // 7. Rapikan output akhir
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: { $arrayElemAt: ["$userDetails.username", 0] },
          score: "$bestScore",
          time: "$timeTaken",
        },
      },
    ]);

    res.json(leaderboard);

  } catch (error) {
    console.error('Server Error in getLeaderboard:', error);
    let errorMessage = 'Terjadi kesalahan pada server saat mengambil papan peringkat.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ message: errorMessage });
  }
};
