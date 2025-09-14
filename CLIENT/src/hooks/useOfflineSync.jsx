"use client"

import { useState, useEffect } from "react"

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingSync, setPendingSync] = useState([])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingData()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const addToSyncQueue = (data, endpoint, method = "POST") => {
    const syncItem = {
      id: Date.now(),
      data,
      endpoint,
      method,
      timestamp: new Date().toISOString(),
    }

    setPendingSync((prev) => [...prev, syncItem])

    // Store in localStorage for persistence
    const stored = JSON.parse(localStorage.getItem("pmis-sync-queue") || "[]")
    stored.push(syncItem)
    localStorage.setItem("pmis-sync-queue", JSON.stringify(stored))

    // If online, try to sync immediately
    if (isOnline) {
      syncPendingData()
    }
  }

  const syncPendingData = async () => {
    const stored = JSON.parse(localStorage.getItem("pmis-sync-queue") || "[]")

    for (const item of stored) {
      try {
        const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000/api"
        const fullUrl = item.endpoint.startsWith("http") ? item.endpoint : `${apiBaseUrl}${item.endpoint}`

        const response = await fetch(fullUrl, {
          method: item.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("pmis-auth-token") || ""}`,
          },
          body: JSON.stringify(item.data),
        })

        if (response.ok) {
          // Remove successfully synced item
          const updated = stored.filter((syncItem) => syncItem.id !== item.id)
          localStorage.setItem("pmis-sync-queue", JSON.stringify(updated))
          setPendingSync(updated)
        }
      } catch (error) {
        console.error("Sync failed for item:", item.id, error)
      }
    }
  }

  return {
    isOnline,
    pendingSync: pendingSync.length,
    addToSyncQueue,
    syncPendingData,
  }
}
