import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const role = request.cookies.get("role")?.value;

    if (!role) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      pathname.startsWith("/dashboard/student") &&
      role !== "student"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      pathname.startsWith("/dashboard/printer") &&
      role !== "printer"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
