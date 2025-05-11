import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    // Categories we want to get products from
    const targetCategories = [3, 9, 7, 4, 8];

    // Get one random product from each category in a single query
    const { data: products, error } = await supabaseAdmin.rpc(
      "get_random_products_by_categories",
      {
        category_ids: targetCategories,
      }
    );

    if (error) throw error;

    if (!products || products.length === 0) {
      return successResponse(
        [],
        "No products found for the specified categories"
      );
    }

    return successResponse(products, "Random products retrieved successfully");
  } catch (error) {
    console.error("Error fetching random products:", error);
    return errorResponse(
      error instanceof Error
        ? error.message
        : "Failed to fetch random products",
      500
    );
  }
}
