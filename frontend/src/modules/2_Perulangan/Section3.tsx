
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

const Section3 = () => {
  return (
    <article>
      <H1>`while` Loop: Iterasi Berbasis Kondisi</H1>
      <P>
        Berbeda dengan `for` loop, `while` loop akan terus berjalan <Strong>selama</Strong> (while) sebuah kondisi bernilai `True`. Anda tidak perlu tahu berapa kali perulangan akan terjadi, yang penting adalah kondisi berhenti.
      </P>

      <H3>Sintaks Dasar</H3>
      <CodeBlock>{
`while kondisi:
    # Blok kode yang akan diulang
    # Penting: Harus ada sesuatu di sini yang bisa membuat kondisi menjadi False!`
      }</CodeBlock>

      <H3>Contoh: Menghitung Mundur</H3>
      <CodeBlock>{
`hitung_mundur = 5

while hitung_mundur > 0:
    print(hitung_mundur)
    hitung_mundur = hitung_mundur - 1 # Atau bisa ditulis: hitung_mundur -= 1

print("Melesat!")

# Output:
# 5
# 4
# 3
# 2
# 1
# Melesat!`
      }</CodeBlock>

      <H3>Peringatan: Perulangan Tak Terhingga (Infinite Loop)</H3>
      <P>
        Bahaya terbesar dari `while` loop adalah jika Anda lupa menyertakan logika yang membuat kondisinya bisa berhenti. Ini akan menciptakan <Strong>infinite loop</Strong> yang membuat program Anda "macet".
      </P>
      <CodeBlock>{
`# JANGAN DILAKUKAN: Contoh Infinite Loop
angka = 1

while angka > 0: # Kondisi ini akan selalu True
    print("Ini akan berjalan selamanya!")
    # Tidak ada yang mengubah nilai 'angka' menjadi <= 0`
      }</CodeBlock>
    </article>
  );
};

export default Section3;
