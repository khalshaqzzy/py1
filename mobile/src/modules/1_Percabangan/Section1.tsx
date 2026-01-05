import React from 'react';
import { View } from 'react-native';
import { H1, P, Strong } from '../../components/ModuleContent/UIHelpers';

const Section1 = () => {
  return (
    <View>
      <H1>Pengantar Logika dan Kondisi</H1>
      <P>
        Dalam kehidupan sehari-hari, kita terus-menerus membuat keputusan berdasarkan kondisi tertentu. "<Strong>Jika</Strong> hari ini hujan, <Strong>maka</Strong> saya akan membawa payung." "<Strong>Jika</Strong> nilai saya di atas 80, <Strong>maka</Strong> saya mendapat nilai A."
      </P>
      <P>
        Konsep "jika-maka" ini adalah dasar dari <Strong>percabangan</Strong> dalam pemrograman. Percabangan memungkinkan program kita untuk tidak berjalan lurus begitu saja, tetapi bisa memilih jalur eksekusi yang berbeda tergantung pada kondisi yang terpenuhi. Ini membuat program kita menjadi "pintar" dan dinamis.
      </P>
      <P>
        Di Python, kita menggunakan `if`, `elif` (else if), dan `else` untuk membangun blok logika ini.
      </P>
    </View>
  );
};

export default Section1;
