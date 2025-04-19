import type { NextRequest } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { validateRequest, successResponse, errorResponse } from "@/lib/api-utils"
import { productSchema, paginationSchema, productFilterSchema } from "@/lib/validation-schemas"

// GET /api/admin/products - Get all products with pagination and filtering
export async function GET(req: NextRequest) {
  try {
    // Parse query parameters
    const url = new URL(req.url)

    // Pagination
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const pageSize = Number.parseInt(url.searchParams.get("pageSize") || "10")

    // Validate pagination parameters
    const paginationResult = paginationSchema.safeParse({ page, pageSize })
    if (!paginationResult.success) {
      return errorResponse("Invalid pagination parameters", 400)
    }

    const { page: validPage, pageSize: validPageSize } = paginationResult.data
    const offset = (validPage - 1) * validPageSize

    // Filtering
    const search = url.searchParams.get("search") || undefined
    const minPrice = url.searchParams.get("minPrice")
      ? Number.parseInt(url.searchParams.get("minPrice") || "0")
      : undefined
    const maxPrice = url.searchParams.get("maxPrice")
      ? Number.parseInt(url.searchParams.get("maxPrice") || "0")
      : undefined
    const status = (url.searchParams.get("status") as "public" | "draft" | "all" | undefined) || undefined
    const categoryIds = url.searchParams.get("categoryIds")
      ? url.searchParams
          .get("categoryIds")
          ?.split(",")
          .map((id) => Number.parseInt(id))
      : undefined

    // Validate filter parameters
    const filterResult = productFilterSchema.safeParse({
      search,
      minPrice,
      maxPrice,
      status,
      categoryIds,
    })

    if (!filterResult.success) {
      return errorResponse("Invalid filter parameters", 400)
    }

    // Build the query
    let query = supabaseAdmin.from("products").select("*", { count: "exact" })

    // Apply filters
    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    if (minPrice !== undefined) {
      query = query.gte("price", minPrice)
    }

    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    // Apply pagination
    query = query.range(offset, offset + validPageSize - 1).order("created_at", { ascending: false })

    // Execute the query
    const { data, error, count } = await query

    if (error) throw error

    // If category filtering is requested, we need to fetch the product-category relationships
    if (categoryIds && categoryIds.length > 0) {
      // Get all product IDs
      const productIds = data.map((product) => product.id)

      // Get product-category relationships
      const { data: productCategories, error: relError } = await supabaseAdmin
        .from("product_categories")
        .select("product_id, category_id")
        .in("product_id", productIds)

      if (relError) throw relError

      // Filter products that have at least one of the requested categories
      const filteredProductIds = productCategories
        .filter((pc) => categoryIds.includes(pc.category_id))
        .map((pc) => pc.product_id)

      // Filter the products
      data.filter((product) => filteredProductIds.includes(product.id))
    }

    // Get categories for each product
    const productIds = data.map((product) => product.id)

    if (productIds.length > 0) {
      const { data: productCategoriesData, error: pcError } = await supabaseAdmin
        .from("product_categories")
        .select("product_id, categories(*)")
        .in("product_id", productIds)

      if (pcError) throw pcError

      // Group categories by product_id
      const categoriesByProductId: Record<number, any[]> = {}
      productCategoriesData.forEach((item) => {
        if (!categoriesByProductId[item.product_id]) {
          categoriesByProductId[item.product_id] = []
        }
        categoriesByProductId[item.product_id].push(item.categories)
      })

      // Add categories to each product
      data.forEach((product) => {
        product.categories = categoriesByProductId[product.id] || []
      })
    }

    // Calculate pagination info
    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / validPageSize)

    return successResponse(
      {
        data,
        pagination: {
          page: validPage,
          pageSize: validPageSize,
          totalCount,
          totalPages,
        },
      },
      "Products retrieved successfully",
    )
  } catch (error) {
    console.error("Error fetching products:", error)
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch products", 500)
  }
}

// POST /api/admin/products - Create a new product
export async function POST(req: NextRequest) {
  // Validate request body
  const validation = await validateRequest(req, productSchema)

  if (!validation.success) {
    return errorResponse("Invalid product data", 400, validation.errors)
  }

  try {
    // Extract category IDs from the validated data
    const { categoryIds, ...productData } = validation.data

    // Start a transaction by using a single connection
    const { data, error } = await supabaseAdmin.from("products").insert(productData).select().single()

    if (error) throw error

    // If categories are provided, create the relationships
    if (categoryIds && categoryIds.length > 0) {
      const productCategories = categoryIds.map((categoryId) => ({
        product_id: data.id,
        category_id: categoryId,
      }))

      const { error: relError } = await supabaseAdmin.from("product_categories").insert(productCategories)

      if (relError) throw relError
    }

    // Get the product with its categories
    const { data: productWithCategories, error: fetchError } = await supabaseAdmin
      .from("products")
      .select(`
        *,
        categories:product_categories(
          category:categories(*)
        )
      `)
      .eq("id", data.id)
      .single()

    if (fetchError) throw fetchError

    // Format the response
    const formattedProduct = {
      ...productWithCategories,
      categories: productWithCategories.categories.map((item: any) => item.category),
    }

    return successResponse(formattedProduct, "Product created successfully", 201)
  } catch (error) {
    console.error("Error creating product:", error)
    return errorResponse(error instanceof Error ? error.message : "Failed to create product", 500)
  }
}
