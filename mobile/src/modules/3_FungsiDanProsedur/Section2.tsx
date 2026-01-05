import React from 'react';
import { View } from 'react-native';
import { H1, P, H3, CodeBlock, Strong } from '../../components/ModuleContent/UIHelpers';

const Section2 = () => {
  return (
    <View>
      <H1>Mendefinisikan Fungsi</H1>
      <P>Gunakan kata kunci <Strong>def</Strong> untuk membuat fungsi baru.</P>

      <H3>Sintaks Dasar</H3>
      <CodeBlock>{`def sapa(nama):
    print(f"Halo, {nama}!")`}</CodeBlock>

      <H3>Fungsi vs Prosedur</H3>
      <Li><Strong>Fungsi:</Strong> Mengembalikan nilai menggunakan <Strong>return</Strong>.</Li>
      <Li><Strong>Prosedur:</Strong> Hanya melakukan aksi (misal print) tanpa return.</Li>
      
      <CodeBlock>{`def jumlahkan(a, b):
    return a + b # Ini fungsi`}
      </CodeBlock>
    </View>
  );
};

const Li: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View className="flex-row mb-2 pl-2">
    <P><Strong>•</Strong> {children}</P>
  </View>
);

export default Section2;
