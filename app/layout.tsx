import type React from "react"
import type { Metadata } from "next"
import { StoreInitializer } from "@/components/store-initializer"
import "./globals.css"
import { hvFlorentino, roboto } from "./fonts"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
export const metadata: Metadata = {
  title: "mõingày - Coffee Shop",
  description: "A cozy coffee shop experience",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>mõingày - Coffee Shop</title>
        <meta name="description" content="A cozy coffee shop experience" />
      </head>
      <body className={`${hvFlorentino.variable} ${roboto.variable}`}>
        <StoreInitializer />
        {children}
      </body>
    </html>
  )
}
