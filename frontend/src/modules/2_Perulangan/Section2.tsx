
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
      <H1>`for` Loop: Iterasi Atas Urutan (Sequence)</H1>
      <P>
        Loop `for` digunakan ketika Anda memiliki sebuah "urutan" (seperti list, string, atau range angka) dan ingin melakukan sesuatu untuk <Strong>setiap elemen</Strong> di dalam urutan tersebut.
      </P>

      <H3>Sintaks Dasar</H3>
      <CodeBlock>{
`for nama_variabel in urutan:
    # Blok kode yang akan diulang
    # 'nama_variabel' akan berisi elemen yang sedang diproses`
      }</CodeBlock>

      <H3>Contoh 1: Iterasi List</H3>
      <CodeBlock>{
`daftar_buah = ["apel", "pisang", "ceri"]

for buah in daftar_buah:
    print(f"Saya suka makan {buah}")

# Output:
# Saya suka makan apel
# Saya suka makan pisang
# Saya suka makan ceri`
      }</CodeBlock>

      <H3>Contoh 2: Menggunakan `range()`</H3>
      <P>
        Fungsi `range()` sangat berguna untuk menghasilkan urutan angka. `range(5)` akan menghasilkan angka dari 0 hingga 4.
      </P>
      <CodeBlock>{
`# Melakukan aksi sebanyak 5 kali
for i in range(5):
    print(f"Ini adalah perulangan ke-{i+1}")

# Output:
# Ini adalah perulangan ke-1
# Ini adalah perulangan ke-2
# ... sampai ke-5`
      }</CodeBlock>
      <P>
        Loop `for` sangat ideal ketika Anda tahu persis berapa kali Anda perlu mengulang sebuah proses.
      </P>
    </article>
  );
};

export default Section2;
