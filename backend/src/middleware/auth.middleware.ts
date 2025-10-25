import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Menambahkan properti 'user' ke interface Request dari Express
declare global {
  namespace Express {
    interface Request {
      user?: string | object; // ID user atau objek user yang sudah di-decode
    }
  }
}

/**
 * Middleware untuk memproteksi rute dengan verifikasi JWT.
 */
export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Cek header Authorization untuk Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token dari header (format: 'Bearer <token>')
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi token
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET tidak ditemukan di environment variables.');
      }

      const decoded = jwt.verify(token, secret);

      // Tambahkan data user yang sudah di-decode
      req.user = decoded;

      next(); 
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Tidak terautentikasi, token gagal.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak terautentikasi, tidak ada token.' });
  }
};
