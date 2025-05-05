import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  validateRequest,
  successResponse,
  errorResponse,
} from "@/lib/api-utils";
import { categorySchema } from "@/lib/validation-schemas";

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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number.parseInt(params.id);

  if (isNaN(id)) {
    return errorResponse("Invalid category ID", 400);
  }

  // Validate request body
  const validation = await validateRequest(req, categorySchema);

  if (!validation.success) {
    return errorResponse("Invalid category data", 400, validation.errors);
  }

  try {
    // Check if category exists
    const { data: existingCategory, error: checkError } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === "PGRST116") {
        return errorResponse("Category not found", 404);
      }
      throw checkError;
    }

    // Update the category
    const { data, error } = await supabaseAdmin
      .from("categories")
      .update(validation.data)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return successResponse(data, "Category updated successfully");
  } catch (error) {
    console.error("Error updating category:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to update category",
      500
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number.parseInt(params.id);

  if (isNaN(id)) {
    return errorResponse("Invalid category ID", 400);
  }

  try {
    // Check if category exists
    const { data: existingCategory, error: checkError } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === "PGRST116") {
        return errorResponse("Category not found", 404);
      }
      throw checkError;
    }

    // Delete the category
    const { error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return successResponse(null, "Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to delete category",
      500
    );
  }
}
