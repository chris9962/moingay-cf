import { create } from "zustand"
import { persist } from "zustand/middleware"
import Cookies from "js-cookie"

// Hard-coded admin credentials (in a real app, this would be in the database)
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "admin"
const AUTH_TOKEN = "admin-session-token"

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          // Check against hard-coded credentials
          if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Set the auth token in cookies
            Cookies.set("admin-auth-token", AUTH_TOKEN, {
              expires: 1, // 1 day
              path: "/",
              sameSite: "strict",
            })

            set({ isAuthenticated: true, isLoading: false, error: null })
            return true
          } else {
            set({ isAuthenticated: false, isLoading: false, error: "Invalid credentials" })
            return false
          }
        } catch (error) {
          set({
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : "An error occurred",
          })
          return false
        }
      },
      logout: () => {
        // Remove the auth token from cookies
        Cookies.remove("admin-auth-token", { path: "/" })
        set({ isAuthenticated: false, error: null })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
