import { spawn } from 'child_process';

const TIMEOUT_SECONDS = 5; // Batas waktu eksekusi 5 detik

// Interface untuk hasil eksekusi yang terstruktur
export interface IExecutionResult {
  stdout: string;
  stderr: string;
  exit_code: number;
  error: string | null;
}

/**
 * Mengeksekusi kode Python secara langsung di dalam container backend.
 * @param code - Kode Python yang akan dieksekusi.
 * @param input - String input untuk di-pipe ke stdin proses.
 * @returns Promise yang resolve dengan hasil eksekusi.
 */
export const executeCodeInSandbox = (
  code: string,
  input: string
): Promise<IExecutionResult> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Jalankan proses Python, lewatkan kode pengguna via argumen -c
      const pythonProcess = spawn('python3', ['-c', code]);

      let stdout = '';
      let stderr = '';
      let timeoutId: NodeJS.Timeout;

      // Set timeout
      timeoutId = setTimeout(() => {
        pythonProcess.kill();
        resolve({
          stdout: '',
          stderr: `TimeoutError: Kode berjalan lebih dari ${TIMEOUT_SECONDS} detik.`,
          exit_code: 1,
          error: `TimeoutError: Kode berjalan lebih dari ${TIMEOUT_SECONDS} detik.`,
        });
      }, TIMEOUT_SECONDS * 1000); // Konversi ke milidetik

      // Pipe input ke stdin proses Python
      pythonProcess.stdin.write(input);
      pythonProcess.stdin.end();

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code) => {
        clearTimeout(timeoutId); // Hapus timeout jika proses selesai
        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exit_code: code || 0,
          error: stderr.trim() || null,
        });
      });

      pythonProcess.on('error', (err) => {
        clearTimeout(timeoutId);
        reject(new Error(`Gagal menjalankan proses Python: ${err.message}`));
      });

    } catch (error) {
      reject(error);
    }
  });
};