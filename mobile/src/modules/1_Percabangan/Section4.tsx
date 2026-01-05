import React from 'react';
import { View } from 'react-native';
import { H1, P, H3, CodeBlock, Strong } from '../../components/ModuleContent/UIHelpers';

const Section4 = () => {
  return (
    <View>
      <H1>Operator Logika</H1>
      <P>Kita bisa menggabungkan kondisi menggunakan: <Strong>and</Strong>, <Strong>or</Strong>, dan <Strong>not</Strong>.</P>

      <H3>Operator and</H3>
      <P>True jika <Strong>kedua</Strong> kondisi bernilai True.</P>
      <CodeBlock>{`if punya_tiket and umur >= 18:
    print("Silakan masuk.")`}</CodeBlock>

      <H3>Operator or</H3>
      <P>True jika <Strong>salah satu</Strong> kondisi bernilai True.</P>
      <CodeBlock>{`if hari == "Sabtu" or hari == "Minggu":
    print("Hari libur!")`}</CodeBlock>

      <H3>Operator not</H3>
      <P>Membalik nilai Boolean.</P>
      <CodeBlock>{`hujan = False
if not hujan:
    print("Ayo pergi keluar!")`}</CodeBlock>
    </View>
  );
};

export default Section4;
