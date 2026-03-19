import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only redirect if pathname contains uppercase letters
  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Skip API routes, static files, images, and Next.js internals
  matcher: [
    "/((?!api|_next/static|_next/image|favicon|images|.*\\.[a-z0-9]+$).*)",
  ],
};
