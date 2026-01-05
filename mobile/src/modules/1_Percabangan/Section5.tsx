import React from 'react';
import { View } from 'react-native';
import { H1, P, H3, CodeBlock, Strong } from '../../components/ModuleContent/UIHelpers';

const Section5 = () => {
  return (
    <View>
      <H1>Percabangan Bersarang (Nested)</H1>
      <P>Anda dapat meletakkan struktur <Strong>if</Strong> di dalam <Strong>if</Strong> lainnya.</P>

      <H3>Contoh Kasus</H3>
      <CodeBlock>{`status_member = "Gold"
total_belanja = 600000

if status_member == "Gold":
    if total_belanja > 500000:
        print("Diskon tambahan 10%!")
    else:
        print("Belanja lagi untuk diskon.")`}</CodeBlock>

      <P>Gunakan nesting untuk alur keputusan bertingkat, namun hati-hati agar kode tidak sulit dibaca.</P>
    </View>
  );
};

export default Section5;
