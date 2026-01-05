import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  _id: string;
  username: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        const { token } = response.data;
        set({ token, isAuthenticated: true });
        await get().fetchUser();
      },

      register: async (username, password) => {
        const response = await api.post('/auth/register', { username, password });
        const { token } = response.data;
        set({ token, isAuthenticated: true });
        await get().fetchUser();
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },

      fetchUser: async () => {
        try {
          const response = await api.get('/auth/me');
          set({ user: response.data });
        } catch (error) {
          console.error("Gagal mengambil data pengguna:", error);
          set({ token: null, user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Trigger fetchUser jika ada token saat startup
const checkAuth = async () => {
  const token = useAuthStore.getState().token;
  if (token) {
    await useAuthStore.getState().fetchUser();
  }
};

checkAuth();
