import { create } from "zustand"

export interface AppConfig {
  theme: "light" | "dark" | "system"
  language: "fr" | "en"
  sidebarCollapsed: boolean
  notificationsEnabled: boolean
  soundEnabled: boolean
}

export interface ConfigState {
  config: AppConfig
  loading: boolean
  error: string | null
}

export interface ConfigActions {
  loadConfig: () => Promise<void>
  setTheme: (theme: AppConfig["theme"]) => void
  setLanguage: (language: AppConfig["language"]) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleNotifications: () => void
  toggleSound: () => void
  updateConfig: (updates: Partial<AppConfig>) => void
  reset: () => void
}

type ConfigStore = ConfigState & ConfigActions

const initialConfig: AppConfig = {
  theme: "system",
  language: "fr",
  sidebarCollapsed: false,
  notificationsEnabled: true,
  soundEnabled: true,
}

const initialState: ConfigState = {
  config: initialConfig,
  loading: false,
  error: null,
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  ...initialState,

  loadConfig: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch("/api/config")

      if (response.ok) {
        const data = await response.json()
        set({
          config: { ...initialConfig, ...data.config },
          loading: false,
        })
      } else {
        const stored = localStorage.getItem("app-config")
        if (stored) {
          set({
            config: { ...initialConfig, ...JSON.parse(stored) },
            loading: false,
          })
        } else {
          set({ loading: false })
        }
      }
    } catch {
      const stored = localStorage.getItem("app-config")
      if (stored) {
        set({
          config: { ...initialConfig, ...JSON.parse(stored) },
        })
      }
      set({ loading: false })
    }
  },

  setTheme: (theme) => {
    set((state) => {
      const newConfig = { ...state.config, theme }
      localStorage.setItem("app-config", JSON.stringify(newConfig))
      return { config: newConfig }
    })
  },

  setLanguage: (language) => {
    set((state) => {
      const newConfig = { ...state.config, language }
      localStorage.setItem("app-config", JSON.stringify(newConfig))
      return { config: newConfig }
    })
  },

  toggleSidebar: () => {
    set((state) => {
      const newConfig = { ...state.config, sidebarCollapsed: !state.config.sidebarCollapsed }
      localStorage.setItem("app-config", JSON.stringify(newConfig))
      return { config: newConfig }
    })
  },

  setSidebarCollapsed: (collapsed) => {
    set((state) => {
      const newConfig = { ...state.config, sidebarCollapsed: collapsed }
      localStorage.setItem("app-config", JSON.stringify(newConfig))
      return { config: newConfig }
    })
  },

  toggleNotifications: () => {
    set((state) => {
      const newConfig = { ...state.config, notificationsEnabled: !state.config.notificationsEnabled }
      localStorage.setItem("app-config", JSON.stringify(newConfig))
      return { config: newConfig }
    })
  },

  toggleSound: () => {
    set((state) => {
      const newConfig = { ...state.config, soundEnabled: !state.config.soundEnabled }
      localStorage.setItem("app-config", JSON.stringify(newConfig))
      return { config: newConfig }
    })
  },

  updateConfig: (updates) => {
    set((state) => {
      const newConfig = { ...state.config, ...updates }
      localStorage.setItem("app-config", JSON.stringify(newConfig))
      return { config: newConfig }
    })
  },

  reset: () => {
    localStorage.removeItem("app-config")
    set(initialState)
  },
}))

export const selectConfig = (state: ConfigStore) => state.config
export const selectTheme = (state: ConfigStore) => state.config.theme
export const selectLanguage = (state: ConfigStore) => state.config.language
export const selectSidebarCollapsed = (state: ConfigStore) => state.config.sidebarCollapsed