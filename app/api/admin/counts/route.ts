import { supabaseAdmin } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    // Get product count
    const { count: productCount, error: productError } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true });

    if (productError) throw productError;

    // Get category count
    const { count: categoryCount, error: categoryError } = await supabaseAdmin
      .from("categories")
      .select("*", { count: "exact", head: true });

    if (categoryError) throw categoryError;

    // Get order count
    const { count: orderCount, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true });

    if (orderError) throw orderError;

    return successResponse(
      {
        productCount: productCount || 0,
        categoryCount: categoryCount || 0,
        orderCount: orderCount || 0,
      },
      "Counts retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching counts:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch counts",
      500
    );
  }
}
