import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const paymentStatus = searchParams.get("paymentStatus") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Build base query
    let query = supabaseAdmin.from("orders").select(
      `
        *,
        items:order_items(*)
      `,
      { count: "exact" }
    );

    // Apply filters
    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (paymentStatus !== "all") {
      query = query.eq("payment_status", paymentStatus);
    }

    // Apply search filter using database functions - only search by order_id
    if (search) {
      // Escape special characters and only search by order_id
      const escapedSearch = search.replace(/[%_\\]/g, "\\$&");
      query = query.ilike("order_id", `%${escapedSearch}%`);
    }

    // Apply pagination and ordering
    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Execute query
    const { data: orders, error, count } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
      return errorResponse("Failed to fetch orders", 500);
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return successResponse(
      {
        orders: orders || [],
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count || 0,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "Orders retrieved successfully"
    );
  } catch (error) {
    console.error("Error in GET /api/admin/orders:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();

    // Validate input
    if (!orderId || !status) {
      return errorResponse("Missing orderId or status", 400);
    }

    // Validate status
    const validStatuses = ["pending", "paid", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return errorResponse("Invalid status", 400);
    }

    // Prepare update data
    const updateData: any = { status };

    // Add timestamps based on status
    if (status === "delivered") {
      updateData.delivered_at = new Date().toISOString();
    }
    if (status === "paid") {
      updateData.payment_status = "paid";
      updateData.paid_at = new Date().toISOString();
    }

    // Update order
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("order_id", orderId)
      .select()
      .single();

    if (error) {
      console.error("Error updating order:", error);
      return errorResponse("Failed to update order", 500);
    }

    if (!data) {
      return errorResponse("Order not found", 404);
    }

    return successResponse({ order: data }, "Order updated successfully");
  } catch (error) {
    console.error("Error in PATCH /api/admin/orders:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
}
