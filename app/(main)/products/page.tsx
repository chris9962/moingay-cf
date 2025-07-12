"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Eye, ShoppingCart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import PageTitle from "@/components/page-title";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import ScrollReveal from "@/components/scroll-reveal";
import ProductDetailModal from "@/components/product-detail-modal";
import AddToCartModal from "@/components/add-to-cart-modal";
import { useProductStore } from "@/lib/product-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
const HIDE_CATEGORIES_ID = [4, 7, 8, 9];
const SORT_CATEGORIES_ID = [3, 11, 12, 10];
export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [selectedProductForCart, setSelectedProductForCart] =
    useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category")
    ? parseInt(searchParams.get("category")!)
    : null;
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
  const [categorySelected, setCategorySelected] = useState<number | null>(
    initialCategory
  );
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
      let matchesCategory = true;
      let matchesSearch = true;

      // Filter by category if selected
      if (categorySelected) {
        matchesCategory =
          product.categories?.some((c) => c.id === categorySelected) || false;
      }

      // Filter by search term if provided
      if (debouncedSearchValue.trim()) {
        const searchTerm = debouncedSearchValue.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(searchTerm);
        const matchesSubtitle =
          product.subtitle?.toLowerCase().includes(searchTerm) || false;
        const matchesDescription =
          product.description?.toLowerCase().includes(searchTerm) || false;

        matchesSearch = matchesName || matchesSubtitle || matchesDescription;
      }

      // Both conditions must be true (AND logic)
      return matchesCategory && matchesSearch;
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
    console.log(p);
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

  // Listen for URL parameter changes (when navigating from external links)
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    const currentCategory = searchParams.get("category")
      ? parseInt(searchParams.get("category")!)
      : null;

    // Update search value if URL param changed
    if (currentSearch !== searchValue) {
      setSearchValue(currentSearch);
    }

    // Update category selection if URL param changed
    if (currentCategory !== categorySelected) {
      setCategorySelected(currentCategory);
    }
  }, [searchParams]);

  // Update filters when debounced search value changes
  useEffect(() => {
    // Allow both search and category filters to work together
    // No need to clear category when searching
  }, [debouncedSearchValue, categorySelected]);

  const openProductDetail = (product: (typeof products)[0]) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: (typeof products)[0]) => {
    setSelectedProductForCart(product);
    setIsAddToCartModalOpen(true);
  };

  const closeAddToCartModal = () => {
    setIsAddToCartModalOpen(false);
    setSelectedProductForCart(null);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    updateURLParams(value, categorySelected);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setCategorySelected(categoryId);
    updateURLParams(searchValue, categoryId);
  };

  // Function to update URL parameters
  const updateURLParams = (search: string, category: number | null) => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (category !== null) {
      params.set("category", category.toString());
    }

    const paramString = params.toString();
    const newURL = paramString ? `?${paramString}` : window.location.pathname;

    router.push(newURL, { scroll: false });
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
              Tất cả sản phẩm
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
              placeholder="Tìm kiếm sản phẩm..."
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
                    onClick={() => {
                      setSearchValue("");
                      updateURLParams("", categorySelected);
                    }}
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
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => openProductDetail(product)}
                                      className="bg-white p-3 rounded-full transform scale-75 group-hover:scale-100 transition-transform"
                                      aria-label={`View details for ${product.name}`}
                                    >
                                      <Eye size={20} />
                                    </button>
                                    <button
                                      onClick={() => handleAddToCart(product)}
                                      className="bg-primary text-white p-3 rounded-full transform scale-75 group-hover:scale-100 transition-transform"
                                      aria-label={`Add ${product.name} to cart`}
                                    >
                                      <ShoppingCart size={20} />
                                    </button>
                                  </div>
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
                                <div className="flex items-center justify-between">
                                  <p className="text-primary font-bold price-text">
                                    {product.price.toLocaleString("vi-VN")}đ
                                  </p>
                                  <Button
                                    onClick={() => handleAddToCart(product)}
                                    size="sm"
                                    className="ml-2"
                                  >
                                    <ShoppingCart size={16} className="mr-1" />
                                    Thêm
                                  </Button>
                                </div>
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
        <AddToCartModal
          isOpen={isAddToCartModalOpen}
          onClose={closeAddToCartModal}
          product={selectedProductForCart}
        />
      </div>
    </div>
  );
}
