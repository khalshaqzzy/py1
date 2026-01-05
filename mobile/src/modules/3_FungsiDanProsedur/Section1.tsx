import React from 'react';
import { View } from 'react-native';
import { H1, P, Strong, Li } from '../../components/ModuleContent/UIHelpers';

const Section1 = () => {
  return (
    <View>
      <H1>DRY: Don't Repeat Yourself</H1>
      <P>
        Saat menulis program, Anda mungkin menulis kode yang sama berulang kali. Ini tidak efisien.
      </P>
      <P>
        Prinsip <Strong>DRY</Strong> adalah filosofi dasar: "Jangan mengulang hal yang sama."
      </P>
      <P>Fungsi dan prosedur membantu membungkus kode agar:</P>
      <Li><Strong>Lebih Rapi:</Strong> Logika kompleks dibungkus nama deskriptif.</Li>
      <Li><Strong>Mudah Dirawat:</Strong> Perbaikan cukup di satu tempat.</Li>
      <Li><Strong>Reusable:</Strong> Bisa digunakan di bagian mana saja.</Li>
    </View>
  );
};

export default Section1;
