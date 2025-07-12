"use client";

import { useState } from "react";
import { Phone, ShoppingCart } from "lucide-react";
import Socials from "./socials";
import OrderModal from "@/components/order-modal";
import { useCartStore } from "@/lib/cart-store";

export default function SocialsWrapper() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-center space-y-2">
        {/* Shopping cart button with badge */}
        <div className="relative">
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="rounded-full bg-primary p-2 w-10 h-10 text-white hover:bg-primary/90 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Đặt hàng"
          >
            <ShoppingCart className="h-6 w-6" />
          </button>
          {totalItems > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalItems > 99 ? "99+" : totalItems}
            </div>
          )}
        </div>

        {/* Phone call button with shake animation */}
        <a
          href="tel:0394049489"
          className="rounded-full bg-primary p-2 w-10 h-10 text-white hover:bg-primary/90 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Gọi điện"
        >
          <Phone className="h-6 w-6 animate-shake hover:animate-none" />
        </a>

        <Socials className="flex flex-col items-center space-y-2" />
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
}
