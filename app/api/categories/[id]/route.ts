import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/api-utils";

// GET /api/admin/categories/[id] - Get a specific category
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number.parseInt(params.id);

  if (isNaN(id)) {
    return errorResponse("Invalid category ID", 400);
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return errorResponse("Category not found", 404);
      }
      throw error;
    }

    return successResponse(data, "Category retrieved successfully");
  } catch (error) {
    console.error("Error fetching category:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch category",
      500
    );
  }
}
