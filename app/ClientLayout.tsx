"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { hvFlorentino, roboto } from "./fonts"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith("/admin")

  // Scroll to top when pathname changes
  useEffect(() => {
    if (!isAdminRoute) {
      window.scrollTo(0, 0)
    }
  }, [pathname, isAdminRoute])

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <body className={`${hvFlorentino.variable} ${roboto.variable}`}>
      <Header />
      {children}
      <Footer />
    </body>
  )
}
