"use client";

import { redirect } from "next/navigation";

export default function AdminDashboard() {
  return redirect("/admin/products");
}
