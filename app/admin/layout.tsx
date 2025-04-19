"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/lib/auth"
import { Toast } from "@/components/toast"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isAuthenticated, router, pathname])

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  // If on login page, just render the login page without header
  if (pathname === "/admin/login") {
    return (
      <>
        {children}
        <Toast />
      </>
    )
  }

  return (
    <>
      <nav className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold">
                mõingày Admin
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/admin/categories"
                className={`px-3 py-2 rounded-md ${pathname.includes("/admin/categories") ? "bg-white text-primary" : "hover:bg-primary/80"}`}
              >
                Categories
              </Link>
              <Link
                href="/admin/products"
                className={`px-3 py-2 rounded-md ${pathname.includes("/admin/products") ? "bg-white text-primary" : "hover:bg-primary/80"}`}
              >
                Products
              </Link>
              <button
                onClick={() => useAuthStore.getState().logout()}
                className="px-3 py-2 rounded-md hover:bg-primary/80"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">{children}</main>
      <Toast />
    </>
  )
}
