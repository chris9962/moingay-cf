"use client";

import ProductForm from "@/components/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Product</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <ProductForm />
      </div>
    </div>
  );
}
