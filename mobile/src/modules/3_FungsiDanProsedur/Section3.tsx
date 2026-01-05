import React from 'react';
import { View } from 'react-native';
import { H1, P, H3, CodeBlock, Strong } from '../../components/ModuleContent/UIHelpers';

const Section3 = () => {
  return (
    <View>
      <H1>Parameter dan Argumen</H1>
      <P><Strong>Parameter</Strong> adalah placeholder dalam definisi, <Strong>Argumen</Strong> adalah nilai aktual saat dipanggil.</P>

      <H3>Keyword Argument</H3>
      <P>Menyebutkan nama parameter agar urutan tidak masalah.</P>
      <CodeBlock>{`def sapa(nama, lokasi):
    print(f"{nama} dari {lokasi}")

sapa(lokasi="Bandung", nama="Budi")`}</CodeBlock>

      <H3>Default Parameter</H3>
      <CodeBlock>{`def sapa(nama="User"):
    print(f"Halo, {nama}")

sapa() # Output: Halo, User`}</CodeBlock>
    </View>
  );
};

export default Section3;
