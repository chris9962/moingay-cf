import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  validateRequest,
  successResponse,
  errorResponse,
} from "@/lib/api-utils";
import { categorySchema } from "@/lib/validation-schemas";

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("name");

    if (error) throw error;

    return successResponse(data, "Categories retrieved successfully");
  } catch (error) {
    console.error("Error fetching categories:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch categories",
      500
    );
  }
}

export async function POST(req: NextRequest) {
  // Validate request body
  const validation = await validateRequest(req, categorySchema);

  if (!validation.success) {
    return errorResponse("Invalid category data", 400, validation.errors);
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .insert(validation.data)
      .select()
      .single();

    if (error) throw error;

    return successResponse(data, "Category created successfully", 201);
  } catch (error) {
    console.error("Error creating category:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to create category",
      500
    );
  }
}
