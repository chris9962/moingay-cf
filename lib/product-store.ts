import { create } from "zustand";
import type { ProductWithCategories, Category } from "./database.types";
import { useToastStore } from "./toast-store";

interface ProductState {
  // Data
  products: ProductWithCategories[];
  categories: Category[];
  selectedProduct: ProductWithCategories | null;

  // UI state
  loading: boolean;
  error: string | null;
  filters: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryIds?: number[];
    status?: "public" | "draft" | "all";
  };
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  viewMode: "grid" | "table";

  // Actions
  fetchProducts: (isUseAdminApi?: boolean) => Promise<void>;
  fetchProductById: (id: number, isUseAdminApi?: boolean) => Promise<void>;
  fetchCategories: (isUseAdminApi?: boolean) => Promise<void>;
  setFilters: (filters: Partial<ProductState["filters"]>) => void;
  setPagination: (
    pagination: Partial<{ page: number; pageSize: number }>
  ) => void;
  setViewMode: (mode: "grid" | "table") => void;
  setSelectedProduct: (product: ProductWithCategories | null) => void;

  // CRUD operations
  createProduct: (
    product: Omit<
      ProductWithCategories,
      "id" | "created_at" | "updated_at" | "categories"
    >,
    categoryIds: number[]
  ) => Promise<void>;
  updateProduct: (
    id: number,
    product: Partial<
      Omit<
        ProductWithCategories,
        "id" | "created_at" | "updated_at" | "categories"
      >
    >,
    categoryIds?: number[]
  ) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  createCategory: (name: string) => Promise<void>;
  updateCategory: (id: number, name: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state
  products: [],
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    status: "all",
  },
  pagination: {
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  },
  viewMode: "grid",

  // Actions
  fetchProducts: async (isUseAdminApi = false) => {
    set({ loading: true, error: null });
    try {
      const { filters, pagination } = get();

      // Build query string
      const queryParams = new URLSearchParams();
      queryParams.append("page", pagination.page.toString());
      queryParams.append("pageSize", pagination.pageSize.toString());

      if (filters.search) {
        queryParams.append("search", filters.search);
      }

      if (filters.minPrice !== undefined) {
        queryParams.append("minPrice", filters.minPrice.toString());
      }

      if (filters.maxPrice !== undefined) {
        queryParams.append("maxPrice", filters.maxPrice.toString());
      }

      if (filters.status) {
        queryParams.append("status", filters.status);
      }

      if (filters.categoryIds && filters.categoryIds.length > 0) {
        queryParams.append("categoryIds", filters.categoryIds.join(","));
      }

      // Fetch products from API
      const response = await fetch(
        isUseAdminApi
          ? `/api/admin/products?${queryParams.toString()}`
          : `/api/products?${queryParams.toString()}`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch products");
      }

      set({
        products: result.data.data,
        pagination: result.data.pagination,
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch products";
      set({
        loading: false,
        error: errorMessage,
      });

      // Show error toast
      useToastStore.getState().addToast({
        type: "error",
        message: errorMessage,
      });
    }
  },

  fetchProductById: async (id: number, isUseAdminApi = true) => {
    set({ loading: true, error: null });
    try {
      const response = isUseAdminApi
        ? await fetch(`/api/admin/products/${id}`)
        : await fetch(`/api/products/${id}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch product");
      }

      set({
        selectedProduct: result.data,
        loading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch product";
      set({
        loading: false,
        error: errorMessage,
      });

      // Show error toast
      useToastStore.getState().addToast({
        type: "error",
        message: errorMessage,
      });
    }
  },

  fetchCategories: async (isUseAdminApi = true) => {
    try {
      const response = isUseAdminApi
        ? await fetch("/api/admin/categories")
        : await fetch("/api/categories");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch categories");
      }

      set({ categories: result.data });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch categories";
      set({
        error: errorMessage,
      });

      // Show error toast
      useToastStore.getState().addToast({
        type: "error",
        message: errorMessage,
      });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }, // Reset to first page when filters change
    }));
    get().fetchProducts();
  },

  setPagination: (newPagination) => {
    set((state) => ({
      pagination: { ...state.pagination, ...newPagination },
    }));
    get().fetchProducts();
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  setSelectedProduct: (product) => {
    set({ selectedProduct: product });
  },

  // CRUD operations
  createProduct: async (product, categoryIds) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...product, categoryIds }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create product");
      }

      await get().fetchProducts();
      set({ loading: false });

      // Show success toast
      useToastStore.getState().addToast({
        type: "success",
        message: "Sản phẩm đã được tạo thành công",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";
      set({
        loading: false,
        error: errorMessage,
      });

      // Show error toast
      useToastStore.getState().addToast({
        type: "error",
        message: `Lỗi khi tạo sản phẩm: ${errorMessage}`,
      });
    }
  },

  updateProduct: async (id, product, categoryIds) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...product, categoryIds }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update product");
      }

      await get().fetchProducts();
      set({ loading: false });

      // Show success toast
      useToastStore.getState().addToast({
        type: "success",
        message: "Sản phẩm đã được cập nhật thành công",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";
      set({
        loading: false,
        error: errorMessage,
      });

      // Show error toast
      useToastStore.getState().addToast({
        type: "error",
        message: `Lỗi khi cập nhật sản phẩm: ${errorMessage}`,
      });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete product");
      }

      await get().fetchProducts();
      set({ loading: false });

      // Show success toast
      useToastStore.getState().addToast({
        type: "success",
        message: "Sản phẩm đã được xóa thành công",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete product";
      set({
        loading: false,
        error: errorMessage,
      });

      // Show error toast
      useToastStore.getState().addToast({
        type: "error",
        message: `Lỗi khi xóa sản phẩm: ${errorMessage}`,
      });
    }
  },

  createCategory: async (name) => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create category");
      }

      await get().fetchCategories();

      // Show success toast
      useToastStore.getState().addToast({
        type: "success",
        message: "Danh mục đã được tạo thành công",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create category";
      set({
        error: errorMessage,
      });

      // Show error toast
      useToastStore.getState().addToast({
        type: "error",
        message: `Lỗi khi tạo danh mục: ${errorMessage}`,
      });
    }
  },

  updateCategory: async (id, name) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update category");
      }

      await get().fetchCategories();

      // Show success toast
      useToastStore.getState().addToast({
        type: "success",
        message: "Danh mục đã được cập nhật thành công",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update category";
      set({
        error: errorMessage,
      });

      // Show error toast
      useToastStore.getState().addToast({
        type: "error",
        message: `Lỗi khi cập nhật danh mục: ${errorMessage}`,
      });
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete category");
      }

      await get().fetchCategories();

      // Show success toast
      useToastStore.getState().addToast({
        type: "success",
        message: "Danh mục đã được xóa thành công",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete category";
      set({
        error: errorMessage,
      });

      // Show error toast
      useToastStore.getState().addToast({
        type: "error",
        message: `Lỗi khi xóa danh mục: ${errorMessage}`,
      });
    }
  },
}));
