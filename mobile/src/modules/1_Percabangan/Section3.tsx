import React from 'react';
import { View } from 'react-native';
import { H1, P, H3, CodeBlock, Strong } from '../../components/ModuleContent/UIHelpers';

const Section3 = () => {
  return (
    <View>
      <H1>Struktur Dasar: if, elif, dan else</H1>
      <P>Sekarang mari kita gabungkan operator perbandingan dengan struktur percabangan.</P>

      <H3>1. Pernyataan if</H3>
      <CodeBlock>{`umur = 20
if umur >= 18:
    print("Anda adalah seorang dewasa.")`}</CodeBlock>

      <H3>2. Pernyataan else</H3>
      <P>Kodenya akan dieksekusi jika kondisi if sebelumnya bernilai <Strong>False</Strong>.</P>
      <CodeBlock>{`hari = "Minggu"
if hari == "Sabtu":
    print("Selamat berakhir pekan!")
else:
    print("Hari ini bukan Sabtu.")`}</CodeBlock>

      <H3>3. Pernyataan elif</H3>
      <P>Digunakan jika ada lebih dari dua kemungkinan.</P>
      <CodeBlock>{`nilai = 78
if nilai >= 85:
    print("Indeks: A")
elif nilai >= 75:
    print("Indeks: B")
else:
    print("Indeks: D")`}</CodeBlock>
    </View>
  );
};

export default Section3;
