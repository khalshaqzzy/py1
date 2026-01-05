import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useModuleStore } from '../../src/stores/moduleStore';
import { allModules } from '../../src/modules';
import { ChevronRight, CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ModulesScreen() {
  const router = useRouter();
  const { progress } = useModuleStore();

  return (
    <ScrollView className="flex-1 bg-[#121212]" contentContainerStyle={{ padding: 20 }}>
      <Text className="text-white text-3xl font-bold mb-8">Learning Modules</Text>

      <View className="space-y-6">
        {allModules.map((module) => {
          const moduleProgressData = progress.find(p => p.moduleId === module.id);
          const moduleProgress = moduleProgressData?.progress || 0;

          return (
            <View key={module.id} className="bg-[#1E1E1E] border border-[#333333] rounded-3xl overflow-hidden mb-6">
              <View className="p-6">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1">
                    <Text className="text-white text-2xl font-bold mb-2">{module.title}</Text>
                    <Text className="text-gray-400 text-base leading-5">{module.description}</Text>
                  </View>
                  {moduleProgress === 100 && (
                    <CheckCircle size={28} color="#4ADE80" />
                  )}
                </View>

                {/* Progress Bar */}
                <View className="mb-6">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-500 font-semibold">Progres Belajar</Text>
                    <Text className="text-white font-bold">{moduleProgress}%</Text>
                  </View>
                  <View className="w-full bg-[#121212] rounded-full h-3">
                    <View 
                      className="bg-white h-3 rounded-full" 
                      style={{ width: `${moduleProgress}%` }} 
                    />
                  </View>
                </View>

                {/* Sections List */}
                <View className="mb-6 space-y-3">
                  {module.sections.map((section) => {
                    const isCompleted = moduleProgressData?.completedSections.includes(section.id);
                    return (
                      <TouchableOpacity
                        key={section.id}
                        onPress={() => router.push(`/modules/${module.id}/${section.id}`)}
                        className="flex-row items-center justify-between p-4 bg-[#121212] rounded-2xl"
                      >
                        <View className="flex-row items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle size={18} color="#fff" />
                          ) : (
                            <View className="w-4 h-4 rounded-full border-2 border-[#333]" />
                          )}
                          <Text className="text-gray-300 font-medium">{section.title}</Text>
                        </View>
                        <ChevronRight size={16} color="#555" />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  onPress={() => router.push(`/modules/${module.id}/${module.sections[0].id}`)}
                  className="bg-white py-4 rounded-2xl items-center"
                >
                  <Text className="text-[#121212] font-bold text-lg">
                    {moduleProgress === 0 ? 'Start Module' : 'Continue Module'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}