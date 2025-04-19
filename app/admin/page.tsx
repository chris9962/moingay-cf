"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/admin/counts");
        if (!response.ok) throw new Error("Failed to fetch counts");

        const { data } = await response.json();
        setProductCount(data.productCount);
        setCategoryCount(data.categoryCount);
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Products</h2>
            <p className="text-3xl font-bold text-primary mb-4">
              {productCount}
            </p>
            <Link
              href="/admin/products"
              className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Manage Products
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Categories</h2>
            <p className="text-3xl font-bold text-primary mb-4">
              {categoryCount}
            </p>
            <Link
              href="/admin/categories"
              className="inline-block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Manage Categories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
