import localFont from "next/font/local";
import { Roboto } from "next/font/google";

// Load HV Florentino as a local font
export const hvFlorentino = localFont({
  src: [
    {
      path: "../public/fonts/hv-florentino-regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-hv-florentino",
});

// Keep Roboto for product pricing and fallback
export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});
