
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
      <H1>Mengontrol Alur Loop: `break` dan `continue`</H1>
      <P>
        Python menyediakan dua pernyataan untuk mengontrol alur di dalam sebuah loop, bahkan sebelum loop tersebut selesai secara alami.
      </P>

      <H3>Pernyataan `break`</H3>
      <P>
        `break` digunakan untuk <Strong>menghentikan paksa</Strong> dan keluar dari loop saat itu juga, tanpa mempedulikan sisa iterasi.
      </P>
      <CodeBlock>{
`# Contoh: Mencari angka pertama yang habis dibagi 7
for i in range(1, 20):
    print(f"Mengecek angka {i}...")
    if i % 7 == 0:
        print(f"Ditemukan! Angka {i} habis dibagi 7.")
        break # Keluar dari loop sekarang juga

print("Pencarian selesai.")`
      }</CodeBlock>

      <H3>Pernyataan `continue`</H3>
      <P>
        `continue` digunakan untuk <Strong>melewatkan sisa blok kode</Strong> pada iterasi saat ini dan langsung loncat ke iterasi berikutnya.
      </P>
      <CodeBlock>{
`# Contoh: Hanya mencetak angka ganjil
for i in range(1, 11):
    if i % 2 == 0: # Jika angkanya genap
        continue   # Lewatkan sisa kode (print) dan lanjut ke iterasi berikutnya
    
    print(i) # Kode ini hanya akan dieksekusi untuk angka ganjil

# Output:
# 1
# 3
# 5
# 7
# 9`
      }</CodeBlock>
    </article>
  );
};

export default Section4;
