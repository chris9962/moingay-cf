import type { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { validateRequest, successResponse, errorResponse } from "@/lib/api-utils"
import { productSchema } from "@/lib/validation-schemas"

// GET /api/admin/products/[id] - Get a specific product
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    return errorResponse("Invalid product ID", 400)
  }

  try {
    // Get the product with its categories
    const { data, error } = await supabaseAdmin
      .from("products")
      .select(`
        *,
        categories:product_categories(
          category:categories(*)
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return errorResponse("Product not found", 404)
      }
      throw error
    }

    // Format the response
    const formattedProduct = {
      ...data,
      categories: data.categories.map((item: any) => item.category),
    }

    return successResponse(formattedProduct, "Product retrieved successfully")
  } catch (error) {
    console.error("Error fetching product:", error)
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch product", 500)
  }
}

// PUT /api/admin/products/[id] - Update a product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    return errorResponse("Invalid product ID", 400)
  }

  // Validate request body
  const validation = await validateRequest(req, productSchema)

  if (!validation.success) {
    return errorResponse("Invalid product data", 400, validation.errors)
  }

  try {
    // Check if product exists
    const { data: existingProduct, error: checkError } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("id", id)
      .single()

    if (checkError) {
      if (checkError.code === "PGRST116") {
        return errorResponse("Product not found", 404)
      }
      throw checkError
    }

    // Extract category IDs from the validated data
    const { categoryIds, ...productData } = validation.data

    // Update the product
    const { data, error } = await supabaseAdmin.from("products").update(productData).eq("id", id).select().single()

    if (error) throw error

    // If categories are provided, update the relationships
    if (categoryIds !== undefined) {
      // First, delete existing relationships
      const { error: deleteError } = await supabaseAdmin.from("product_categories").delete().eq("product_id", id)

      if (deleteError) throw deleteError

      // Then, create new relationships
      if (categoryIds && categoryIds.length > 0) {
        const productCategories = categoryIds.map((categoryId) => ({
          product_id: id,
          category_id: categoryId,
        }))

        const { error: insertError } = await supabaseAdmin.from("product_categories").insert(productCategories)

        if (insertError) throw insertError
      }
    }

    // Get the updated product with its categories
    const { data: productWithCategories, error: fetchError } = await supabaseAdmin
      .from("products")
      .select(`
        *,
        categories:product_categories(
          category:categories(*)
        )
      `)
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    // Format the response
    const formattedProduct = {
      ...productWithCategories,
      categories: productWithCategories.categories.map((item: any) => item.category),
    }

    return successResponse(formattedProduct, "Product updated successfully")
  } catch (error) {
    console.error("Error updating product:", error)
    return errorResponse(error instanceof Error ? error.message : "Failed to update product", 500)
  }
}

// DELETE /api/admin/products/[id] - Delete a product
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    return errorResponse("Invalid product ID", 400)
  }

  try {
    // Check if product exists
    const { data: existingProduct, error: checkError } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("id", id)
      .single()

    if (checkError) {
      if (checkError.code === "PGRST116") {
        return errorResponse("Product not found", 404)
      }
      throw checkError
    }

    // Delete the product (cascade will handle relationships)
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id)

    if (error) throw error

    return successResponse(null, "Product deleted successfully")
  } catch (error) {
    console.error("Error deleting product:", error)
    return errorResponse(error instanceof Error ? error.message : "Failed to delete product", 500)
  }
}
