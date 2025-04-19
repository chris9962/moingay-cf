"use client";

import { useEffect, useState } from "react";
import { Package, Tag } from "lucide-react";

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
      <h1 className="text-3xl font-bold">Welcome to Admin Panel</h1>
      <p className="text-gray-600">
        Select an item from the sidebar to manage your content.
      </p>
    </div>
  );
}
