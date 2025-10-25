
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

const Section5 = () => {
  return (
    <article>
      <H1>Percabangan Bersarang (Nested Conditionals)</H1>
      <P>
        Anda dapat meletakkan satu struktur `if` di dalam struktur `if` lainnya. Ini disebut <Strong>nested conditionals</Strong> atau percabangan bersarang.
      </P>
      <P>
        Ini berguna untuk memeriksa kondisi yang lebih spesifik setelah kondisi umum terpenuhi.
      </P>

      <H3>Contoh Kasus</H3>
      <P>
        Sebuah toko memberikan diskon tambahan jika pelanggan adalah member dan berbelanja di atas nominal tertentu.
      </P>
      <CodeBlock>{`
status_member = "Gold"
total_belanja = 600000

if status_member == "Gold":
    print("Pelanggan Gold, memeriksa diskon tambahan...")
    
    # Ini adalah percabangan bersarang
    if total_belanja > 500000:
        print("Selamat! Anda mendapat diskon tambahan 10%.")
    else:
        print("Belanja lebih banyak untuk mendapat diskon tambahan.")

elif status_member == "Silver":
    print("Terima kasih telah menjadi member Silver.")
else:
    print("Daftar member untuk keuntungan lebih!")`
      }</CodeBlock>

      <H3>Kapan Menggunakannya?</H3>
      <P>
        Gunakan percabangan bersarang ketika ada alur keputusan yang bertingkat. Namun, hati-hati! Terlalu banyak tingkatan "nesting" dapat membuat kode sulit dibaca. Terkadang, menggunakan operator `and` bisa menjadi alternatif yang lebih bersih.
      </P>
      <P>
        <Strong>Alternatif untuk contoh di atas:</Strong>
      </P>
      <CodeBlock>{`
if status_member == "Gold" and total_belanja > 500000:
    print("Pelanggan Gold dengan diskon tambahan 10%.")`
      }</CodeBlock>
      <P>
        Pilihan antara nesting dan operator logika sering kali bergantung pada keterbacaan dan alur logika yang ingin Anda sampaikan.
      </P>
    </article>
  );
};

export default Section5;
