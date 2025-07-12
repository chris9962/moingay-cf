"use client";

import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NoteInput from "@/components/note-input";
import { useCartStore } from "@/lib/cart-store";
import Image from "next/image";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
    subtitle?: string;
  } | null;
}

export default function AddToCartModal({
  isOpen,
  onClose,
  product,
}: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product) return;

    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity,
      note
    );

    // Reset and close
    setQuantity(1);
    setNote("");
    onClose();
  };

  const handleClose = () => {
    setQuantity(1);
    setNote("");
    onClose();
  };

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      return () => document.removeEventListener("keydown", handleEscKey);
    }
  }, [isOpen]);

  // Handle click outside
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Thêm vào giỏ hàng</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-xs">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              {product.subtitle && (
                <p className="text-sm text-gray-600 mt-1">{product.subtitle}</p>
              )}
              <p className="text-lg font-bold text-primary mt-2 price-text">
                {product.price.toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <Label>Số lượng</Label>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus size={16} />
              </button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20 text-center"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Note */}
          <NoteInput
            value={note}
            onChange={setNote}
            label="Ghi chú cho món này"
            placeholder="Ghi chú đặc biệt cho món này..."
          />

          {/* Total */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Tổng cộng:</span>
              <span className="text-xl font-bold text-primary price-text">
                {(product.price * quantity).toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Hủy
            </Button>
            <Button onClick={handleAddToCart} className="flex-1">
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
