"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import PageTitle from "@/components/page-title"
import ScrollReveal from "@/components/scroll-reveal"
import { Skeleton } from "@/components/ui/skeleton"
import { useProductStore } from "@/lib/store"

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Get state and actions from the store
  const { selectedProduct, fetchProductById } = useProductStore()

  useEffect(() => {
    const getProduct = async () => {
      try {
        const productId = Number(params.id)
        if (isNaN(productId)) {
          router.push("/products")
          return
        }

        const product = await fetchProductById(productId)
        if (!product) {
          router.push("/products")
          return
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        router.push("/products")
      } finally {
        setLoading(false)
      }
    }

    getProduct()
  }, [params.id, router, fetchProductById])

  const goBack = () => {
    router.back()
  }

  return (
    <div>
      <PageTitle title={loading ? "Product Detail" : selectedProduct?.name || "Product Detail"} />

      <div className="container mx-auto px-4 py-12">
        <button onClick={goBack} className="flex items-center text-gray-600 hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </button>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/4 mb-6" />
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        ) : (
          selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ScrollReveal>
                <div className="relative aspect-square">
                  <Image
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{selectedProduct.name}</h1>
                  <p className="text-2xl font-bold text-primary mb-6 price-text">
                    {selectedProduct.price.toLocaleString("vi-VN")}đ
                  </p>

                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedProduct.detailHtml }} />

                  <div className="mt-8">
                    <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          )
        )}
      </div>
    </div>
  )
}
