"use client";

import { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  Minus,
  Plus,
  Trash2,
  QrCode,
  Copy,
} from "lucide-react";
// Remove UUID import - we'll use numeric ID instead
import { Button } from "@/components/ui/button";

// Generate random numeric ID (12-15 digits)
const generateNumericId = (): string => {
  const length = Math.floor(Math.random() * 4) + 12; // 12-15 digits
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
};
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/lib/cart-store";
import Image from "next/image";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [userForm, setUserForm] = useState({
    name: "",
    phone1: "",
    phone2: "",
    address: "",
  });

  const {
    items,
    userInfo,
    updateQuantity,
    removeItem,
    clearCart,
    updateUserInfo,
    getTotalPrice,
  } = useCartStore();

  // Auto-fill user info from store
  useEffect(() => {
    setUserForm(userInfo);
  }, [userInfo]);

  const handleUserInputChange = (
    field: keyof typeof userForm,
    value: string
  ) => {
    const newForm = { ...userForm, [field]: value };
    setUserForm(newForm);
    updateUserInfo(newForm);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Generate numeric ID for this order
      const newOrderId = generateNumericId();
      setOrderId(newOrderId);

      // Prepare order data
      const orderData = {
        ...userForm,
        items: items,
        totalPrice: getTotalPrice(),
        orderId: newOrderId,
      };

      // Call API to send order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setStep(3); // Go to payment step
      } else {
        alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentConfirmation = () => {
    clearCart();
    setStep(4); // Go to success step
  };

  const resetAndClose = () => {
    setStep(1);
    onClose();
  };

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resetAndClose();
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
      resetAndClose();
    }
  };

  const isUserFormValid = userForm.name && userForm.phone1 && userForm.address;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 1 && "Giỏ hàng của bạn"}
            {step === 2 && "Thông tin giao hàng"}
            {step === 3 && "Thanh toán"}
            {step === 4 && "Đặt hàng thành công"}
          </h2>
          <button
            onClick={resetAndClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Step 1: Cart Items */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Giỏ hàng trống</p>
                <p className="text-gray-400 text-sm mt-2">
                  Hãy thêm sản phẩm vào giỏ hàng để tiếp tục
                </p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-primary font-bold price-text">
                          {item.price.toLocaleString("vi-VN")}đ
                        </p>
                        {item.note && (
                          <p className="text-xs text-gray-600 mt-1">
                            Ghi chú: {item.note}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center price-text">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 rounded-full border border-red-300 text-red-500 flex items-center justify-center hover:bg-red-50 ml-2"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-primary price-text">
                      {getTotalPrice().toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={resetAndClose}
                    className="flex-1"
                  >
                    Tiếp tục mua hàng
                  </Button>
                  <Button onClick={() => setStep(2)} className="flex-1">
                    Đặt hàng
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: User Info */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Tên khách hàng *</Label>
                <Input
                  id="name"
                  value={userForm.name}
                  onChange={(e) =>
                    handleUserInputChange("name", e.target.value)
                  }
                  placeholder="Nhập tên của bạn"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone1">Số điện thoại 1 *</Label>
                  <Input
                    id="phone1"
                    value={userForm.phone1}
                    onChange={(e) =>
                      handleUserInputChange("phone1", e.target.value)
                    }
                    placeholder="Số điện thoại chính"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone2">Số điện thoại 2 (tùy chọn)</Label>
                  <Input
                    id="phone2"
                    value={userForm.phone2}
                    onChange={(e) =>
                      handleUserInputChange("phone2", e.target.value)
                    }
                    placeholder="Số điện thoại phụ"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                <Textarea
                  id="address"
                  value={userForm.address}
                  onChange={(e) =>
                    handleUserInputChange("address", e.target.value)
                  }
                  placeholder="Nhập địa chỉ chi tiết"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Tóm tắt đơn hàng</h4>
              <div className="space-y-1 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x
                      <span className="price-text">{item.quantity}</span>
                    </span>
                    <span className="price-text">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary price-text">
                    {getTotalPrice().toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Quay lại
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isUserFormValid || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="p-6 space-y-6">
            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg shadow-lg border">
                <img
                  src={`https://img.vietqr.io/image/TCB-3333333558-compact2.png?amount=${getTotalPrice()}&addInfo=${encodeURIComponent(
                    `${userForm.name} ${orderId}`
                  )}`}
                  alt="QR Code thanh toán"
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ngân hàng:</span>
                <span className="font-semibold">Techcombank (TCB)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Số tài khoản:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold price-text">3333333558</span>
                  <button
                    onClick={() => navigator.clipboard.writeText("3333333558")}
                    className="text-primary hover:text-primary/80"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Số tiền:</span>
                <span className="font-semibold text-primary price-text">
                  {getTotalPrice().toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-600">Nội dung:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-right price-text">
                    {userForm.name} {orderId}
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${userForm.name} ${orderId}`
                      )
                    }
                    className="text-primary hover:text-primary/80"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Lưu ý:</strong> Sau khi chuyển khoản thành công, vui
                lòng nhấn nút "Đã thanh toán" bên dưới để hoàn tất đơn hàng.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1"
              >
                Quay lại
              </Button>
              <Button onClick={handlePaymentConfirmation} className="flex-1">
                Đã thanh toán
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="p-6 text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="text-green-500" size={64} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Đặt hàng thành công!
              </h3>
              <p className="text-gray-600">
                Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg text-left">
              <p className="text-sm text-gray-700">
                <strong>Lưu ý:</strong> Tùy thuộc vào quãng đường xa gần và hiện
                trạng thời tiết mà đơn hàng có thể hoàn thành sớm hoặc trễ hơn
                5-10 phút.
              </p>
            </div>

            <Button onClick={resetAndClose} className="w-full">
              Đóng
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
