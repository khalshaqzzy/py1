
import React from 'react';

// Helper components (can be moved to a shared file later)
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
      <H1>Operator Perbandingan dan Tipe Data Boolean</H1>
      <P>
        Sebelum menulis `if`, kita perlu tahu cara membuat "kondisi". Kondisi dalam pemrograman dievaluasi menjadi salah satu dari dua nilai: <Strong>Benar</Strong> (`True`) atau <Strong>Salah</Strong> (`False`). Tipe data yang hanya memiliki dua nilai ini disebut <Strong>Boolean</Strong>.
      </P>
      <P>Untuk membuat ekspresi Boolean, kita menggunakan operator perbandingan:</P>
      <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead className="border-b border-[#333333]"><tr className="text-[#888888]"><th className="p-2">Operator</th><th className="p-2">Arti</th><th className="p-2">Contoh</th><th className="p-2">Hasil</th></tr></thead><tbody className="text-white"><tr className="border-b border-[#333333]"><td className="p-2 font-mono">==</td><td className="p-2">Sama dengan</td><td className="p-2 font-mono">5 == 5</td><td className="p-2 font-mono">True</td></tr><tr className="border-b border-[#333333]"><td className="p-2 font-mono">!=</td><td className="p-2">Tidak sama dengan</td><td className="p-2 font-mono">5 != 5</td><td className="p-2 font-mono">False</td></tr><tr className="border-b border-[#333333]"><td className="p-2 font-mono">{`>`}</td><td className="p-2">Lebih besar dari</td><td className="p-2 font-mono">10 {`>`} 5</td><td className="p-2 font-mono">True</td></tr><tr className="border-b border-[#333333]"><td className="p-2 font-mono">{`<`}</td><td className="p-2">Lebih kecil dari</td><td className="p-2 font-mono">10 {`<`} 5</td><td className="p-2 font-mono">False</td></tr><tr className="border-b border-[#333333]"><td className="p-2 font-mono">{`>=`}</td><td className="p-2">Lebih besar atau sama dengan</td><td className="p-2 font-mono">10 {`>=`} 10</td><td className="p-2 font-mono">True</td></tr><tr><td className="p-2 font-mono">{`<=`}</td><td className="p-2">Lebih kecil atau sama dengan</td><td className="p-2 font-mono">10 {`<=`} 5</td><td className="p-2 font-mono">False</td></tr></tbody></table></div>
      <H3>Contoh dalam Kode</H3>
      <P>Anda bisa mencoba ini langsung di Python untuk melihat hasilnya.</P>
      <CodeBlock>{`
nilai_ujian = 85
lulus = nilai_ujian >= 70 # Kondisi ini akan menghasilkan True

print(f"Apakah siswa lulus? {lulus}")

suhu_ruangan = 25
terlalu_dingin = suhu_ruangan < 20 # Kondisi ini akan menghasilkan False

print(f"Apakah ruangan terlalu dingin? {terlalu_dingin}")`
      }</CodeBlock>
    </article>
  );
};

export default Section2;
