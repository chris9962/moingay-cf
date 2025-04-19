"use client"

import { useRef } from "react"
import { useProductStore } from "@/lib/store"

// This component ensures the store is properly initialized in Next.js
export function StoreInitializer() {
  const initialized = useRef(false)

  if (!initialized.current) {
    // Access the store to initialize it
    useProductStore.getState()
    initialized.current = true
  }

  return null
}
