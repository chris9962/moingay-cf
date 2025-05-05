import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: NextRequest, context: any) {
  const c = await context.params;
  const id = Number.parseInt(c.id);

  if (isNaN(id)) {
    return errorResponse("Invalid product ID", 400);
  }

  try {
    // Get the product with its categories
    const { data, error } = await supabaseAdmin
      .from("products")
      .select(
        `
        *,
        categories:product_categories(
          category:categories(*)
        )
      `
      )
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === "PGRST116") {
        return errorResponse("Product not found", 404);
      }
      throw error;
    }

    // Format the response
    const formattedProduct = {
      ...data,
      categories: data.categories.map((item: any) => item.category),
    };

    return successResponse(formattedProduct, "Product retrieved successfully");
  } catch (error) {
    console.error("Error fetching product:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch product",
      500
    );
  }
}
