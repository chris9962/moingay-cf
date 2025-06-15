import Link from "next/link";

import { Instagram, TwitterIcon as TikTok, Youtube } from "lucide-react";

export default function StickyWicksPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#5D3523] text-white ">
      {/* Background placeholder - replace with actual image later */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-[#5D3523]" />
      </div>

      {/* Content container */}
      <div className="relative max-w-xl mx-auto z-10 flex min-h-screen flex-col items-center justify-start px-6 py-12">
        {/* Logo and header section */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-[#D4A84B]">
            <h2 className="font-hv-florentino text-2xl font-bold tracking-wider text-white">
              mõingày
            </h2>
          </div>

          <h1 className="mb-2 text-4xl font-bold">mõingày</h1>
          <p className="mb-1 text-xl opacity-90">Coffee Shop</p>
          <p className="text-lg opacity-80">Est. 2023</p>
        </div>
        <div className="flex flex-col items-center text-center w-full">
          {/* Navigation buttons */}
          <div className="my-8 flex w-full flex-col gap-4">
            <Link
              href="/sticky-wicks/cakes"
              className="w-full rounded-full bg-white py-4 text-center text-xl font-medium text-[#333333] transition-all hover:bg-opacity-90"
            >
              Cakes and pastry
            </Link>
            <Link
              href="/sticky-wicks/merch"
              className="w-full rounded-full bg-white py-4 text-center text-xl font-medium text-[#333333] transition-all hover:bg-opacity-90"
            >
              Shop merch
            </Link>
            <Link
              href="/sticky-wicks/about"
              className="w-full rounded-full bg-white py-4 text-center text-xl font-medium text-[#333333] transition-all hover:bg-opacity-90"
            >
              About us
            </Link>
          </div>

          {/* Social media icons */}
          <div className="flex gap-8">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-2 transition-all hover:bg-white/10"
            >
              <Instagram size={32} />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-2 transition-all hover:bg-white/10"
            >
              <TikTok size={32} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-2 transition-all hover:bg-white/10"
            >
              <Youtube size={32} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
