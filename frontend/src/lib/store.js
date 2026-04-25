import { create } from 'zustand';
import { persist } from 'zustand/middleware';








export const useAppStore = create((set) => ({
  activeFolderId: null,
  activeNoteId: null,
  setActiveFolderId: (id) => set({ activeFolderId: id }),
  setActiveNoteId: (id) => set({ activeNoteId: id })
}));







export const useThemeStore = create()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'theme-storage'
    }
  )
);