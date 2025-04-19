import type { NextRequest } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return errorResponse("No file provided", 400)
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return errorResponse("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.", 400)
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return errorResponse("File too large. Maximum size is 5MB.", 400)
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const fileExt = file.name.split(".").pop()
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `uploads/${fileName}`

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage.from("images").upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
    })

    if (error) throw error

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(data.path)

    return successResponse(
      {
        url: publicUrl,
        fileName: fileName,
      },
      "File uploaded successfully",
    )
  } catch (error) {
    console.error("Error uploading file:", error)
    return errorResponse(error instanceof Error ? error.message : "Failed to upload file", 500)
  }
}
