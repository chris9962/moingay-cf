import { supabase } from "./supabase"
import type { Category, Product, ProductWithCategories } from "./database.types"

export interface ProductFilterOptions {
  search?: string
  minPrice?: number
  maxPrice?: number
  categoryIds?: number[]
  status?: "public" | "draft" | "all"
}

export interface PaginationOptions {
  page: number
  pageSize: number
}

export class Queries {
  // Category queries
  static async getCategories() {
    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) throw error
    return data as Category[]
  }

  static async getCategoryById(id: number) {
    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single()

    if (error) throw error
    return data as Category
  }

  static async createCategory(name: string) {
    const { data, error } = await supabase.from("categories").insert({ name }).select().single()

    if (error) throw error
    return data as Category
  }

  static async updateCategory(id: number, name: string) {
    const { data, error } = await supabase.from("categories").update({ name }).eq("id", id).select().single()

    if (error) throw error
    return data as Category
  }

  static async deleteCategory(id: number) {
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) throw error
    return true
  }

  // Product queries
  static async getProducts(
    filters: ProductFilterOptions = {},
    pagination: PaginationOptions = { page: 1, pageSize: 10 },
  ) {
    const { page, pageSize } = pagination
    const offset = (page - 1) * pageSize

    let query = supabase.from("products").select("*, product_categories(category_id)")

    // Apply filters
    if (filters.search) {
      query = query.ilike("name", `%${filters.search}%`)
    }

    if (filters.minPrice !== undefined) {
      query = query.gte("price", filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte("price", filters.maxPrice)
    }

    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status)
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })

    if (countError) throw countError

    // Get paginated results
    const { data, error } = await query.order("created_at", { ascending: false }).range(offset, offset + pageSize - 1)

    if (error) throw error

    // Process the data to include categories
    const productIds = data.map((product) => product.id)

    // Get categories for these products
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("product_categories")
      .select("product_id, categories(*)")
      .in("product_id", productIds)
      .order("product_id")

    if (categoriesError) throw categoriesError

    // Group categories by product_id
    const categoriesByProductId: Record<number, Category[]> = {}
    categoriesData.forEach((item) => {
      const productId = item.product_id
      if (!categoriesByProductId[productId]) {
        categoriesByProductId[productId] = []
      }
      categoriesByProductId[productId].push(item.categories)
    })

    // Merge products with their categories
    const productsWithCategories = data.map((product) => ({
      ...product,
      categories: categoriesByProductId[product.id] || [],
    }))

    return {
      data: productsWithCategories as ProductWithCategories[],
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    }
  }

  static async getProductById(id: number) {
    // Get the product
    const { data: product, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) throw error

    // Get the product's categories
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("product_categories")
      .select("categories(*)")
      .eq("product_id", id)

    if (categoriesError) throw categoriesError

    const categories = categoriesData.map((item) => item.categories)

    return {
      ...product,
      categories,
    } as ProductWithCategories
  }

  static async createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">, categoryIds: number[]) {
    // Start a transaction
    const { data, error } = await supabase.from("products").insert(product).select().single()

    if (error) throw error

    // Insert product-category relationships
    if (categoryIds.length > 0) {
      const productCategories = categoryIds.map((categoryId) => ({
        product_id: data.id,
        category_id: categoryId,
      }))

      const { error: relationError } = await supabase.from("product_categories").insert(productCategories)

      if (relationError) throw relationError
    }

    return await this.getProductById(data.id)
  }

  static async updateProduct(
    id: number,
    product: Partial<Omit<Product, "id" | "created_at" | "updated_at">>,
    categoryIds?: number[],
  ) {
    // Update product
    const { error } = await supabase.from("products").update(product).eq("id", id)

    if (error) throw error

    // Update categories if provided
    if (categoryIds !== undefined) {
      // Delete existing relationships
      const { error: deleteError } = await supabase.from("product_categories").delete().eq("product_id", id)

      if (deleteError) throw deleteError

      // Insert new relationships
      if (categoryIds.length > 0) {
        const productCategories = categoryIds.map((categoryId) => ({
          product_id: id,
          category_id: categoryId,
        }))

        const { error: insertError } = await supabase.from("product_categories").insert(productCategories)

        if (insertError) throw insertError
      }
    }

    return await this.getProductById(id)
  }

  static async deleteProduct(id: number) {
    // Delete product (cascade will handle relationships)
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) throw error
    return true
  }
}
