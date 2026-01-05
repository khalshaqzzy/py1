import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Code } from 'lucide-react-native';
import { useAuthStore } from '../src/stores/authStore';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const { login, register, isAuthenticated } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated]);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#121212]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <View className="items-center mb-10">
          <View className="flex-row items-center gap-3 mb-2">
            <Code size={48} color="white" strokeWidth={2.5} />
            <Text className="text-6xl font-bold text-white">Py1</Text>
          </View>
          <Text className="text-[#888888] text-center">
            Computational Thinking Learning Platform
          </Text>
        </View>

        <View className="space-y-6">
          {error && (
            <View className="bg-red-950/30 border border-red-900 p-4 rounded-xl mb-4">
              <Text className="text-red-400 text-sm text-center">{error}</Text>
            </View>
          )}

          <View>
            <Text className="text-[#888888] text-sm mb-2 ml-1">Username</Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              className="bg-[#1E1E1E] border border-[#333333] rounded-xl px-4 py-4 text-white text-lg focus:border-white"
              placeholder="Enter your username"
              placeholderTextColor="#555"
              autoCapitalize="none"
            />
          </View>

          <View className="mt-4">
            <Text className="text-[#888888] text-sm mb-2 ml-1">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              className="bg-[#1E1E1E] border border-[#333333] rounded-xl px-4 py-4 text-white text-lg focus:border-white"
              placeholder="Enter your password"
              placeholderTextColor="#555"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className="bg-white rounded-xl py-4 mt-8 flex-row justify-center items-center"
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#121212" />
            ) : (
              <Text className="text-[#121212] font-bold text-xl">
                {isLogin ? 'Login' : 'Register'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="py-4"
          >
            <Text className="text-[#888888] text-center text-base">
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
