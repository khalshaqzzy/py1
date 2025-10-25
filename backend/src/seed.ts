
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem, { ITestCase } from './models/problem.model';

dotenv.config();

// Definisikan tipe data untuk objek pembuatan soal, tanpa extend Document
type ProblemCreationData = {
  source: 'exam';
  moduleId: number;
  description: string;
  bannedFunctions: string[];
  testCases: ITestCase[];
};

const examProblems: ProblemCreationData[] = [
  // MODUL 1: PERCABANGAN (CONDITIONAL)
  {
    source: 'exam',
    moduleId: 1,
    description: `Tuan Leo, seorang kolektor mainan langka, ingin memberikan diskon kepada pelanggan setianya di toko online "KompengToys". Aturan diskonnya adalah sebagai berikut:
- Pelanggan dengan status "Gold" mendapat diskon 20% jika total belanja di atas Rp 500.000, atau 15% jika tidak.
- Pelanggan dengan status "Silver" mendapat diskon 10% jika total belanja di atas Rp 300.000, atau 5% jika tidak.
- Pelanggan "Bronze" dan non-member tidak mendapat diskon.
Buatlah program yang menerima input status pelanggan (string) dan total belanja (integer), lalu menghitung dan mencetak jumlah yang harus dibayar setelah diskon.`,
    bannedFunctions: [],
    testCases: [
      { input: "Gold\n600000", expectedOutput: "480000", isExample: true },
      { input: "Silver\n250000", expectedOutput: "237500", isExample: true },
      { input: "Bronze\n1000000", expectedOutput: "1000000", isExample: true },
      { input: "Gold\n500000", expectedOutput: "425000", isExample: false },
      { input: "Silver\n300000", expectedOutput: "270000", isExample: false },
      { input: "Gold\n100", expectedOutput: "85", isExample: false },
      { input: "Silver\n100", expectedOutput: "95", isExample: false },
      { input: "Bronze\n100", expectedOutput: "100", isExample: false },
      { input: "Non-member\n500000", expectedOutput: "500000", isExample: false },
      { input: "gold\n600000", expectedOutput: "600000", isExample: false }, // Case sensitive check
      { input: "Silver\n300001", expectedOutput: "270000.9", isExample: false },
      { input: "Gold\n500001", expectedOutput: "400000.8", isExample: false },
      { input: "Bronze\n0", expectedOutput: "0", isExample: false },
    ],
  },
  {
    source: 'exam',
    moduleId: 1,
    description: `Nona Sal adalah seorang alkemis di dunia game "PySaga". Dia bisa menggabungkan tiga item untuk menghasilkan item baru. Aturan kombinasinya adalah:
- Jika dia menggabungkan "Bunga Api", "Batu Bulan", dan "Air Suci", dia mendapatkan "Ramuan Legendaris".
- Jika dia hanya memiliki "Bunga Api" dan "Batu Bulan" (item ketiga apa saja selain "Air Suci"), dia mendapatkan "Ramuan Kuat".
- Jika dia hanya memiliki "Air Suci" (dua item lainnya bebas), dia mendapatkan "Ramuan Murni".
- Kombinasi lainnya tidak menghasilkan apa-apa.
Buatlah program yang menerima tiga nama item (string, satu per baris) dan mencetak hasil kombinasinya.`,
    bannedFunctions: [],
    testCases: [
      { input: "Bunga Api\nBatu Bulan\nAir Suci", expectedOutput: "Ramuan Legendaris", isExample: true },
      { input: "Bunga Api\nBatu Bulan\nKayu Biasa", expectedOutput: "Ramuan Kuat", isExample: true },
      { input: "Besi\nKain\nAir Suci", expectedOutput: "Ramuan Murni", isExample: true },
      { input: "Besi\nKain\nDebu", expectedOutput: "Tidak ada hasil", isExample: false },
      { input: "Air Suci\nAir Suci\nAir Suci", expectedOutput: "Ramuan Murni", isExample: false },
      { input: "Batu Bulan\nBunga Api\nAir Suci", expectedOutput: "Ramuan Legendaris", isExample: false },
      { input: "Batu Bulan\nBunga Api\nDaun", expectedOutput: "Ramuan Kuat", isExample: false },
      { input: "Air Suci\nBesi\nKain", expectedOutput: "Ramuan Murni", isExample: false },
      { input: "Bunga Api\nBesi\nKain", expectedOutput: "Tidak ada hasil", isExample: false },
      { input: "Batu Bulan\nBesi\nKain", expectedOutput: "Tidak ada hasil", isExample: false },
      { input: "Bunga Api\nAir Suci\nBatu Bulan", expectedOutput: "Ramuan Legendaris", isExample: false },
      { input: "Kayu Biasa\nAir Suci\nBunga Api", expectedOutput: "Ramuan Murni", isExample: false },
      { input: "Bunga Api\nBunga Api\nBunga Api", expectedOutput: "Tidak ada hasil", isExample: false },
    ],
  },
  {
    source: 'exam',
    moduleId: 1,
    description: `Di kota "PyCity", aturan parkir ditentukan oleh jenis kendaraan dan durasi parkir. Biaya parkir dihitung sebagai berikut:
- Untuk "mobil", biaya adalah Rp 5000 untuk jam pertama, dan Rp 3000 untuk setiap jam berikutnya.
- Untuk "motor", biaya adalah Rp 2000 untuk jam pertama, dan Rp 1000 untuk setiap jam berikutnya.
- Jika durasi parkir lebih dari 5 jam (untuk jenis kendaraan apa pun), akan dikenakan denda tambahan sebesar Rp 10.000.
Buatlah program yang menerima input jenis kendaraan (string "mobil" atau "motor") dan durasi parkir (integer dalam jam), lalu cetak total biaya parkir.`,
    bannedFunctions: [],
    testCases: [
      { input: "mobil\n3", expectedOutput: "11000", isExample: true },
      { input: "motor\n6", expectedOutput: "17000", isExample: true },
      { input: "mobil\n1", expectedOutput: "5000", isExample: true },
      { input: "motor\n1", expectedOutput: "2000", isExample: false },
      { input: "mobil\n5", expectedOutput: "17000", isExample: false },
      { input: "motor\n5", expectedOutput: "6000", isExample: false },
      { input: "mobil\n6", expectedOutput: "30000", isExample: false },
      { input: "motor\n2", expectedOutput: "3000", isExample: false },
      { input: "mobil\n10", expectedOutput: "42000", isExample: false },
      { input: "motor\n10", expectedOutput: "21000", isExample: false },
      { input: "mobil\n0", expectedOutput: "0", isExample: false },
      { input: "motor\n0", expectedOutput: "0", isExample: false },
      { input: "mobil\n-1", expectedOutput: "0", isExample: false },
    ],
  },
  // MODUL 2: PERULANGAN (LOOPING)
  {
    source: 'exam',
    moduleId: 2,
    description: `Nona Deb, seorang analis data, sedang menganalisis data penjualan harian sebuah toko selama N hari. Data penjualan direpresentasikan sebagai deret angka integer (positif berarti untung, negatif berarti rugi, nol berarti impas). Nona Deb ingin mengetahui berapa hari beruntun terpanjang toko tersebut mengalami keuntungan (angka > 0).\nBuatlah program yang membaca N, diikuti oleh N angka penjualan, lalu cetak panjang rentetan keuntungan beruntun terpanjang.`,
    bannedFunctions: ["max"],
    testCases: [
      { input: "8\n10 -20 30 40 50 -10 60 70", expectedOutput: "3", isExample: true },
      { input: "5\n-1 -2 -3 -4 -5", expectedOutput: "0", isExample: true },
      { input: "7\n1 2 3 0 4 5 6", expectedOutput: "3", isExample: true },
      { input: "10\n1 2 3 4 5 6 7 8 9 10", expectedOutput: "10", isExample: false },
      { input: "10\n-1 1 -2 1 -3 1 -4 1 -5 1", expectedOutput: "1", isExample: false },
      { input: "5\n0 0 0 0 0", expectedOutput: "0", isExample: false },
      { input: "6\n10 20 30 -5 10 20", expectedOutput: "3", isExample: false },
      { input: "3\n1 2 3", expectedOutput: "3", isExample: false },
      { input: "1\n100", expectedOutput: "1", isExample: false },
      { input: "1\n-100", expectedOutput: "0", isExample: false },
      { input: "12\n1 2 -1 3 4 5 -2 6 7 8 9 -3", expectedOutput: "4", isExample: false },
      { input: "2\n-1 1", expectedOutput: "1", isExample: false },
      { input: "2\n1 -1", expectedOutput: "1", isExample: false },
    ],
  },
  {
    source: 'exam',
    moduleId: 2,
    description: `Di sebuah planet fiksi, hidup makhluk bernama "Py-Amoeba". Setiap tahun, populasinya berubah. Jika populasi saat ini (P) adalah bilangan genap, tahun depan populasinya menjadi P/2. Jika ganjil, populasinya menjadi 3*P + 1.\nProses ini berhenti ketika populasi mencapai 1. Buatlah program yang menerima populasi awal (sebuah integer > 1) dan mencetak berapa tahun yang dibutuhkan hingga populasi mencapai 1.`,
    bannedFunctions: [],
    testCases: [
      { input: "6", expectedOutput: "8", isExample: true },
      { input: "13", expectedOutput: "9", isExample: true },
      { input: "7", expectedOutput: "16", isExample: true },
      { input: "2", expectedOutput: "1", isExample: false },
      { input: "3", expectedOutput: "7", isExample: false },
      { input: "4", expectedOutput: "2", isExample: false },
      { input: "5", expectedOutput: "5", isExample: false },
      { input: "8", expectedOutput: "3", isExample: false },
      { input: "9", expectedOutput: "19", isExample: false },
      { input: "10", expectedOutput: "6", isExample: false },
      { input: "16", expectedOutput: "4", isExample: false },
      { input: "27", expectedOutput: "111", isExample: false },
      { input: "1", expectedOutput: "0", isExample: false },
    ],
  },
  {
    source: 'exam',
    moduleId: 2,
    description: `Tuan Leo sedang merapikan database nama produk. Beberapa nama produk memiliki karakter '*' yang berlebihan dan harus dihapus. Aturannya adalah: setiap kali ada dua karakter '*' yang bersebelahan, keduanya harus dihapus. Proses ini diulang sampai tidak ada lagi '*' yang bersebelahan.\nContoh: "ab**c*d" menjadi "ac*d". "a***b" menjadi "a*b".\nBuatlah program yang menerima sebuah string dan mencetak versi bersih dari string tersebut.`,
    bannedFunctions: ["replace"],
    testCases: [
      { input: "py**th*on", expectedOutput: "pyth*on", isExample: true },
      { input: "a***b", expectedOutput: "a*b", isExample: true },
      { input: "ab****", expectedOutput: "ab", isExample: true },
      { input: "******", expectedOutput: "", isExample: false },
      { input: "he*l**l*o", expectedOutput: "he*ll*o", isExample: false },
      { input: "noasterisk", expectedOutput: "noasterisk", isExample: false },
      { input: "*", expectedOutput: "*", isExample: false },
      { input: "**", expectedOutput: "", isExample: false },
      { input: "a**b**c", expectedOutput: "abc", isExample: false },
      { input: "a*b*c*d", expectedOutput: "a*b*c*d", isExample: false },
      { input: "abc", expectedOutput: "abc", isExample: false },
      { input: "z****z", expectedOutput: "zz", isExample: false },
      { input: "a**b***c", expectedOutput: "ab*c", isExample: false },
    ],
  },
  // MODUL 3: FUNGSI & PROSEDUR
  {
    source: 'exam',
    moduleId: 3,
    description: `Seorang guru ingin menghitung nilai akhir mahasiswa. Buatlah dua subprogram:\n1. Sebuah **fungsi** bernama \`hitung_nilai_akhir\` yang menerima tiga nilai (UTS, UAS, Tugas) dan mengembalikan nilai akhir berdasarkan bobot: UTS 40%, UAS 40%, Tugas 20%.\n2. Sebuah **prosedur** bernama \`tentukan_indeks\` yang menerima nilai akhir (angka) dan mencetak indeks kelulusan: 'A' (>= 85), 'B' (>= 75), 'C' (>= 65), 'D' (< 65).\nProgram utama harus membaca 3 nilai, memanggil \`hitung_nilai_akhir\`, lalu memanggil \`tentukan_indeks\` dengan hasil dari fungsi pertama.`,
    bannedFunctions: [],
    testCases: [
      { input: "100\n100\n100", expectedOutput: "A", isExample: true },
      { input: "80\n70\n90", expectedOutput: "B", isExample: true },
      { input: "50\n60\n70", expectedOutput: "D", isExample: true },
      { input: "85\n85\n85", expectedOutput: "A", isExample: false },
      { input: "75\n75\n75", expectedOutput: "B", isExample: false },
      { input: "65\n65\n65", expectedOutput: "C", isExample: false },
      { input: "64\n64\n64", expectedOutput: "D", isExample: false },
      { input: "0\n0\n0", expectedOutput: "D", isExample: false },
      { input: "100\n80\n60", expectedOutput: "A", isExample: false },
      { input: "70\n80\n100", expectedOutput: "B", isExample: false },
      { input: "60\n60\n100", expectedOutput: "C", isExample: false },
      { input: "100\n50\n50", expectedOutput: "C", isExample: false },
      { input: "84.9\n84.9\n84.9", expectedOutput: "B", isExample: false },
    ],
  },
  {
    source: 'exam',
    moduleId: 3,
    description: `Nona Sal sedang membuat sistem validasi untuk username. Buatlah sebuah **fungsi** bernama \`is_username_valid\` yang menerima sebuah username (string) dan mengembalikan \`True\` jika valid, dan \`False\` jika tidak.\nAturan username yang valid:\n1. Panjangnya harus antara 5 hingga 15 karakter (inklusif).\n2. Hanya boleh terdiri dari huruf kecil (a-z), angka (0-9), dan underscore (_).\n3. Tidak boleh diawali atau diakhiri dengan underscore.\nProgram utama harus membaca sebuah username, memanggil fungsi \`is_username_valid\`, dan mencetak "VALID" atau "TIDAK VALID" berdasarkan hasilnya.`,
    bannedFunctions: [],
    testCases: [
      { input: "user_123", expectedOutput: "VALID", isExample: true },
      { input: "_user123", expectedOutput: "TIDAK VALID", isExample: true },
      { input: "user123_", expectedOutput: "TIDAK VALID", isExample: true },
      { input: "user", expectedOutput: "TIDAK VALID", isExample: false },
      { input: "user_name_is_too_long", expectedOutput: "TIDAK VALID", isExample: false },
      { input: "user-name", expectedOutput: "TIDAK VALID", isExample: false },
      { input: "UserNama", expectedOutput: "TIDAK VALID", isExample: false },
      { input: "valid", expectedOutput: "VALID", isExample: false },
      { input: "valid_username1", expectedOutput: "VALID", isExample: false },
      { input: "another_valid_2", expectedOutput: "VALID", isExample: false },
      { input: "12345", expectedOutput: "VALID", isExample: false },
      { input: "_____", expectedOutput: "TIDAK VALID", isExample: false },
      { input: "u___1", expectedOutput: "VALID", isExample: false },
    ],
  },
  {
    source: 'exam',
    moduleId: 3,
    description: `Tuan Leo ingin membuat sebuah program enkripsi sederhana. Buatlah sebuah **fungsi** bernama \`enkripsi_caesar\` yang menerima sebuah teks (string huruf kecil) dan sebuah angka pergeseran (integer). Fungsi ini harus mengembalikan teks yang telah dienkripsi dengan metode Caesar cipher (setiap huruf digeser sebanyak angka pergeseran, 'z' akan kembali ke 'a').\nProgram utama harus membaca sebuah teks dan angka pergeseran, memanggil fungsi, dan mencetak hasilnya. Karakter selain huruf kecil (spasi, angka, dll.) tidak berubah.`,
    bannedFunctions: ["ord", "chr"],
    testCases: [
      { input: "abc\n3", expectedOutput: "def", isExample: true },
      { input: "xyz\n2", expectedOutput: "zab", isExample: true },
      { input: "hello world\n5", expectedOutput: "mjqqt btwqi", isExample: true },
      { input: "python\n0", expectedOutput: "python", isExample: false },
      { input: "zebra\n1", expectedOutput: "afcsb", isExample: false },
      { input: "a\n25", expectedOutput: "z", isExample: false },
      { input: "a\n26", expectedOutput: "a", isExample: false },
      { input: "the quick brown fox jumps over the lazy dog\n3", expectedOutput: "wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj", isExample: false },
      { input: "test 123!\n10", expectedOutput: "docd 123!", isExample: false },
      { input: "z\n1", expectedOutput: "a", isExample: false },
      { input: "middle-out\n2", expectedOutput: "okffng-qwv", isExample: false },
      { input: "a b c\n1", expectedOutput: "b c d", isExample: false },
      { input: "komputasional\n7", expectedOutput: "rvtwbalhzvuhs", isExample: false },
    ],
  },
];

const seedDatabase = async () => {
  const dbURI = process.env.DB_URI;
  if (!dbURI) {
    console.error('DB_URI tidak ditemukan di .env. Seeding dibatalkan.');
    process.exit(1);
  }

  try {
    await mongoose.connect(dbURI);
    console.log('Berhasil terhubung ke MongoDB untuk seeding...');

    // Hapus semua soal ujian yang sudah ada untuk menghindari duplikasi
    const deleteResult = await Problem.deleteMany({ source: 'exam' });
    console.log(`Berhasil menghapus ${deleteResult.deletedCount} soal ujian lama.`);

    // Masukkan soal-soal baru
    const insertResult = await Problem.insertMany(examProblems);
    console.log(`Berhasil memasukkan ${insertResult.length} soal ujian baru ke database.`);

  } catch (error) {
    console.error('Gagal melakukan seeding database:', error);
  } finally {
    // Tutup koneksi setelah selesai
    await mongoose.disconnect();
    console.log('Koneksi ke MongoDB ditutup.');
  }
};

// Jalankan fungsi seeding
seedDatabase();

