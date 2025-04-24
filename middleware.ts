import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper function to apply CORS headers
function applyCorsHeaders(response: NextResponse, request: NextRequest) {
  const origin = request.headers.get("origin");

  // List of allowed origins
  const allowedOrigins = [
    "https://real-estate-web-pied.vercel.app",
    "http://localhost:8080",
    "http://localhost:3000",
  ];

  // Check if the request origin is in our allowed list
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else {
    // You could also use a wildcard for development, but not recommended for production
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://real-estate-web-pied.vercel.app"
    );
  }

  // Add these additional headers for more complex requests
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS for /api/* routes
  if (pathname.startsWith("/api/")) {
    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return applyCorsHeaders(new NextResponse(null, { status: 204 }), request);
    }

    // Apply CORS headers to all API responses
    const response = NextResponse.next();
    return applyCorsHeaders(response, request);
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

// Make sure the matcher is correctly set up
export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
