import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface untuk payload JWT yang sudah di-decode
export interface IDecodedUser {
  id: string;
  iat: number;
  exp: number;
}

// Interface kustom untuk Request yang menyertakan properti 'user'
export interface IRequest extends Request {
  user?: IDecodedUser;
}

/**
 * Middleware untuk memproteksi rute dengan verifikasi JWT.
 */
export const protect = (req: IRequest, res: Response, next: NextFunction) => {
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

      const decoded = jwt.verify(token, secret) as IDecodedUser;

      // Tambahkan data user yang sudah di-decode ke request
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