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
  finalScore?: number;
  timeTakenSeconds?: number;
}

interface CreateSessionParams {
  type: 'exam' | 'ai';
  moduleId: number;
  difficulty?: string;
  instructions?: string;
}

interface SessionState {
  activeSessions: SessionData[];
  completedSessions: SessionData[];
  fetchActiveSessions: () => Promise<void>;
  fetchCompletedSessions: () => Promise<void>;
  createSession: (params: CreateSessionParams) => Promise<SessionData>;
  gradeExam: (sessionId: string) => Promise<SessionData>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  activeSessions: [],
  completedSessions: [],

  fetchActiveSessions: async () => {
    try {
      const response = await api.get<SessionData[]>('/sessions/active');
      set({ activeSessions: response.data });
    } catch (error) {
      console.error("Gagal mengambil sesi aktif:", error);
      set({ activeSessions: [] });
    }
  },

  fetchCompletedSessions: async () => {
    try {
      const response = await api.get<SessionData[]>('/sessions/completed');
      set({ completedSessions: response.data });
    } catch (error) {
      console.error("Gagal mengambil sesi yang telah selesai:", error);
      set({ completedSessions: [] });
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

  gradeExam: async (sessionId: string) => {
    try {
      const response = await api.post<SessionData>(`/submit/${sessionId}/grade`);
      const gradedSession = response.data;
      set((state) => ({
        activeSessions: state.activeSessions.filter(s => s._id !== sessionId),
        completedSessions: [gradedSession, ...state.completedSessions],
      }));
      return gradedSession;
    } catch (error) {
      console.error(`Gagal menilai ujian dengan ID: ${sessionId}:`, error);
      throw error;
    }
  },
}));

// Auto-fetch on auth change
useAuthStore.subscribe((state, prevState) => {
  if (state.isAuthenticated && !prevState.isAuthenticated) {
    useSessionStore.getState().fetchActiveSessions();
    useSessionStore.getState().fetchCompletedSessions();
  }
});
