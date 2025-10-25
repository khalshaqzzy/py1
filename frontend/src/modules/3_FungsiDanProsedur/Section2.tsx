
import React from 'react';

// Helper components
const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <pre className="bg-[#1E1E1E] border border-[#333333] rounded-lg p-4 my-4 text-sm text-white overflow-x-auto">
    <code>{children}</code>
  </pre>
);
const H1: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-3xl font-bold text-white mb-6">{children}</h1>;
const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => <h3 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h3>;
const P: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-[#EAEAEA] mb-4 leading-relaxed">{children}</p>;
const Strong: React.FC<{ children: React.ReactNode }> = ({ children }) => <strong className="font-semibold text-white">{children}</strong>;

const Section2 = () => {
  return (
    <article>
      <H1>Mendefinisikan dan Memanggil Fungsi</H1>
      <P>
        Di Python, kita menggunakan kata kunci `def` untuk mendefinisikan sebuah fungsi.
      </P>

      <H3>Sintaks Dasar</H3>
      <CodeBlock>{
`def nama_fungsi(parameter1, parameter2):
    # Blok kode yang dieksekusi oleh fungsi
    # ...
    return nilai_kembalian # Opsional`
      }</CodeBlock>
      <ul className="list-disc list-inside text-[#EAEAEA] mb-4 pl-4">
        <li><Strong>Parameter:</Strong> Variabel yang diterima oleh fungsi sebagai input.</li>
        <li><Strong>Return:</Strong> Nilai yang dikembalikan oleh fungsi setelah selesai dieksekusi.</li>
      </ul>

      <H3>Contoh: Fungsi Penjumlahan</H3>
      <CodeBlock>{
`# Mendefinisikan fungsi
def jumlahkan(angka1, angka2):
    hasil = angka1 + angka2
    return hasil

# Memanggil fungsi dan menyimpan hasilnya
hasil_penjumlahan = jumlahkan(10, 5) # 10 dan 5 adalah argumen

print(f"Hasilnya adalah: {hasil_penjumlahan}") # Output: Hasilnya adalah: 15`
      }</CodeBlock>

      <H3>Fungsi vs. Prosedur</H3>
      <P>
        Secara teknis, Python tidak membedakan keduanya. Namun secara konsep:
      </P>
      <ul className="list-disc list-inside text-[#EAEAEA] mb-4 pl-4">
        <li><Strong>Fungsi:</Strong> Sebuah subprogram yang <Strong>mengembalikan sebuah nilai</Strong> menggunakan `return`. Tujuannya adalah untuk melakukan perhitungan dan memberikan hasil.</li>
        <li><Strong>Prosedur:</Strong> Sebuah subprogram yang <Strong>tidak mengembalikan nilai</Strong>. Tujuannya adalah untuk melakukan serangkaian aksi, seperti mencetak sesuatu ke layar.</li>
      </ul>
      <CodeBlock>{
`# Ini adalah sebuah prosedur karena tidak ada 'return'
def sapa(nama):
    print(f"Halo, {nama}! Selamat datang.")

# Memanggil prosedur
sapa("Andi") # Output: Halo, Andi! Selamat datang.`
      }</CodeBlock>
    </article>
  );
};

export default Section2;
