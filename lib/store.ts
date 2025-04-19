import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./database.types";

// Define the store state type
interface ProductState {
  // Data
  products: Product[];
  selectedProduct: Product | null;

  // UI state
  loading: boolean;
  searchTerm: string;
  selectedCategory: string;

  // Actions
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedProduct: (product: Product | null) => void;

  // Computed
  getFilteredProducts: () => Product[];

  // Async actions
  fetchProductById: (id: number) => Promise<Product | null>;
}

// Create the store with persistence
export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      selectedProduct: null,
      loading: true,
      searchTerm: "",
      selectedCategory: "all",

      // Actions
      setProducts: (products) => set({ products }),
      setLoading: (loading) => set({ loading }),
      setSearchTerm: (searchTerm) => set({ searchTerm }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      setSelectedProduct: (selectedProduct) => set({ selectedProduct }),

      // Computed values
      getFilteredProducts: () => {
        const { products, searchTerm, selectedCategory } = get();

        return products.filter((product) => {
          const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
          const matchesCategory =
            selectedCategory === "all" ||
            product.categories.some(
              (category) => category.name === selectedCategory
            );

          return matchesSearch && matchesCategory;
        });
      },

      // Async actions
      fetchProductById: async (id: number) => {
        try {
          const response = await fetch(`/api/admin/products/${id}`);
          if (!response.ok) throw new Error("Failed to fetch product");
          const { data } = await response.json();
          if (data) {
            set({ selectedProduct: data });
          }
          return data;
        } catch (error) {
          console.error("Error fetching product:", error);
          return null;
        }
      },
    }),
    {
      name: "product-storage", // name of the item in localStorage
      partialize: (state) => ({
        products: state.products,
        selectedCategory: state.selectedCategory,
      }), // only persist these fields
    }
  )
);
