import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export socials link
export const socialsLink = {
  facebook: "https://www.facebook.com/Moingayatelier?mibextid=LQQJ4d.com",
  zalo: "https://zalo.me/0394049489",
  instagram:
    "https://www.instagram.com/moingay.atelier?utm_source=ig_web_button_share_sheet&igsh=MWYzYmVkbmpjbWRlZw==",
  instagramBook:
    "https://www.instagram.com/moingay.docsach?igsh=MXQ4ODJucTY4OGoweA%3D%3D&utm_source=qr",
};
