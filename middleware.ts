import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Check if the path is for the admin API
  if (path.startsWith("/api/admin")) {
    // Get the auth token from the cookies
    const authToken = request.cookies.get("admin-auth-token")?.value;
    console.log("authToken", authToken);
    // If there's no token and this is an admin API route, return 401

    if (!authToken) {
      // clear the cookies
      const response = NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
      response.cookies.delete("admin-auth-token");
      //redirect to the login page
      return response;
    }

    // In a real app, you would verify the token here
    // For our simple example, we'll just check if it's the expected value
    if (authToken !== "admin-session-token") {
      return NextResponse.json(
        { success: false, message: "Invalid authentication token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/api/admin/:path*"],
};
