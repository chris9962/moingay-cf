"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { useSearchParams } from "next/navigation";
import PageTitle from "@/components/page-title";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import ScrollReveal from "@/components/scroll-reveal";
import ProductDetailModal from "@/components/product-detail-modal";
import { useProductStore } from "@/lib/product-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
const HIDE_CATEGORIES_ID = [4, 7, 8, 9];
const SORT_CATEGORIES_ID = [3, 11, 12, 10];
export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(initialSearch);

  const {
    products,
    categories,
    loading,
    error,
    selectedProduct,
    fetchCategories,
    setSelectedProduct,
    getAllPublicProducts,
    isFechedAllProducts,
  } = useProductStore();
  const [categorySelected, setCategorySelected] = useState<number | null>(null);
  // Debounce search value
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const filteredCategories = useMemo(() => {
    const c = categories.filter(
      (category) => !HIDE_CATEGORIES_ID.includes(category.id)
    );
    return c.sort(
      (a, b) =>
        SORT_CATEGORIES_ID.indexOf(a.id) - SORT_CATEGORIES_ID.indexOf(b.id)
    );
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const p = products.filter((product) => {
      // Filter by category if selected
      if (categorySelected) {
        return product.categories?.some((c) => c.id === categorySelected);
      }

      // Filter by search term
      if (debouncedSearchValue.trim()) {
        const searchTerm = debouncedSearchValue.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(searchTerm);
        const matchesSubtitle =
          product.subtitle?.toLowerCase().includes(searchTerm) || false;
        const matchesDescription =
          product.description?.toLowerCase().includes(searchTerm) || false;

        return matchesName || matchesSubtitle || matchesDescription;
      }

      return true;
    });
    // sort by category index
    p.sort((a, b) => {
      // Get the highest priority category for each product
      const getHighestPriorityCategory = (product: any) => {
        if (!product.categories || product.categories.length === 0) {
          return SORT_CATEGORIES_ID.length; // Products without categories go last
        }

        // Find the category with the lowest index in SORT_CATEGORIES_ID
        let minIndex = SORT_CATEGORIES_ID.length;
        for (const category of product.categories) {
          const index = SORT_CATEGORIES_ID.indexOf(category.id);
          if (index !== -1 && index < minIndex) {
            minIndex = index;
          }
        }
        return minIndex;
      };

      const aPriority = getHighestPriorityCategory(a);
      const bPriority = getHighestPriorityCategory(b);

      // Sort by priority (lower index = higher priority)
      return aPriority - bPriority;
    });
    return p;
  }, [products, categorySelected, debouncedSearchValue]);

  // Group products by categories for section display
  const productsByCategory = useMemo(() => {
    const grouped: { [categoryId: number]: any[] } = {};

    // Initialize groups for all filtered categories
    filteredCategories.forEach((category) => {
      grouped[category.id] = [];
    });

    // Add a group for products without categories or with other categories
    grouped[-1] = [];

    filteredProducts.forEach((product) => {
      if (!product.categories || product.categories.length === 0) {
        grouped[-1].push(product);
        return;
      }

      // Find the highest priority category for this product
      let assigned = false;
      for (const category of filteredCategories) {
        if (product.categories.some((c) => c.id === category.id)) {
          grouped[category.id].push(product);
          assigned = true;
          break; // Only assign to the first matching category
        }
      }

      // If product doesn't match any filtered category, put it in the "other" group
      if (!assigned) {
        grouped[-1].push(product);
      }
    });

    return grouped;
  }, [filteredProducts, filteredCategories]);

  // Create sorted category order for display based on SORT_CATEGORIES_ID
  const sortedCategoryOrder = useMemo(() => {
    const order: number[] = [];

    // Add categories in SORT_CATEGORIES_ID order
    SORT_CATEGORIES_ID.forEach((categoryId) => {
      if (filteredCategories.some((c) => c.id === categoryId)) {
        order.push(categoryId);
      }
    });

    // Add -1 for "Other Products" at the end
    order.push(-1);
    return order;
  }, [filteredCategories]);

  useEffect(() => {
    if (!isFechedAllProducts) {
      getAllPublicProducts();
      fetchCategories(false);
    }
  }, [getAllPublicProducts, fetchCategories, isFechedAllProducts]);

  // Update filters when debounced search value changes
  useEffect(() => {
    // Clear category selection when searching to show all matching products
    if (debouncedSearchValue.trim() && categorySelected) {
      setCategorySelected(null);
    }
  }, [debouncedSearchValue, categorySelected]);

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
    setCategorySelected(categoryId);
  };

  return (
    <div>
      <PageTitle title="Sản phẩm" />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-4">
            <Button
              variant={!categorySelected ? "default" : "outline"}
              onClick={() => handleCategoryChange(null)}
              className={`whitespace-nowrap ${
                !categorySelected ? "text-white" : ""
              }`}
            >
              All Products
            </Button>
            {filteredCategories.map((category) => (
              <Button
                key={category.id}
                variant={
                  categorySelected === category.id ? "default" : "outline"
                }
                onClick={() => handleCategoryChange(category.id)}
                className={`whitespace-nowrap ${
                  categorySelected === category.id ? "text-white" : ""
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>

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
        </div>

        {loading || !isFechedAllProducts ? (
          <ProductGridSkeleton />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500">No products found</div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">
                  {debouncedSearchValue.trim()
                    ? `No products found for "${debouncedSearchValue}"`
                    : "No products available"}
                </p>
                {debouncedSearchValue.trim() && (
                  <button
                    onClick={() => setSearchValue("")}
                    className="text-primary hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                {sortedCategoryOrder.map((categoryId) => {
                  const categoryProducts = productsByCategory[categoryId] || [];
                  if (categoryProducts.length === 0) return null;

                  const categoryName =
                    categoryId === -1
                      ? "Other Products"
                      : filteredCategories.find((c) => c.id === categoryId)
                          ?.name;

                  return (
                    <div key={categoryId} className="mb-12">
                      <h2 className="text-3xl font-bold mb-6 text-left text-gray-800">
                        {categoryName}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categoryProducts.map((product) => (
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
                                <p className="text-gray-600 mb-2">
                                  {product.subtitle}
                                </p>
                                <p className="text-primary font-bold price-text">
                                  {product.price.toLocaleString("vi-VN")}đ
                                </p>
                              </div>
                            </div>
                          </ScrollReveal>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
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
