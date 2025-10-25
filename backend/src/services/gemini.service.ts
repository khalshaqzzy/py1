import { GoogleGenAI, Type } from '@google/genai';
import { ITestCase } from '../models/problem.model';

// Inisialisasi GoogleGenAI. SDK akan secara otomatis mengambil GEMINI_API_KEY dari environment variables.
const ai = new GoogleGenAI({});

// --- DATABASE CONTOH SOAL UNTUK FEW-SHOT PROMPTING ---
const examples = new Map<number, { prompt: string; response: string; }>();

// Contoh untuk Modul 1: Percabangan
examples.set(1, {
  prompt: `- Topik Utama: Conditional\n- Tingkat Kesulitan: Mudah`,
  response: `{
    "description": "Tuan Leo, pemilik kafe, menentukan jumlah produksi kopi berdasarkan kualitas dan jumlah biji kopi yang diterima. Aturan produksinya adalah: Kualitas 'A' & >50kg menghasilkan 150 cangkir/kg. Kualitas 'B' & >40kg menghasilkan 100 cangkir/kg. Kualitas 'C' & >30kg menghasilkan 80 cangkir/kg. Jika jumlah biji kopi <= 30kg, hanya menghasilkan 30 cangkir/kg terlepas dari kualitasnya. Buatlah program yang menerima input kualitas (char 'A', 'B', atau 'C') dan jumlah biji kopi (integer), lalu menghitung dan mencetak total cangkir kopi yang dapat diproduksi.",
    "bannedFunctions": [],
    "testCases": [
      { "input": "A\n60", "expectedOutput": "9000", "isExample": true },
      { "input": "B\n45", "expectedOutput": "4500", "isExample": true },
      { "input": "C\n20", "expectedOutput": "600", "isExample": true },
      { "input": "A\n50", "expectedOutput": "1500", "isExample": false },
      { "input": "B\n40", "expectedOutput": "1200", "isExample": false },
      { "input": "C\n30", "expectedOutput": "900", "isExample": false },
      { "input": "A\n29", "expectedOutput": "870", "isExample": false },
      { "input": "B\n1", "expectedOutput": "30", "isExample": false },
      { "input": "C\n30.5", "expectedOutput": "2440", "isExample": false },
      { "input": "A\n50.5", "expectedOutput": "7575", "isExample": false },
      { "input": "B\n40.1", "expectedOutput": "4010", "isExample": false },
      { "input": "C\n100", "expectedOutput": "8000", "isExample": false },
      { "input": "A\n0", "expectedOutput": "0", "isExample": false }
    ]
  }`
});

// Contoh untuk Modul 2: Perulangan
examples.set(2, {
  prompt: `- Topik Utama: Looping\n- Tingkat Kesulitan: Sedang`,
  response: `{
    "description": "Restoran Mokgnep buka selama N jam dengan harga berbeda tiap jam. Tuan Leo ingin makan selama 3 jam berturut-turut dengan biaya termurah. Buatlah program yang menerima input N, diikuti oleh N harga per jam, lalu temukan dan cetak total biaya minimum untuk 3 jam makan berturut-turut.",
    "bannedFunctions": ["min", "sort"],
    "testCases": [
      { "input": "6\n10000\n20000\n30000\n40000\n50000\n60000", "expectedOutput": "60000", "isExample": true },
      { "input": "7\n50000\n10000\n30000\n20000\n10000\n10000\n50000", "expectedOutput": "40000", "isExample": true },
      { "input": "4\n10000\n50000\n50000\n10000", "expectedOutput": "110000", "isExample": true },
      { "input": "3\n10\n20\n5", "expectedOutput": "35", "isExample": false },
      { "input": "8\n1\n1\n10\n1\n1\n10\n1\n1", "expectedOutput": "3", "isExample": false },
      { "input": "5\n10\n5\n1\n5\n10", "expectedOutput": "11", "isExample": false },
      { "input": "10\n9\n8\n7\n6\n5\n4\n3\n2\n1\n0", "expectedOutput": "3", "isExample": false },
      { "input": "5\n100\n100\n1\n100\n100", "expectedOutput": "201", "isExample": false },
      { "input": "6\n3\n2\n1\n1\n2\n3", "expectedOutput": "4", "isExample": false },
      { "input": "7\n10\n20\n3\n4\n5\n60\n70", "expectedOutput": "12", "isExample": false },
      { "input": "5\n5\n5\n5\n5\n5", "expectedOutput": "15", "isExample": false },
      { "input": "6\n10\n1\n10\n1\n10\n1", "expectedOutput": "12", "isExample": false },
      { "input": "4\n100\n1\n1\n100", "expectedOutput": "102", "isExample": false }
    ]
  }`
});

// Contoh untuk Modul 3: Fungsi dan Prosedur
examples.set(3, {
  prompt: `- Topik Utama: Function & Procedure\n- Tingkat Kesulitan: Sedang`,
  response: `{
    "description": "Tuan Leo memiliki daftar harga barang. Buatlah dua subprogram: satu fungsi bernama 'rata2' yang menerima list harga dan mengembalikan nilai rata-ratanya, dan satu prosedur bernama 'sebut' yang menerima string mata uang dan sebuah bilangan lalu mencetak keduanya. Program utama harus membaca N buah harga, memanggil 'rata2' untuk menghitung rata-rata, lalu memanggil 'sebut' untuk menampilkannya. Output harus di format 2 angka di belakang koma.",
    "bannedFunctions": ["avg", "mean", "sum"],
    "testCases": [
      { "input": "3\n10000\n20000\n30000\nrupiah", "expectedOutput": "20000.00 rupiah", "isExample": true },
      { "input": "4\n10\n20\n30\n40\nKPD", "expectedOutput": "25.00 KPD", "isExample": true },
      { "input": "2\n10000\n20000\nKompengDollar", "expectedOutput": "15000.00 KompengDollar", "isExample": true },
      { "input": "1\n100\nUSD", "expectedOutput": "100.00 USD", "isExample": false },
      { "input": "5\n1\n2\n3\n4\n5\nIDR", "expectedOutput": "3.00 IDR", "isExample": false },
      { "input": "3\n0\n0\n0\nYEN", "expectedOutput": "0.00 YEN", "isExample": false },
      { "input": "2\n1\n2\nEuro", "expectedOutput": "1.50 Euro", "isExample": false },
      { "input": "4\n5\n5\n5\n5\nSGD", "expectedOutput": "5.00 SGD", "isExample": false },
      { "input": "3\n10.5\n20.5\n30.5\nAUD", "expectedOutput": "20.50 AUD", "isExample": false },
      { "input": "2\n1000000\n2000000\nBTC", "expectedOutput": "1500000.00 BTC", "isExample": false },
      { "input": "1\n3.14159\nPI", "expectedOutput": "3.14 PI", "isExample": false },
      { "input": "3\n7\n8\n9\nMYR", "expectedOutput": "8.00 MYR", "isExample": false },
      { "input": "2\n123\n456\nTHB", "expectedOutput": "289.50 THB", "isExample": false }
    ]
  }`
});

// --- KONFIGURASI MODEL GEMINI ---
const problemSchema = {
  type: Type.OBJECT,
  properties: {
    description: { type: Type.STRING },
    bannedFunctions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    testCases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          input: { type: Type.STRING },
          expectedOutput: { type: Type.STRING },
          isExample: { type: Type.BOOLEAN },
        },
        required: ["input", "expectedOutput", "isExample"],
      },
    },
  },
  required: ["description", "bannedFunctions", "testCases"],
};

// Interface untuk struktur JSON yang diharapkan dari AI
export interface AIProblemStructure {
  description: string;
  bannedFunctions: string[];
  testCases: ITestCase[];
}

// Type guard untuk memvalidasi struktur
const isAIProblemStructure = (obj: any): obj is AIProblemStructure => {
  return (
    obj &&
    typeof obj.description === 'string' &&
    Array.isArray(obj.bannedFunctions) &&
    obj.bannedFunctions.every((item: any) => typeof item === 'string') &&
    Array.isArray(obj.testCases) &&
    obj.testCases.length > 0 &&
    obj.testCases.every((tc: any) => 
      typeof tc.input === 'string' &&
      typeof tc.expectedOutput === 'string' &&
      typeof tc.isExample === 'boolean'
    )
  );
};

/**
 * Menghasilkan satu soal latihan dari Gemini API menggunakan skema output dinamis.
 * @param module - Nama modul (e.g., 'Looping').
 * @param moduleId - ID modul (1, 2, atau 3) untuk memilih contoh.
 * @param difficulty - Tingkat kesulitan (e.g., 'Sedang').
 * @param instructions - Instruksi tambahan dari pengguna.
 * @returns Objek soal yang sudah divalidasi atau null jika gagal.
 */
export const generateAIProblem = async (
  module: string,
  moduleId: number,
  difficulty: string,
  instructions?: string
): Promise<AIProblemStructure | null> => {

  // Pilih contoh yang relevan berdasarkan moduleId, default ke modul 1 jika tidak valid
  const example = examples.get(moduleId) ?? examples.get(1)!;

  const prompt = `
    # PERAN DAN TUJUAN
    Anda adalah seorang Dosen Berpikir Komputasional di Institut Teknologi Bandung (ITB) yang sangat berpengalaman. Tujuan utama Anda adalah untuk membuat sebuah soal pemrograman Python yang unik, mendidik, dan memiliki narasi yang menarik untuk mahasiswa tingkat pertama (TPB).

    # RUBRIK KUALITAS SOAL
    - **Cerita yang Jelas & Menarik:** Soal harus dibungkus dalam sebuah narasi atau studi kasus singkat yang relevan dengan dunia nyata atau kehidupan mahasiswa. Hindari soal yang terlalu abstrak atau matematis.
    - **Spesifikasi Jelas:** Deskripsi soal harus sangat jelas, tidak ambigu, dan mencakup format input dan output yang diharapkan.
    - **Tingkat Kesulitan Sesuai:** Soal harus sesuai dengan tingkat kesulitan yang diminta. 'Mudah' biasanya melibatkan 1-2 variabel dan logika sederhana. 'Sedang' bisa melibatkan beberapa kondisi atau loop sederhana. 'Sulit' bisa melibatkan loop bersarang, beberapa fungsi, atau logika yang lebih kompleks.

    # CONTOH SOAL (FEW-SHOT EXAMPLE)
    Berikut adalah CONTOH SEMPURNA dari soal dan format JSON yang diharapkan. Pelajari gaya, struktur, dan kualitasnya. Jangan meniru contoh ini secara langsung.
    
    --- CONTOH SOAL ---
    Spesifikasi:
    ${example.prompt}
    
    --- CONTOH OUTPUT JSON UNTUK SOAL DI ATAS ---
    ${example.response}

    # TUGAS ANDA
    Sekarang, buatkan satu soal BARU yang unik dan berbeda dari contoh, berdasarkan spesifikasi berikut:
    - Topik Utama: ${module}
    - Tingkat Kesulitan: ${difficulty}
    ${instructions ? `- Instruksi Tambahan dari Pengguna: ${instructions}` : ''}

    # ATURAN TEGAS
    1.  **Output JSON Murni:** Respons Anda HARUS hanya berupa satu blok JSON yang valid sesuai skema, tanpa tambahan teks, komentar, atau markdown (seperti \
\
\
json).
    2.  **Jumlah Kasus Uji:** Buatlah total 13 kasus uji: 3 kasus uji sebagai contoh yang terlihat (isExample: true) dan 10 kasus uji tersembunyi (isExample: false).
    3.  **Input/Output Redirection:** Pastikan input dan output pada kasus uji berupa string yang siap dipakai untuk I/O redirection (gunakan '\n' untuk baris baru jika ada beberapa input).
    4.  **Keunikan:** Soal yang Anda buat HARUS sepenuhnya orisinal dan tidak menjiplak dari contoh yang diberikan.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: problemSchema,
        }
    });
    
    if (!response || !response.text) {
        console.error('Gemini API did not return a valid text response.');
        if (response) {
            console.error('Full response for debugging:', JSON.stringify(response, null, 2));
        }
        return null;
    }

    const parsedJson = JSON.parse(response.text.trim());

    if (isAIProblemStructure(parsedJson)) {
      return parsedJson;
    } else {
      console.error('Gemini API response JSON does not match the expected structure.', parsedJson);
      return null;
    }

  } catch (error) {
    console.error('Error calling or parsing Gemini API response:', error);
    return null;
  }
};
