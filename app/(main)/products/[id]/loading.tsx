import { Skeleton } from "@/components/ui/skeleton"
import PageTitle from "@/components/page-title"
import { ArrowLeft } from "lucide-react"

export default function Loading() {
  return (
    <div>
      <PageTitle title="Product Detail" />

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center text-gray-600 mb-8">
          <ArrowLeft size={20} className="mr-2" />
          <span>Back to Products</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div>
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-6" />
            <Skeleton className="h-32 w-full mb-4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
