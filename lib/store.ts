import { create } from "zustand"
import { persist } from "zustand/middleware"
import { products as initialProducts, fetchProductById } from "./product-data"

// Define the store state type
interface ProductState {
  // Data
  products: typeof initialProducts
  selectedProduct: (typeof initialProducts)[0] | null

  // UI state
  loading: boolean
  searchTerm: string
  selectedCategory: string

  // Actions
  setProducts: (products: typeof initialProducts) => void
  setLoading: (loading: boolean) => void
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  setSelectedProduct: (product: (typeof initialProducts)[0] | null) => void

  // Computed
  getFilteredProducts: () => typeof initialProducts

  // Async actions
  fetchProductById: (id: number) => Promise<(typeof initialProducts)[0] | null>
}

// Create the store with persistence
export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      // Initial state
      products: initialProducts,
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
        const { products, searchTerm, selectedCategory } = get()

        return products.filter((product) => {
          const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

          return matchesSearch && matchesCategory
        })
      },

      // Async actions
      fetchProductById: async (id: number) => {
        const { products } = get()

        // First check if we already have the product in our store
        const cachedProduct = products.find((product) => product.id === id)
        if (cachedProduct) {
          set({ selectedProduct: cachedProduct })
          return cachedProduct
        }

        // If not, fetch it from the API
        try {
          const product = await fetchProductById(id)
          if (product) {
            set({ selectedProduct: product })
          }
          return product
        } catch (error) {
          console.error("Error fetching product:", error)
          return null
        }
      },
    }),
    {
      name: "product-storage", // name of the item in localStorage
      partialize: (state) => ({
        products: state.products,
        selectedCategory: state.selectedCategory,
      }), // only persist these fields
    },
  ),
)
