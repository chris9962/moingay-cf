"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Tag } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [counts, setCounts] = useState({ productCount: 0, categoryCount: 0 });
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/admin/counts");
        if (!response.ok) throw new Error("Failed to fetch counts");

        const { data } = await response.json();
        setCounts(data);
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

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
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${"w-64"} bg-white shadow-md transition-all duration-300 ease-in-out`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          </div>
          <nav>
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
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
