import React from 'react';
import { View } from 'react-native';
import { H1, P, Strong, CodeBlock, H3 } from '../../components/ModuleContent/UIHelpers';

const Section2 = () => {
  return (
    <View>
      <H1>`for` Loop: Iterasi Atas Urutan</H1>
      <P>
        Loop `for` digunakan untuk melakukan sesuatu pada <Strong>setiap elemen</Strong> dalam sebuah urutan (list, string, atau range).
      </P>

      <H3>Sintaks Dasar</H3>
      <CodeBlock>{`for variabel in urutan:
    # Blok kode yang akan diulang`}</CodeBlock>

      <H3>Contoh: Menggunakan `range()`</H3>
      <P>
        `range(5)` menghasilkan urutan angka dari 0 hingga 4.
      </P>
      <CodeBlock>{`for i in range(5):
    print(f"Iterasi ke-{i+1}")`}
      </CodeBlock>
    </View>
  );
};

export default Section2;
