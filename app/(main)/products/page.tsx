"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Eye } from "lucide-react"
import PageTitle from "@/components/page-title"
import { ProductGridSkeleton } from "@/components/product-skeleton"
import ScrollReveal from "@/components/scroll-reveal"
import ProductDetailModal from "@/components/product-detail-modal"
import { useProductStore } from "@/lib/store"

const categories = [
  { id: "all", name: "All Products" },
  { id: "drinks", name: "Drinks" },
  { id: "desserts", name: "Desserts" },
  { id: "pastries", name: "Pastries" },
]

export default function Products() {
  // Local state for modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get state and actions from the store
  const {
    loading,
    setLoading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedProduct,
    setSelectedProduct,
    getFilteredProducts,
  } = useProductStore()

  // Get filtered products from the store
  const filteredProducts = getFilteredProducts()

  useEffect(() => {
    // If we already have products, don't show loading state
    if (filteredProducts.length > 0) {
      setLoading(false)
      return
    }

    // Simulate loading delay for first load
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [filteredProducts.length, setLoading])

  const openProductDetail = (product: (typeof filteredProducts)[0]) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    // We don't clear selectedProduct immediately to allow the exit animation to complete
  }

  return (
    <div>
      <PageTitle title="PRODUCTS" />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <ScrollReveal direction="right" className="flex space-x-4 mb-4 md:mb-0 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } rounded-full transition-colors`}
              >
                {category.name}
              </button>
            ))}
          </ScrollReveal>

          <ScrollReveal direction="left" className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </ScrollReveal>
        </div>

        {loading ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ScrollReveal key={product.id} className="h-full">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full group relative">
                  <div className="relative aspect-square">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => openProductDetail(product)}
                        className="bg-white p-3 rounded-full transform scale-75 group-hover:scale-100 transition-transform"
                        aria-label={`View details for ${product.name}`}
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                      <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                    </Link>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <p className="text-primary font-bold price-text">{product.price.toLocaleString("vi-VN")}đ</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      <ProductDetailModal isOpen={isModalOpen} onClose={closeModal} product={selectedProduct} />
    </div>
  )
}
