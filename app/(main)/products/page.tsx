"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import PageTitle from "@/components/page-title";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import ScrollReveal from "@/components/scroll-reveal";
import ProductDetailModal from "@/components/product-detail-modal";
import { useProductStore } from "@/lib/product-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const {
    products,
    categories,
    loading,
    error,
    filters,
    pagination,
    selectedProduct,
    fetchProducts,
    fetchCategories,
    setFilters,
    setPagination,
    setSelectedProduct,
  } = useProductStore();

  // Debounce search value
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Update filters when debounced search value changes
  useEffect(() => {
    setFilters({ search: debouncedSearchValue });
  }, [debouncedSearchValue, setFilters]);

  const openProductDetail = (product: (typeof products)[0]) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setFilters({ categoryIds: categoryId ? [categoryId] : undefined });
  };

  const handlePageChange = (page: number) => {
    setPagination({ page });
  };

  return (
    <div>
      <PageTitle title="PRODUCTS" />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <ScrollReveal
            direction="right"
            className="flex space-x-4 overflow-x-auto pb-2"
          >
            <Button
              variant={!filters.categoryIds?.[0] ? "default" : "outline"}
              onClick={() => handleCategoryChange(null)}
              className={`whitespace-nowrap ${
                !filters.categoryIds?.[0] ? "text-white" : ""
              }`}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  filters.categoryIds?.[0] === category.id
                    ? "default"
                    : "outline"
                }
                onClick={() => handleCategoryChange(category.id)}
                className={`whitespace-nowrap ${
                  filters.categoryIds?.[0] === category.id ? "text-white" : ""
                }`}
              >
                {category.name}
              </Button>
            ))}
          </ScrollReveal>

          <ScrollReveal
            direction="left"
            className="flex items-center space-x-4"
          >
            <div className="relative">
              <Input
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </ScrollReveal>
        </div>

        {loading ? (
          <ProductGridSkeleton />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500">No products found</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ScrollReveal key={product.id} className="h-full">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full group relative">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
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
                      <Link
                        href={`/products/${product.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        <h3 className="text-xl font-semibold mb-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mb-2">{product.subtitle}</p>
                      <p className="text-primary font-bold price-text">
                        {product.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Product Detail Modal */}
        <ProductDetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          product={selectedProduct}
        />
      </div>
    </div>
  );
}
