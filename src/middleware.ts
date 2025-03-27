import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // For debugging - log the path and cookie existence
  console.log(`Middleware checking path: ${request.nextUrl.pathname}`);

  // Paths that don't require authentication
  const publicPaths = ["/", "/sign-in", "/sign-up", "/overview"];
  const isPublicPath =
    publicPaths.some((path) => request.nextUrl.pathname === path) ||
    request.nextUrl.pathname.startsWith("/api/");

  // If this is a public path, allow access without checking for session
  if (isPublicPath) {
    console.log(`Public path access: ${request.nextUrl.pathname}`);
    return NextResponse.next();
  }

  // Check for authentication by directly examining cookies
  const cookies = request.cookies;
  const sessionCookie = cookies.get("better-auth.session_token");

  console.log(
    `Cookie check for ${request.nextUrl.pathname}:`,
    sessionCookie ? "Cookie found" : "No cookie found"
  );

  // If no session cookie and not a public path, redirect to sign-in
  if (!sessionCookie?.value) {
    console.log(
      `No session, redirecting to sign-in from: ${request.nextUrl.pathname}`
    );
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // User is authenticated, allow access
  console.log(`Authenticated access granted to: ${request.nextUrl.pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
