import React from 'react';
import { View } from 'react-native';
import { H1, P, H3, CodeBlock, Strong } from '../../components/ModuleContent/UIHelpers';

const Section3 = () => {
  return (
    <View>
      <H1>While Loop</H1>
      <P>Loop <Strong>while</Strong> akan terus berjalan selama sebuah kondisi bernilai <Strong>True</Strong>.</P>

      <H3>Contoh: Menghitung Mundur</H3>
      <CodeBlock>{`hitung = 5
while hitung > 0:
    print(hitung)
    hitung -= 1
print("Melesat!")`}</CodeBlock>

      <H3>Peringatan: Infinite Loop</H3>
      <P>Pastikan ada logika yang mengubah kondisi menjadi <Strong>False</Strong>, jika tidak program akan macet selamanya.</P>
    </View>
  );
};

export default Section3;
