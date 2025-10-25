
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

const Section4 = () => {
  return (
    <article>
      <H1>Lingkup Variabel (Variable Scope)</H1>
      <P>
        Scope menentukan di mana saja sebuah variabel dapat diakses dalam program.
      </P>

      <H3>Variabel Global</H3>
      <P>
        Variabel yang didefinisikan di luar semua fungsi. Variabel ini dapat diakses dari mana saja, termasuk di dalam fungsi.
      </P>
      <CodeBlock>{
`nama_aplikasi = "Py1 Platform" # Variabel global

def tampilkan_info():
    # Bisa membaca variabel global
    print(f"Selamat datang di {nama_aplikasi}")

tampilkan_info()`
      }</CodeBlock>

      <H3>Variabel Lokal</H3>
      <P>
        Variabel yang didefinisikan di dalam sebuah fungsi. Variabel ini <strong className="font-semibold text-white">hanya</strong> dapat diakses dari dalam fungsi tersebut. Ia akan dibuat saat fungsi dipanggil dan akan "hilang" saat fungsi selesai.
      </P>
      <CodeBlock>{
`def hitung_luas(panjang, lebar):
    luas = panjang * lebar # 'luas' adalah variabel lokal
    return luas

hasil = hitung_luas(10, 5)
print(hasil) # Ini berhasil

# print(luas) # Ini akan menyebabkan Error! Variabel 'luas' tidak dikenal di luar fungsi.`
      }</CodeBlock>
      <P>
        Menggunakan variabel lokal sangat dianjurkan karena mencegah efek samping yang tidak diinginkan di mana satu bagian program secara tidak sengaja mengubah variabel yang digunakan oleh bagian lain.
      </P>
    </article>
  );
};

export default Section4;
