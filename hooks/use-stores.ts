"use client"

import { useEventStore, useKanbanStore, useLogisticsStore, useContentStore, useNotificationStore, useUserStore, useLogsStore, useConfigStore, useTrackingStore, useAuthStore } from "@/stores"

export const useEvents = () => useEventStore()
export const useKanban = () => useKanbanStore()
export const useLogistics = () => useLogisticsStore()
export const useContent = () => useContentStore()
export const useNotifications = () => useNotificationStore()
export const useUsers = () => useUserStore()
export const useLogs = () => useLogsStore()
export const useConfig = () => useConfigStore()
export const useTracking = () => useTrackingStore()
export const useAuth = () => useAuthStore()

export const useEventActions = () => {
  const store = useEventStore()
  return {
    fetchEvents: store.fetchEvents,
    createEvent: store.createEvent,
    updateEvent: store.updateEvent,
    deleteEvent: store.deleteEvent,
    deleteMultiple: store.deleteMultiple,
    approveEvent: store.approveEvent,
    rejectEvent: store.rejectEvent,
    assignLogistics: store.assignLogistics,
    moveWorkflowStage: store.moveWorkflowStage,
    setSelectedEvent: store.setSelectedEvent,
    setFilter: store.setFilter,
  }
}

export const useKanbanActions = () => {
  const store = useKanbanStore()
  return {
    fetchBoard: store.fetchBoard,
    moveCard: store.moveCard,
    updateStage: store.updateStage,
    addCard: store.addCard,
    removeCard: store.removeCard,
    setSelectedCard: store.setSelectedCard,
    setSearchQuery: store.setSearchQuery,
    setCityFilter: store.setCityFilter,
    getFilteredColumns: store.getFilteredColumns,
  }
}

export const useLogisticsActions = () => {
  const store = useLogisticsStore()
  return {
    fetchDeliveries: store.fetchDeliveries,
    assignDelivery: store.assignDelivery,
    markPreparing: store.markPreparing,
    markShipped: store.markShipped,
    markDelivered: store.markDelivered,
    reportIssue: store.reportIssue,
    addNote: store.addNote,
    setActiveDelivery: store.setActiveDelivery,
    setFilter: store.setFilter,
  }
}

export const useContentActions = () => {
  const store = useContentStore()
  return {
    fetchContent: store.fetchContent,
    submitUGC: store.submitUGC,
    approveUGC: store.approveUGC,
    requestRevision: store.requestRevision,
    rejectUGC: store.rejectUGC,
    publishContent: store.publishContent,
    addNote: store.addNote,
    setSelectedContent: store.setSelectedContent,
    setFilter: store.setFilter,
  }
}

export const useNotificationActions = () => {
  const store = useNotificationStore()
  return {
    fetchNotifications: store.fetchNotifications,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    deleteNotification: store.deleteNotification,
    clearAll: store.clearAll,
  }
}

export const useSafeArray = <T>(arr: T[] | undefined | null): T[] => {
  return arr ?? []
}

export const useSafeLength = (arr: unknown[] | undefined | null): number => {
  return arr == null ? 0 : arr.length
}