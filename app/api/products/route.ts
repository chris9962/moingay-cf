import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { successResponse, errorResponse } from "@/lib/api-utils";
import {
  paginationSchema,
  productFilterSchema,
} from "@/lib/validation-schemas";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const page = Number.parseInt(url.searchParams.get("page") || "1");
    const pageSize = Number.parseInt(url.searchParams.get("pageSize") || "10");

    const paginationResult = paginationSchema.safeParse({ page, pageSize });
    if (!paginationResult.success) {
      return errorResponse("Invalid pagination parameters", 400);
    }

    const { page: validPage, pageSize: validPageSize } = paginationResult.data;
    const offset = (validPage - 1) * validPageSize;

    const search = url.searchParams.get("search") || undefined;
    const minPrice = url.searchParams.get("minPrice")
      ? Number.parseInt(url.searchParams.get("minPrice") || "0")
      : undefined;
    const maxPrice = url.searchParams.get("maxPrice")
      ? Number.parseInt(url.searchParams.get("maxPrice") || "0")
      : undefined;
    const status =
      (url.searchParams.get("status") as
        | "public"
        | "draft"
        | "all"
        | undefined) || undefined;
    const categoryIds = url.searchParams.get("categoryIds")
      ? url.searchParams
          .get("categoryIds")
          ?.split(",")
          .map((id) => Number.parseInt(id))
      : undefined;

    const filterResult = productFilterSchema.safeParse({
      search,
      minPrice,
      maxPrice,
      status,
      categoryIds,
    });

    if (!filterResult.success) {
      return errorResponse("Invalid filter parameters", 400);
    }

    // STEP 1: Lấy product_ids theo category (nếu có)
    let categoryProductIds: number[] | undefined = undefined;

    if (categoryIds && categoryIds.length > 0) {
      const { data: productCategoryLinks, error: catErr } = await supabaseAdmin
        .from("product_categories")
        .select("product_id")
        .in("category_id", categoryIds);

      if (catErr) throw catErr;

      categoryProductIds = [
        ...new Set(productCategoryLinks.map((pc) => pc.product_id)),
      ];

      // Nếu không có sản phẩm nào thỏa điều kiện category → trả rỗng
      if (categoryProductIds.length === 0) {
        return successResponse(
          {
            data: [],
            pagination: {
              page: validPage,
              pageSize: validPageSize,
              totalCount: 0,
              totalPages: 0,
            },
          },
          "No products found with selected categories"
        );
      }
    }

    // STEP 2: Query product + filter
    let query = supabaseAdmin.from("products").select("*", { count: "exact" });

    if (categoryProductIds) {
      query = query.in("id", categoryProductIds);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // STEP 3: Pagination
    query = query
      .range(offset, offset + validPageSize - 1)
      .order("created_at", { ascending: false });

    const { data: _data, error, count } = await query;
    let data = _data || [];

    if (error) throw error;

    // STEP 4: Lấy danh mục của từng product
    const productIds = data.map((p) => p.id);

    if (productIds.length > 0) {
      const { data: productCategoriesData, error: pcError } =
        await supabaseAdmin
          .from("product_categories")
          .select("product_id, categories(*)")
          .in("product_id", productIds);

      if (pcError) throw pcError;

      const categoriesByProductId: Record<number, any[]> = {};
      productCategoriesData.forEach((item) => {
        if (!categoriesByProductId[item.product_id]) {
          categoriesByProductId[item.product_id] = [];
        }
        categoriesByProductId[item.product_id].push(item.categories);
      });

      data.forEach((product) => {
        product.categories = categoriesByProductId[product.id] || [];
      });
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / validPageSize);

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
      "Products retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch products",
      500
    );
  }
}
