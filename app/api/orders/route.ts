import { NextRequest, NextResponse } from "next/server";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  note: string;
}

interface OrderData {
  name: string;
  phone1: string;
  phone2: string;
  address: string;
  items: CartItem[];
  totalPrice: number;
  orderId: string;
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderData = await request.json();

    // Validate required fields
    if (
      !orderData.name ||
      !orderData.phone1 ||
      !orderData.address ||
      !orderData.items ||
      orderData.items.length === 0 ||
      !orderData.orderId
    ) {
      return NextResponse.json(
        { error: "Missing required fields or empty cart" },
        { status: 400 }
      );
    }

    // Format order message
    const itemsText = orderData.items
      .map(
        (item) =>
          `• ${item.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString("vi-VN")}đ${item.note ? ` (${item.note})` : ""}`
      )
      .join("\n");

    const orderMessage = `
🛍️ **ĐƠN HÀNG MỚI - GIAO TẬN NHÀ**

🆔 **Mã đơn hàng:** ${orderData.orderId}
👤 **Khách hàng:** ${orderData.name}
📞 **SĐT chính:** ${orderData.phone1}
${orderData.phone2 ? `📞 **SĐT phụ:** ${orderData.phone2}` : ""}
🏠 **Địa chỉ:** ${orderData.address}

📋 **Sản phẩm:**
${itemsText}

💰 **Tổng tiền:** ${orderData.totalPrice.toLocaleString("vi-VN")}đ
🚚 **Loại:** Giao hàng tận nhà
💳 **Nội dung CK:** ${orderData.name} ${orderData.orderId}

---
⏰ Thời gian đặt: ${new Date().toLocaleString("vi-VN")}
    `.trim();

    // Send to Facebook Messenger (replace with your actual Facebook Page Access Token and Page ID)
    const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
    const FB_PAGE_ID = process.env.FB_PAGE_ID;
    const RECIPIENT_ID = process.env.FB_RECIPIENT_ID; // Your Facebook user ID

    if (FB_PAGE_ACCESS_TOKEN && FB_PAGE_ID && RECIPIENT_ID) {
      try {
        const fbResponse = await fetch(
          `https://graph.facebook.com/v18.0/${FB_PAGE_ID}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${FB_PAGE_ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
              recipient: {
                id: RECIPIENT_ID,
              },
              message: {
                text: orderMessage,
              },
            }),
          }
        );

        if (!fbResponse.ok) {
          console.error(
            "Failed to send Facebook message:",
            await fbResponse.text()
          );
        }
      } catch (fbError) {
        console.error("Facebook API error:", fbError);
      }
    }

    // You can also save to database here if needed
    // await saveOrderToDatabase(orderData);

    return NextResponse.json(
      {
        success: true,
        message: "Order submitted successfully",
        orderId: Date.now().toString(), // Simple order ID for now
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
