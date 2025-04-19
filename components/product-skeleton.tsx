import { Skeleton } from "@/components/ui/skeleton"

export const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-5 w-1/4" />
      </div>
    </div>
  )
}

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
    </div>
  )
}
