
import React from 'react';

// Helper components
const H1: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-3xl font-bold text-white mb-6">{children}</h1>;
const P: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-[#EAEAEA] mb-4 leading-relaxed">{children}</p>;
const Strong: React.FC<{ children: React.ReactNode }> = ({ children }) => <strong className="font-semibold text-white">{children}</strong>;
const Li: React.FC<{ children: React.ReactNode }> = ({ children }) => <li className="mb-2">{children}</li>;

const Section1 = () => {
  return (
    <article>
      <H1>Konsep Dasar Perulangan</H1>
      <P>
        Bayangkan Anda harus mencetak "Hello, World!" sebanyak 100 kali. Anda bisa saja menulis `print("Hello, World!")` seratus kali, tapi itu sangat tidak efisien.
      </P>
      <P>
        Di sinilah <Strong>perulangan</Strong> (atau <Strong>looping</Strong>) berperan. Perulangan adalah instruksi untuk mengeksekusi blok kode yang sama secara berulang-ulang sampai sebuah kondisi berhenti terpenuhi.
      </P>
      <P>
        Ini adalah salah satu konsep paling fundamental dalam pemrograman karena banyak sekali tugas yang bersifat repetitif, seperti:
      </P>
      <ul className="list-disc list-inside text-[#EAEAEA] mb-4 pl-4">
        <Li>Memproses setiap item dalam sebuah daftar belanja.</Li>
        <Li>Membaca setiap baris dari sebuah file.</Li>
        <Li>Menjalankan simulasi untuk setiap detik dalam satu menit.</Li>
      </ul>
      <P>
        Python menyediakan dua jenis perulangan utama: <Strong>`for` loop</Strong> dan <Strong>`while` loop</Strong>.
      </P>
    </article>
  );
};

export default Section1;
