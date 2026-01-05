import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export const H1: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text className="text-3xl font-bold text-white mb-6 mt-4">{children}</Text>
);

export const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text className="text-xl font-semibold text-white mt-6 mb-3">{children}</Text>
);

export const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text className="text-[#EAEAEA] text-base mb-4 leading-6">{children}</Text>
);

export const Strong: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text className="font-bold text-white">{children}</Text>
);

export const Li: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View className="flex-row mb-2 pl-2">
    <Text className="text-[#EAEAEA] mr-2">•</Text>
    <Text className="text-[#EAEAEA] flex-1 text-base leading-6">{children}</Text>
  </View>
);

export const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View className="bg-[#1E1E1E] border border-[#333333] rounded-xl p-4 my-4">
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <Text className="text-sm text-white font-mono">{children}</Text>
    </ScrollView>
  </View>
);
