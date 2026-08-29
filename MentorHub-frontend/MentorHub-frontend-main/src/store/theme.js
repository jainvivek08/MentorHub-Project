import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useThemeStore = create()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: "mentorhub-theme",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useThemeStore;
