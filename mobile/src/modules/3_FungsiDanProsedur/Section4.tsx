import React from 'react';
import { View } from 'react-native';
import { H1, P, H3, CodeBlock, Strong } from '../../components/ModuleContent/UIHelpers';

const Section4 = () => {
  return (
    <View>
      <H1>Variable Scope</H1>
      <P>Menentukan di mana sebuah variabel dapat diakses.</P>

      <H3>Global vs Lokal</H3>
      <P><Strong>Global:</Strong> Didefinisikan di luar fungsi, bisa diakses di mana saja.</P>
      <P><Strong>Lokal:</Strong> Didefinisikan di dalam fungsi, hanya dikenal di fungsi tersebut.</P>

      <CodeBlock>{`x = 10 # Global

def fungsi():
    y = 5 # Lokal
    print(x) # Bisa baca x

fungsi()
# print(y) # Error! y tidak dikenal di luar`}</CodeBlock>
    </View>
  );
};

export default Section4;
