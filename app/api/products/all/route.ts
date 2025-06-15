import { supabaseAdmin } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
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
      .eq("status", "public") // Only return published products
      .order("created_at", { ascending: false });

    if (error) throw error;

    return successResponse(
      {
        data: data.map((item) => ({
          ...item,
          categories: item.categories.map((category: any) => category.category),
        })),
      },
      "All public products retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching all public products:", error);
    return errorResponse(
      error instanceof Error
        ? error.message
        : "Failed to fetch public products",
      500
    );
  }
}
