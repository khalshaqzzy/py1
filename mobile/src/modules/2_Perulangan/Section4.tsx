import React from 'react';
import { View } from 'react-native';
import { H1, P, H3, CodeBlock, Strong } from '../../components/ModuleContent/UIHelpers';

const Section4 = () => {
  return (
    <View>
      <H1>Break dan Continue</H1>
      <P>Python menyediakan cara untuk mengontrol alur di dalam loop secara paksa.</P>

      <H3>Pernyataan Break</H3>
      <P>Menghentikan paksa dan keluar dari loop.</P>
      <CodeBlock>{`for i in range(1, 20):
    if i % 7 == 0:
        print(f"Ditemukan: {i}")
        break`}</CodeBlock>

      <H3>Pernyataan Continue</H3>
      <P>Melewatkan sisa kode pada iterasi saat ini dan lanjut ke iterasi berikutnya.</P>
      <CodeBlock>{`for i in range(1, 6):
    if i == 3:
        continue
    print(i) # Output: 1, 2, 4, 5`}</CodeBlock>
    </View>
  );
};

export default Section4;
