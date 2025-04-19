"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useProductStore } from "@/lib/product-store"
import ProductForm from "@/components/product-form"

export default function EditProductPage() {
  const params = useParams()
  const productId = Number(params.id)
  const { fetchProducts, products, loading } = useProductStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (products.length === 0) {
        await fetchProducts()
      }
      setIsLoading(false)
    }

    loadData()
  }, [fetchProducts, products.length])

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProductForm productId={productId} />
      </div>
    </div>
  )
}
