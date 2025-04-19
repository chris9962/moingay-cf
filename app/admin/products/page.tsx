"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useProductStore } from "@/lib/product-store"
import { Plus, Edit, Trash2, Eye, Grid, List, Search } from "lucide-react"
import QRCodeGenerator from "@/components/qr-code-generator"

export default function ProductsPage() {
  const {
    products,
    loading,
    fetchProducts,
    fetchCategories,
    filters,
    pagination,
    setFilters,
    setPagination,
    viewMode,
    setViewMode,
    deleteProduct,
  } = useProductStore()

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadData = async () => {
      await fetchCategories()
      await fetchProducts()
    }
    loadData()
  }, [fetchProducts, fetchCategories])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ search: searchTerm })
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id)
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const handlePageChange = (page: number) => {
    setPagination({ page })
  }

  const handleStatusFilter = (status: "all" | "public" | "draft") => {
    setFilters({ status })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="bg-primary text-white px-4 py-2 rounded-md flex items-center">
          <Plus size={18} className="mr-1" /> Add Product
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary focus:border-primary"
            />
            <button type="submit" className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <Search size={18} />
            </button>
          </div>
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90">
            Search
          </button>
        </form>

        <div className="flex items-center space-x-2">
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => handleStatusFilter("all")}
              className={`px-3 py-1 ${filters.status === "all" ? "bg-primary text-white" : "bg-white text-gray-700"}`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter("public")}
              className={`px-3 py-1 ${filters.status === "public" ? "bg-primary text-white" : "bg-white text-gray-700"}`}
            >
              Public
            </button>
            <button
              onClick={() => handleStatusFilter("draft")}
              className={`px-3 py-1 ${filters.status === "draft" ? "bg-primary text-white" : "bg-white text-gray-700"}`}
            >
              Draft
            </button>
          </div>

          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 ${viewMode === "grid" ? "bg-primary text-white" : "bg-white text-gray-700"}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 ${viewMode === "table" ? "bg-primary text-white" : "bg-white text-gray-700"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          No products found. Add your first product!
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                {product.image ? (
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium">
                  {product.status}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{product.subtitle || "No subtitle"}</p>
                <p className="text-primary font-bold price-text mb-4">{product.price.toLocaleString("vi-VN")}đ</p>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Link href={`/admin/products/${product.id}`} className="text-blue-600 hover:text-blue-900">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                    <Link
                      href={`/products/${product.id}`}
                      target="_blank"
                      className="text-green-600 hover:text-green-900"
                    >
                      <Eye size={18} />
                    </Link>
                  </div>

                  <QRCodeGenerator productId={product.id} productName={product.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categories
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {product.image ? (
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No img</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.subtitle || "No subtitle"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 price-text">{product.price.toLocaleString("vi-VN")}đ</div>
                    {product.discount_price && (
                      <div className="text-sm text-gray-500 line-through price-text">
                        {product.discount_price.toLocaleString("vi-VN")}đ
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === "public" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.categories.length > 0
                      ? product.categories.map((cat) => cat.name).join(", ")
                      : "No categories"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <Link href={`/admin/products/${product.id}`} className="text-blue-600 hover:text-blue-900">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        className="text-green-600 hover:text-green-900"
                      >
                        <Eye size={18} />
                      </Link>
                      <QRCodeGenerator productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  pagination.page === page ? "bg-primary text-white" : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}
