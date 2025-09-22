import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

// Save order to database
async function saveOrderToDatabase(orderData: OrderData) {
  try {
    // Insert order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_id: orderData.orderId,
        customer_name: orderData.name,
        customer_phone1: orderData.phone1,
        customer_phone2: orderData.phone2 || null,
        customer_address: orderData.address,
        total_price: orderData.totalPrice,
        status: "pending",
        payment_status: "unpaid",
        delivery_type: "delivery",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error saving order:", orderError);
      return false;
    }

    // Insert order items
    const orderItems = orderData.items.map((item) => ({
      order_id: orderData.orderId,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
      item_note: item.note || null,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error saving order items:", itemsError);
      return false;
    }

    console.log("Order saved to database successfully:", orderData.orderId);
    return true;
  } catch (error) {
    console.error("Error in saveOrderToDatabase:", error);
    return false;
  }
}

// Update payment status in database
async function updatePaymentStatus(orderId: string) {
  try {
    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        status: "paid",
        paid_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);

    if (error) {
      console.error("Error updating payment status:", error);
      return false;
    }

    console.log("Payment status updated successfully:", orderId);
    return true;
  } catch (error) {
    console.error("Error in updatePaymentStatus:", error);
    return false;
  }
}

// Send order notification via multiple channels
async function sendOrderNotification(message: string, orderData: OrderData) {
  const notifications = [];

  // Method 1: Send message to Facebook Page (as personal account)
  if (process.env.FB_PAGE_ID) {
    notifications.push(sendToFacebookPage(message));
  }

  // Method 2: Send to Telegram (simpler alternative)
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    notifications.push(sendToTelegram(message));
  }

  // Method 3: Send email notification
  if (process.env.NOTIFICATION_EMAIL) {
    notifications.push(sendEmailNotification(message, orderData));
  }

  // Method 4: Webhook to external service
  if (process.env.WEBHOOK_URL) {
    notifications.push(sendWebhookNotification(message, orderData));
  }

  // Execute all notifications (don't wait for all to complete)
  await Promise.allSettled(notifications);
}

// Send message to Facebook Page (as personal account)
async function sendToFacebookPage(message: string) {
  try {
    const pageId = process.env.FB_PAGE_ID;

    // Method 1: Use Facebook Graph API to send message to page
    // This requires a user access token (your personal Facebook account)
    if (process.env.FB_USER_ACCESS_TOKEN) {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.FB_USER_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            recipient: {
              id: pageId,
            },
            message: {
              text: message,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Facebook message failed:", errorText);

        // If API fails, create a manual message URL
        const encodedMessage = encodeURIComponent(message);
        const messageUrl = `https://m.me/${pageId}?text=${encodedMessage}`;
        console.log("Fallback - Facebook message URL:", messageUrl);
        console.log("Click this URL to send the message manually");
      } else {
        console.log("✅ Message sent to Facebook page successfully");
      }
    } else {
      // Method 2: Create direct message URL (manual sending)
      const encodedMessage = encodeURIComponent(message);
      const messageUrl = `https://m.me/${pageId}?text=${encodedMessage}`;

      console.log("📱 Facebook message URL:", messageUrl);
      console.log(
        "💡 Click this URL to send the order notification to your page"
      );

      // You could also save this URL to a file or database for later use
      // Or send it via email/telegram for easy access
    }
  } catch (error) {
    console.error("Facebook messaging error:", error);
  }
}

// Telegram notification (much simpler)
async function sendToTelegram(message: string) {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      console.error("Telegram send failed:", await response.text());
    }
  } catch (error) {
    console.error("Telegram API error:", error);
  }
}

// Email notification
async function sendEmailNotification(message: string, orderData: OrderData) {
  // You can integrate with services like SendGrid, Resend, or Nodemailer
  console.log(
    "Email notification would be sent to:",
    process.env.NOTIFICATION_EMAIL
  );
  console.log("Order details:", orderData);
}

// Generic webhook
async function sendWebhookNotification(message: string, orderData: OrderData) {
  try {
    const response = await fetch(process.env.WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        orderData,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("Webhook failed:", await response.text());
    }
  } catch (error) {
    console.error("Webhook error:", error);
  }
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
⏰ Thời gian đặt: ${new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })}
    `.trim();

    // Save order to database
    const savedToDatabase = await saveOrderToDatabase(orderData);
    if (!savedToDatabase) {
      console.error("Failed to save order to database:", orderData.orderId);
    }

    // Send notification via multiple channels
    await sendOrderNotification(orderMessage, orderData);

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

export async function PATCH(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    // Validate required fields
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    // Format payment confirmation message
    const paymentMessage = `
✅ **XÁC NHẬN THANH TOÁN**

🆔 **Mã đơn hàng:** ${orderId}
💳 **Trạng thái:** Đã thanh toán thành công
⏰ **Thời gian xác nhận:** ${new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })}

---
📝 Khách hàng đã xác nhận thanh toán qua QR Code, hãy kiểm tra tài khoản ${process.env.NEXT_PUBLIC_BANK_NAME} ${process.env.NEXT_PUBLIC_BANK_NUMBER}
    `.trim();

    // Update payment status in database
    const updatedPayment = await updatePaymentStatus(orderId);
    if (!updatedPayment) {
      console.error("Failed to update payment status:", orderId);
    }

    // Send payment confirmation notification
    await sendOrderNotification(paymentMessage, { orderId } as any);

    return NextResponse.json(
      {
        success: true,
        message: "Payment confirmed successfully",
        orderId: orderId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Payment confirmation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
