
import { create } from 'zustand';
import api from '../services/api';
import { useAuthStore } from './authStore';

export interface SessionData {
  _id: string;
  userId: string;
  type: 'exam' | 'ai';
  moduleId: number;
  status: 'in-progress' | 'completed';
  startTime: string;
  endTime?: string;
  problemIds: string[];
}

interface CreateSessionParams {
  type: 'exam' | 'ai';
  moduleId: number;
  difficulty?: string;
  instructions?: string;
}

interface SessionState {
  activeSessions: SessionData[];
  fetchActiveSessions: () => Promise<void>;
  createSession: (params: CreateSessionParams) => Promise<SessionData>;
}

export const useSessionStore = create<SessionState>((set) => ({
  activeSessions: [],

  fetchActiveSessions: async () => {
    try {
      const response = await api.get<SessionData[]>('/sessions/active');
      set({ activeSessions: response.data });
    } catch (error) {
      console.error("Gagal mengambil sesi aktif:", error);
      set({ activeSessions: [] });
    }
  },

  createSession: async (params) => {
    try {
      const response = await api.post<SessionData>('/sessions/create', params);
      const newSession = response.data;
      set((state) => ({ 
        activeSessions: [...state.activeSessions, newSession] 
      }));
      return newSession;
    } catch (error) {
      console.error("Gagal membuat sesi baru:", error);
      throw error;
    }
  },
}));

// Setiap kali user login, fetch sesi aktif mereka
useAuthStore.subscribe((state, prevState) => {
  if (state.isAuthenticated && !prevState.isAuthenticated) {
    useSessionStore.getState().fetchActiveSessions();
  }
});

if (useAuthStore.getState().isAuthenticated) {
  useSessionStore.getState().fetchActiveSessions();
}

