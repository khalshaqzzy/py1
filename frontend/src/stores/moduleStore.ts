
import { create } from 'zustand';
import api from '../services/api';
import { useAuthStore } from './authStore';

// Interface untuk data modul dari backend
export interface ModuleData {
  id: number;
  title: string;
  description: string;
}

interface LearningProgress {
  moduleId: string;
  completedSections: string[];
  progress: number;
}

interface ModuleState {
  modules: ModuleData[];
  progress: LearningProgress[];
  fetchModules: () => Promise<void>;
  fetchProgress: () => Promise<void>;
  updateProgress: (moduleId: string, sectionId: string, totalSections: number) => Promise<void>;
}

export const useModuleStore = create<ModuleState>((set, get) => ({
  modules: [],
  progress: [],

  fetchModules: async () => {
    try {
      const response = await api.get<ModuleData[]>('/content/modules');
      set({ modules: response.data });
    } catch (error) {
      console.error("Gagal mengambil data modul:", error);
    }
  },

  fetchProgress: async () => {
    try {
      const response = await api.get('/user/progress');
      set({ progress: response.data });
    } catch (error) {
      console.error("Gagal mengambil progres belajar:", error);
    }
  },

  updateProgress: async (moduleId, sectionId, totalSections) => {
    const { progress } = get();
    const moduleProgress = progress.find(p => p.moduleId === moduleId) || { moduleId, completedSections: [], progress: 0 };

    if (moduleProgress.completedSections.includes(sectionId)) {
      return;
    }

    const newCompletedSections = [...moduleProgress.completedSections, sectionId];
    const newProgress = Math.round((newCompletedSections.length / totalSections) * 100);

    try {
      const response = await api.post('/user/progress', { 
        moduleId, 
        completedSections: newCompletedSections, 
        progress: newProgress 
      });
      set({ progress: response.data });
    } catch (error) {
      console.error("Gagal memperbarui progres:", error);
    }
  },
}));

// Setiap kali user login, fetch progres dan modul mereka
useAuthStore.subscribe((state, prevState) => {
  if (state.isAuthenticated && !prevState.isAuthenticated) {
    useModuleStore.getState().fetchProgress();
    useModuleStore.getState().fetchModules();
  }
});

// Juga fetch jika token sudah ada saat aplikasi dimuat
if (useAuthStore.getState().isAuthenticated) {
  useModuleStore.getState().fetchProgress();
  useModuleStore.getState().fetchModules();
}

