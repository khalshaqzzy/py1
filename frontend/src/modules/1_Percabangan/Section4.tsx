
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

const Section4 = () => {
  return (
    <article>
      <H1>Menggabungkan Kondisi dengan Operator Logika</H1>
      <P>
        Terkadang, sebuah keputusan bergantung pada lebih dari satu kondisi. Kita bisa menggabungkannya menggunakan operator logika: <Strong>`and`</Strong>, <Strong>`or`</Strong>, dan <Strong>`not`</Strong>.
      </P>

      <H3>Operator `and`</H3>
      <P>Hasilnya `True` hanya jika <Strong>kedua</Strong> kondisi bernilai `True`.</P>
      <CodeBlock>{
`# Contoh: Boleh masuk jika punya tiket DAN sudah cukup umur
punya_tiket = True
umur = 22

if punya_tiket and umur >= 18:
    print("Silakan masuk.")
else:
    print("Tidak memenuhi syarat.")`
      }</CodeBlock>

      <H3>Operator `or`</H3>
      <P>Hasilnya `True` jika <Strong>salah satu</Strong> (atau kedua) kondisi bernilai `True`.</P>
      <CodeBlock>{
`# Contoh: Libur jika hari Sabtu ATAU hari Minggu
hari = "Minggu"

if hari == "Sabtu" or hari == "Minggu":
    print("Hari libur, waktunya istirahat!")
else:
    print("Hari kerja.")`
      }</CodeBlock>

      <H3>Operator `not`</H3>
      <P>Operator ini membalik nilai Boolean. `not True` menjadi `False`, dan `not False` menjadi `True`.</P>
      <CodeBlock>{
`# Contoh: Lakukan sesuatu jika TIDAK hujan
hujan = False

if not hujan:
    print("Ayo pergi keluar!")`
      }</CodeBlock>
    </article>
  );
};

export default Section4;
