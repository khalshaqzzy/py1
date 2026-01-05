import React from 'react';
import { View } from 'react-native';
import { H1, P, Strong, CodeBlock, H3 } from '../../components/ModuleContent/UIHelpers';

const Section2 = () => {
  return (
    <View>
      <H1>Operator Perbandingan</H1>
      <P>
        Kondisi dalam pemrograman dievaluasi menjadi salah satu dari dua nilai: <Strong>Benar</Strong> (`True`) atau <Strong>Salah</Strong> (`False`). Tipe data ini disebut <Strong>Boolean</Strong>.
      </P>
      <P>Operator perbandingan utama di Python:</P>
      <Li>== (Sama dengan)</Li>
      <Li>!= (Tidak sama dengan)</Li>
      <Li>{`>`} (Lebih besar dari)</Li>
      <Li>{`<`} (Lebih kecil dari)</Li>
      <Li>{`>=`} (Lebih besar atau sama dengan)</Li>
      <Li>{`<=`} (Lebih kecil atau sama dengan)</Li>
      
      <H3>Contoh dalam Kode</H3>
      <CodeBlock>{`nilai_ujian = 85
lulus = nilai_ujian >= 70
print(f"Apakah lulus? {lulus}")`}
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
