"use client"

import { create } from "zustand"

interface RefreshState {
  counters: Record<string, number>
  triggerRefresh: (table: string) => void
}

export const useRefreshStore = create<RefreshState>((set) => ({
  counters: {},
  triggerRefresh: (table) =>
    set((state) => ({
      counters: {
        ...state.counters,
        [table]: (state.counters[table] ?? 0) + 1,
      },
    })),
}))
