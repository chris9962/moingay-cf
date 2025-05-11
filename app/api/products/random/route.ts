import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    // Categories we want to get products from
    const targetCategories = [3, 9, 7, 4, 8];

    // Get one random product from each category
    const products = await Promise.all(
      targetCategories.map(async (categoryId) => {
        try {
          // First get a random product ID from the category
          const { data: productIds, error: idError } = await supabaseAdmin
            .from("product_categories")
            .select("product_id")
            .eq("category_id", categoryId);

          if (idError) throw idError;

          if (!productIds || productIds.length === 0) {
            console.log(`No product found for category ${categoryId}`);
            return null;
          }

          // Get a random product ID from the results
          const randomIndex = Math.floor(Math.random() * productIds.length);
          const randomProductId = productIds[randomIndex].product_id;

          // Get the full product details with its categories
          const { data: productData, error: productError } = await supabaseAdmin
            .from("products")
            .select(
              `
              *,
              categories:product_categories(
                category:categories(*)
              )
            `
            )
            .eq("id", randomProductId)
            .eq("status", "public")
            .not("image", "is", null)
            .single();

          if (productError) throw productError;

          if (!productData) {
            console.log(`Product ${randomProductId} not found or not valid`);
            return null;
          }

          // Format the response
          return {
            ...productData,
            categories: productData.categories.map(
              (item: any) => item.category
            ),
          };
        } catch (queryError) {
          console.error(
            `Error fetching product for category ${categoryId}:`,
            queryError
          );
          return null;
        }
      })
    );

    // Filter out any null results (in case a category has no products)
    const validProducts = products.filter(Boolean);

    if (validProducts.length === 0) {
      return successResponse(
        [],
        "No products found for the specified categories"
      );
    }

    return successResponse(
      validProducts,
      "Random products retrieved successfully"
    );
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
