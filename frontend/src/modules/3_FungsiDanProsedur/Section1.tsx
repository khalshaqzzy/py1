
import React from 'react';

// Helper components
const H1: React.FC<{ children: React.ReactNode }> = ({ children }) => <h1 className="text-3xl font-bold text-white mb-6">{children}</h1>;
const P: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-[#EAEAEA] mb-4 leading-relaxed">{children}</p>;
const Strong: React.FC<{ children: React.ReactNode }> = ({ children }) => <strong className="font-semibold text-white">{children}</strong>;
const Li: React.FC<{ children: React.ReactNode }> = ({ children }) => <li className="mb-2">{children}</li>;

const Section1 = () => {
  return (
    <article>
      <H1>DRY: Don't Repeat Yourself</H1>
      <P>
        Saat Anda menulis program, Anda akan sering menemukan bahwa Anda menulis baris-baris kode yang sama berulang kali di tempat yang berbeda. Ini tidak efisien dan menyulitkan perawatan kode.
      </P>
      <P>
        Prinsip <Strong>DRY (Don't Repeat Yourself)</Strong> adalah filosofi dasar dalam pengembangan perangkat lunak: "Setiap bagian dari pengetahuan harus memiliki satu representasi yang tidak ambigu dan otoritatif dalam suatu sistem."
      </P>
      <P>
        Di sinilah <Strong>fungsi</Strong> dan <Strong>prosedur</Strong> berperan. Keduanya adalah cara untuk membungkus blok kode, memberinya nama, dan memanggilnya kapan pun diperlukan. Ini membuat kode Anda:
      </P>
      <ul className="list-disc list-inside text-[#EAEAEA] mb-4 pl-4">
        <Li><Strong>Lebih Rapi:</Strong> Logika yang kompleks dibungkus dalam satu nama yang deskriptif.</Li>
        <Li><Strong>Lebih Mudah Dirawat:</Strong> Jika ada bug, Anda hanya perlu memperbaikinya di satu tempat.</Li>
        <Li><Strong>Dapat Digunakan Kembali (Reusable):</Strong> Fungsi yang sama dapat digunakan di berbagai bagian program Anda atau bahkan di proyek lain.</Li>
      </ul>
    </article>
  );
};

export default Section1;
