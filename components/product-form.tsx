"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProductStore } from "@/lib/product-store";
import { useToastStore } from "@/lib/toast-store";
import CKEditor from "@/components/ckeditor";
import { X } from "lucide-react";

interface ProductFormProps {
  productId?: number;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const {
    categories,
    fetchCategories,
    createProduct,
    updateProduct,
    products,
  } = useProductStore();
  const { addToast } = useToastStore();

  // Find the product if editing
  const existingProduct = productId
    ? products.find((p) => p.id === productId)
    : null;

  // Form state
  const [name, setName] = useState(existingProduct?.name || "");
  const [subtitle, setSubtitle] = useState(existingProduct?.subtitle || "");
  const [description, setDescription] = useState(
    existingProduct?.description || ""
  );
  const [price, setPrice] = useState(existingProduct?.price?.toString() || "");
  const [discountPrice, setDiscountPrice] = useState(
    existingProduct?.discount_price?.toString() || ""
  );
  const [status, setStatus] = useState<"public" | "draft">(
    existingProduct?.status || "draft"
  );
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    existingProduct?.categories?.map((c) => c.id) || []
  );

  // Image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    existingProduct?.image || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."
      );
      addToast({
        type: "error",
        message:
          "Loại file không hợp lệ. Chỉ chấp nhận JPEG, PNG, GIF, và WebP.",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError("File too large. Maximum size is 5MB.");
      addToast({
        type: "error",
        message: "File quá lớn. Kích thước tối đa là 5MB.",
      });
      return;
    }

    setImageFile(file);
    setUploadError(null);

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(existingProduct?.image || "");
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile && !existingProduct?.image) return null;
    if (!imageFile && existingProduct?.image) return existingProduct.image;

    setIsUploading(true);
    addToast({
      type: "info",
      message: "Đang tải lên hình ảnh...",
    });

    try {
      const formData = new FormData();
      formData.append("image", imageFile as File);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to upload image");
      }

      addToast({
        type: "success",
        message: "Hình ảnh đã được tải lên thành công",
      });

      return data.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      setUploadError(errorMessage);
      addToast({
        type: "error",
        message: `Lỗi khi tải lên hình ảnh: ${errorMessage}`,
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormError(null);
    setIsSubmitting(true);

    try {
      // Validate form
      if (!name.trim()) {
        throw new Error("Product name is required");
      }

      if (!price || isNaN(Number(price)) || Number(price) <= 0) {
        throw new Error("Valid price is required");
      }

      if (
        discountPrice &&
        (isNaN(Number(discountPrice)) || Number(discountPrice) <= 0)
      ) {
        throw new Error("Discount price must be a valid number");
      }

      // Upload image if needed
      const imageUrl = await uploadImage();

      const productData = {
        name,
        subtitle: subtitle || null,
        description: description || null,
        price: Number(price),
        discount_price: discountPrice ? Number(discountPrice) : null,
        status,
        image: imageUrl,
      };

      if (productId) {
        // Update existing product
        await updateProduct(productId, productData, selectedCategories);
      } else {
        // Create new product
        await createProduct(productData, selectedCategories);
      }

      // Redirect back to products list
      router.push("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save product";
      setFormError(errorMessage);
      addToast({
        type: "error",
        message: `Lỗi khi lưu sản phẩm: ${errorMessage}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="subtitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price (VND) *
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                min="0"
                required
              />
            </div>

            <div>
              <label
                htmlFor="discountPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Discount Price (VND)
              </label>
              <input
                type="number"
                id="discountPrice"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="draft"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="ml-2">Draft</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="public"
                  checked={status === "public"}
                  onChange={() => setStatus("public")}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="ml-2">Public</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories
            </label>
            <div className="border border-gray-300 rounded-md p-3 max-h-60 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-gray-500 text-sm">No categories available</p>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="ml-2">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div className="border border-gray-300 rounded-md p-4">
              {imagePreview ? (
                <div className="relative">
                  <div className="relative h-48 w-full mb-2">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Product preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md">
                  <p className="text-gray-500">No image selected</p>
                </div>
              )}

              <div className="mt-4">
                <label className="block w-full">
                  <span className="sr-only">Choose product image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                </label>
                {uploadError && (
                  <p className="mt-1 text-sm text-red-600">{uploadError}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <CKEditor
              value={description}
              onChange={setDescription}
              placeholder="Enter product description..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center"
        >
          {isSubmitting || isUploading ? (
            <>
              <span className="animate-spin mr-2">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              {isUploading ? "Uploading..." : "Saving..."}
            </>
          ) : (
            "Save Product"
          )}
        </button>
      </div>
    </form>
  );
}
