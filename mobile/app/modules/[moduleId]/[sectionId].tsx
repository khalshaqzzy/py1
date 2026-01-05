import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getModule } from '../../../src/modules';
import { useModuleStore } from '../../../src/stores/moduleStore';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

export default function ModuleContentScreen() {
  const { moduleId, sectionId } = useLocalSearchParams<{ moduleId: string; sectionId: string }>();
  const router = useRouter();
  const { updateProgress } = useModuleStore();

  const module = getModule(moduleId || '');
  const sectionIndex = module?.sections.findIndex((s: any) => s.id === sectionId) ?? -1;
  const section = sectionIndex !== -1 ? module?.sections[sectionIndex] : undefined;

  useEffect(() => {
    if (module && section && moduleId && sectionId) {
      updateProgress(moduleId, sectionId, module.sections.length);
    }
  }, [moduleId, sectionId]);

  if (!module || !section) {
    return (
      <View className="flex-1 bg-[#121212] items-center justify-center p-6">
        <Text className="text-gray-400">Content not found.</Text>
      </View>
    );
  }

  const prevSection = sectionIndex > 0 ? module.sections[sectionIndex - 1] : null;
  const nextSection = sectionIndex < module.sections.length - 1 ? module.sections[sectionIndex + 1] : null;
  const ContentComponent = section.component;

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="mb-4">
          <Text className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-1">
            Section {sectionIndex + 1} of {module.sections.length}
          </Text>
          <Text className="text-white text-2xl font-bold">{section.title}</Text>
        </View>

        <View className="mb-20">
          <ContentComponent />
        </View>
      </ScrollView>

      {/* Persistent Bottom Navigation */}
      <View className="bg-[#1E1E1E] border-t border-[#333333] px-6 py-4 flex-row justify-between items-center">
        {prevSection ? (
          <TouchableOpacity 
            onPress={() => router.replace(`/modules/${moduleId}/${prevSection.id}`)}
            className="flex-row items-center gap-2"
          >
            <ChevronLeft size={20} color="#888" />
            <Text className="text-gray-400 font-semibold">Prev</Text>
          </TouchableOpacity>
        ) : <View />}

        {nextSection ? (
          <TouchableOpacity 
            onPress={() => router.replace(`/modules/${moduleId}/${nextSection.id}`)}
            className="bg-white px-6 py-3 rounded-xl flex-row items-center gap-2"
          >
            <Text className="text-[#121212] font-bold">Next</Text>
            <ChevronRight size={20} color="#121212" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={() => router.replace('/(tabs)/modules')}
            className="bg-green-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-bold">Finish Module</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
