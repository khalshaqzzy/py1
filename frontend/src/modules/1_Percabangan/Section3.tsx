
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
      <H1>Struktur Dasar: `if`, `elif`, dan `else`</H1>
      <P>Sekarang mari kita gabungkan operator perbandingan dengan struktur percabangan.</P>

      <H3>1. Pernyataan `if`</H3>
      <P>Blok kode di dalam `if` hanya akan dieksekusi jika kondisi bernilai `True`.</P>
      <CodeBlock>
        {
`umur = 20

if umur >= 18:
    print("Anda adalah seorang dewasa.") # Pesan ini akan tercetak

if umur < 18:
    print("Anda masih di bawah umur.") # Pesan ini TIDAK akan tercetak`
        }
      </CodeBlock>

      <H3>2. Pernyataan `else`</H3>
      <P>`else` adalah blok "penampung". Kodenya akan dieksekusi jika kondisi `if` sebelumnya bernilai `False`.</P>
      <CodeBlock>
        {
`hari_ini = "Minggu"

if hari_ini == "Sabtu":
    print("Selamat berakhir pekan!")
else:
    print("Hari ini bukan Sabtu.") # Pesan ini yang akan tercetak`
        }
      </CodeBlock>

      <H3>3. Pernyataan `elif` (Else If)</H3>
      <P>Bagaimana jika ada lebih dari dua kemungkinan? Di sinilah `elif` berguna. Anda bisa memiliki `elif` sebanyak yang Anda butuhkan.</P>
      <CodeBlock>
        {
`nilai = 78

if nilai >= 85:
    print("Indeks: A")
elif nilai >= 75: # Kondisi ini (78 >= 75) akan dievaluasi karena if pertama False
    print("Indeks: B") # Kode ini akan dieksekusi dan pengecekan berhenti
elif nilai >= 65:
    print("Indeks: C")
else:
    print("Indeks: D")`
        }
      </CodeBlock>
      <P>
        <Strong>Penting:</Strong> Dalam satu rangkaian `if-elif-else`, hanya <Strong>satu blok kode</Strong> yang akan dieksekusi, yaitu blok pertama yang kondisinya terpenuhi.
      </P>
    </article>
  );
};

export default Section3;
