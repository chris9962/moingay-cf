"use client";

import Link from "next/link";
import { socialsLink } from "@/lib/utils";
import {
  Coffee,
  Menu,
  Droplets,
  ShoppingCart,
  Heart,
  BookOpen,
  Clover,
  Instagram,
  Flower,
} from "lucide-react";

export default function StickyWicksPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#5D3523] text-white ">
      {/* Background placeholder - replace with actual image later */}
      <div className="absolute inset-0 z-0">
        <div className="h-full w-full bg-[#5D3523]" />
      </div>

      {/* Content container */}
      <div className="relative max-w-xl mx-auto z-10 flex min-h-screen flex-col items-center justify-start px-6 py-12">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-2 text-4xl font-bold">Mọi thứ bạn cần</h1>
        </div>
        <div className="flex flex-col items-center text-center w-full">
          {/* Navigation buttons */}
          <div className="my-8 flex w-full flex-col gap-4">
            <Link
              href="/about-us"
              className="w-full rounded-full bg-white py-4 px-6 text-center text-lg font-medium text-[#333333] transition-all hover:bg-opacity-90 flex items-center justify-start gap-4"
            >
              <Flower className="text-pink-400" size={20} />
              <span>Tinh thần của mỗingày</span>
            </Link>
            <Link
              href="/products"
              className="w-full rounded-full bg-white py-4 px-6 text-center text-lg font-medium text-[#333333] transition-all hover:bg-opacity-90 flex items-center justify-start gap-4"
            >
              <Coffee className="text-amber-600" size={20} />
              <span>Sản phẩm từ mỗingày </span>
            </Link>
            <Link
              href="/workshop"
              className="w-full rounded-full bg-white py-4 px-6 text-center text-lg font-medium text-[#333333] transition-all hover:bg-opacity-90 flex items-center justify-start gap-4"
            >
              <Menu className="text-gray-600" size={20} />
              <span>Chương trình Workshop</span>
            </Link>
            <Link
              href="/delivery"
              className="w-full rounded-full bg-white py-4 px-6 text-center text-lg font-medium text-[#333333] transition-all hover:bg-opacity-90 flex items-center justify-start gap-4"
            >
              <ShoppingCart className="text-red-500" size={20} />
              <span>Chương trình Delivery</span>
            </Link>
            <Link
              href="/"
              className="w-full rounded-full bg-white py-4 px-6 text-center text-lg font-medium text-[#333333] transition-all hover:bg-opacity-90 flex items-center justify-start gap-4"
            >
              <Heart className="text-red-400" size={20} />
              <span>mỗingày.homespace</span>
            </Link>
            <Link
              href={socialsLink.instagramBook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-white py-4 px-6 text-center text-lg font-medium text-[#333333] transition-all hover:bg-opacity-90 flex items-center justify-start gap-4"
            >
              <BookOpen className="text-gray-600" size={20} />
              <span>mỗingày đọc sách</span>
            </Link>
            <Link
              href={socialsLink.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-white py-4 px-6 text-center text-lg font-medium text-[#333333] transition-all hover:bg-opacity-90 flex items-center justify-start gap-4"
            >
              <Clover className="text-green-500" size={20} />
              <span>mỗingày làm vườn</span>
            </Link>
            <Link
              href={socialsLink.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-white py-4 px-6 text-center text-lg font-medium text-[#333333] transition-all hover:bg-opacity-90 flex items-center justify-start gap-4"
            >
              <Instagram className="text-pink-500" size={20} />
              <span>mỗingày thủ thỉ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
