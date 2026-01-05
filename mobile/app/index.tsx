import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-[#121212]">
      <Text className="text-4xl font-bold text-white mb-2">Py1 Mobile</Text>
      <Text className="text-[#888888] mb-8">Computational Thinking Platform</Text>
      <Link href="/login" className="bg-white px-8 py-3 rounded-lg">
        <Text className="text-[#121212] font-semibold text-lg">Get Started</Text>
      </Link>
    </View>
  );
}
