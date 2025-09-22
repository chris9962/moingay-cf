"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { Package, Tag, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [counts, setCounts] = useState({
    productCount: 0,
    categoryCount: 0,
    orderCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { logout, isAuthenticated } = useAuthStore();

  const router = useRouter();
  const fetchCounts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/counts");
      // log response status, if 401 call logout
      console.log(response.status);
      if (response.status === 401) {
        console.log("401");
        return signOut();
      }

      if (!response.ok) throw new Error("Failed to fetch counts");

      const { data } = await response.json();
      setCounts(data);
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);
  useEffect(() => {
    if (isAuthenticated) {
      fetchCounts();
    }
  }, [isAuthenticated, fetchCounts]);
  const signOut = () => {
    logout();
    router.push("/admin/login");
  };
  const menuItems = [
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
      count: counts.productCount,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Tag,
      count: counts.categoryCount,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      count: counts.orderCount,
    },
  ];
  return (
    <div className="flex h-screen bg-gray-50 font-roboto">
      {/* Sidebar */}
      {isAuthenticated && (
        <aside
          className={`${"w-64"} bg-white shadow-md transition-all duration-300 ease-in-out`}
        >
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
            </div>
            <nav className="flex-1">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-md transition-colors ${
                        pathname === item.href
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon size={20} />
                        <span>{item.name}</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          pathname === item.href
                            ? "bg-white text-primary"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {loading ? "..." : item.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {/* add button logout */}
            <button
              className="w-full bg-red-500 text-white p-2 rounded-md"
              onClick={() => {
                signOut();
              }}
            >
              Logout
            </button>
          </div>
        </aside>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-auto p-6">
        {children}
      </div>
    </div>
  );
}
