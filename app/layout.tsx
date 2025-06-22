import type React from "react";
import type { Metadata } from "next";
import { StoreInitializer } from "@/components/store-initializer";
import SocialsWrapper from "@/components/socials-wrapper";
import "./globals.css";
import { hvFlorentino, roboto } from "./fonts";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const metadata: Metadata = {
  title: "mỗingày - Coffee Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>mỗingày - Coffee Shop</title>
        <meta name="description" />
      </head>
      <body className={`${hvFlorentino.variable} ${roboto.variable}`}>
        <StoreInitializer />
        {children}

        <SocialsWrapper />
      </body>
    </html>
  );
}
