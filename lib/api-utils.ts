import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ZodError, type ZodSchema } from "zod"

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export async function validateRequest<T>(
  req: NextRequest,
  schema: ZodSchema<T>,
): Promise<{ success: boolean; data?: T; errors?: Record<string, string[]> }> {
  try {
    // Parse the request body as JSON
    const body = await req.json()

    // Validate the body against the schema
    const data = schema.parse(body)

    return { success: true, data }
  } catch (error) {
    if (error instanceof ZodError) {
      // Format Zod errors
      const errors: Record<string, string[]> = {}

      for (const issue of error.errors) {
        const path = issue.path.join(".")
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(issue.message)
      }

      return { success: false, errors }
    }

    return {
      success: false,
      errors: { _error: ["Invalid request data"] },
    }
  }
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, string[]>,
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, message, errors }, { status })
}

export function successResponse<T>(data: T, message?: string, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, message }, { status })
}
