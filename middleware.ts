import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper function to apply CORS headers
function applyCorsHeaders(response: NextResponse) {
  response.headers.set(
    "Access-Control-Allow-Origin",
    "https://real-estate-web-pied.vercel.app"
  ); // Your frontend origin
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // Allowed methods
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  ); // Allowed headers
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS for /api/* routes
  if (pathname.startsWith("/api/")) {
    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return applyCorsHeaders(new NextResponse(null, { status: 204 }));
    }

    // Apply CORS headers to all API responses
    const response = NextResponse.next();
    return applyCorsHeaders(response);
  }

  // Existing authentication logic for non-API routes
  const token = request.cookies.get("client_auth_token")?.value;

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Update matcher to include /api/* along with existing patterns
export const config = {
  matcher: [
    "/api/:path*", // Match all API routes
    "/((?!_next/static|_next/image|favicon.ico).*)", // Your existing matcher for pages
  ],
};
