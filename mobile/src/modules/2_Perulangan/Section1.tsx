import React from 'react';
import { View } from 'react-native';
import { H1, P, Strong, Li } from '../../components/ModuleContent/UIHelpers';

const Section1 = () => {
  return (
    <View>
      <H1>Konsep Dasar Perulangan</H1>
      <P>
        Bayangkan Anda harus mencetak "Hello, World!" sebanyak 100 kali. Menulisnya manual sangat tidak efisien.
      </P>
      <P>
        Di sinilah <Strong>perulangan</Strong> (atau <Strong>looping</Strong>) berperan. Perulangan adalah instruksi untuk mengeksekusi blok kode secara berulang-ulang sampai kondisi berhenti terpenuhi.
      </P>
      <P>Tugas repetitif contohnya:</P>
      <Li>Memproses item dalam daftar belanja.</Li>
      <Li>Membaca setiap baris dari sebuah file.</Li>
      <Li>Menjalankan simulasi per detik.</Li>
      <P>
        Python menyediakan dua jenis perulangan utama: <Strong>`for` loop</Strong> dan <Strong>`while` loop</Strong>.
      </P>
    </View>
  );
};

export default Section1;
