
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
      <H1>Parameter dan Argumen</H1>
      <P>
        Seringkali istilah ini digunakan secara bergantian, tetapi ada perbedaan penting:
      </P>
      <ul className="list-disc list-inside text-[#EAEAEA] mb-4 pl-4">
        <li><Strong>Parameter:</Strong> Adalah variabel yang ada di dalam tanda kurung pada saat <Strong>definisi fungsi</Strong>. Ini adalah "placeholder" untuk nilai yang akan diterima fungsi.</li>
        <li><Strong>Argumen:</Strong> Adalah nilai aktual yang Anda berikan kepada fungsi pada saat <Strong>pemanggilan fungsi</Strong>.</li>
      </ul>
      <CodeBlock>{
`# 'nama' dan 'lokasi' adalah parameter
def perkenalkan(nama, lokasi):
  print(f"Nama saya {nama}, saya dari {lokasi}.")

# "Budi" dan "Bandung" adalah argumen
perkenalkan("Budi", "Bandung")`
      }</CodeBlock>

      <H3>Argumen Posisi vs. Argumen Kata Kunci (Keyword Argument)</H3>
      <P>
        <Strong>Argumen Posisi:</Strong> Argumen dipetakan ke parameter berdasarkan urutannya. `perkenalkan("Budi", "Bandung")` memetakan "Budi" ke `nama` dan "Bandung" ke `lokasi`.
      </P>
      <P>
        <Strong>Argumen Kata Kunci:</Strong> Anda secara eksplisit menyebutkan nama parameternya. Urutan tidak lagi penting.
      </P>
      <CodeBlock>{
`# Urutan tidak penting dengan keyword argument
perkenalkan(lokasi="Jakarta", nama="Citra")`
      }</CodeBlock>

      <H3>Nilai Parameter Default</H3>
      <P>
        Anda bisa memberikan nilai default pada parameter. Parameter ini menjadi opsional saat fungsi dipanggil.
      </P>
      <CodeBlock>{
`def sapa_pengguna(nama, ucapan="Selamat pagi"):
    print(f"{ucapan}, {nama}!")

sapa_pengguna("Doni") # Output: Selamat pagi, Doni!
sapa_pengguna("Eka", "Selamat malam") # Output: Selamat malam, Eka!`
      }</CodeBlock>
    </article>
  );
};

export default Section3;
