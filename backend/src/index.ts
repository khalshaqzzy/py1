import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
// Routes
import authRoutes from './routes/auth.routes';
import contentRoutes from './routes/content.routes';
import sessionRoutes from './routes/session.routes';
import submissionRoutes from './routes/submission.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

// Inisialisasi 
const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke Database MongoDB
const dbURI = process.env.DB_URI;

if (!dbURI) {
  console.error('Gagal terhubung ke MongoDB: DB_URI tidak didefinisikan di .env');
  process.exit(1);
}

mongoose.connect(dbURI)
  .then(() => console.log('Berhasil terhubung ke MongoDB...'))
  .catch(err => console.error('Gagal terhubung ke MongoDB:', err));


app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/submit', submissionRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Server Py1 berjalan!');
});

// Menentukan port dari environment variable, default 3001
const PORT: number = parseInt(process.env.PORT || '3001', 10);

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
