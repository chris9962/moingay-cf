import { z } from "zod"

// Category validation schema
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(255, "Category name is too long"),
})

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255, "Product name is too long"),
  subtitle: z.string().max(255, "Subtitle is too long").nullable().optional(),
  description: z.string().nullable().optional(),
  price: z.number().positive("Price must be positive"),
  discount_price: z.number().positive("Discount price must be positive").nullable().optional(),
  status: z.enum(["public", "draft"]).default("draft"),
  image: z.string().nullable().optional(),
  categoryIds: z.array(z.number()).optional(),
})

// Pagination and filter schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
})

export const productFilterSchema = z.object({
  search: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  categoryIds: z.array(z.number()).optional(),
  status: z.enum(["public", "draft", "all"]).optional(),
})
