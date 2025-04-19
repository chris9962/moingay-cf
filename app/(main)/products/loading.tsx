import { ProductGridSkeleton } from "@/components/product-skeleton"
import PageTitle from "@/components/page-title"

export default function Loading() {
  return (
    <div>
      <PageTitle title="PRODUCTS" />
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between mb-8">
          <div className="flex space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  )
}
