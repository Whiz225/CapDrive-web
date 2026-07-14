import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/cars",
    "/cars/:path*",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/ride",
  ];

  // Check if path is public
  const isPublicPath = publicPaths.some(
    (path) =>
      pathname === path || pathname.startsWith(path.replace(":path*", ""))
  );

  // Check if path is auth-related
  const isAuthPath =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email");

  // If user is not authenticated and tries to access protected route
  if (!token && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and tries to access auth pages
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is authenticated but needs to complete profile or verify
  if (token) {
    // Check if user needs to complete profile (you'd need to check this)
    // For now, we'll allow access
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
