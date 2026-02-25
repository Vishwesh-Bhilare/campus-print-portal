import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const role = req.cookies.get("role")?.value;

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (!role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (
      pathname.startsWith("/dashboard/student") &&
      role !== "student"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (
      pathname.startsWith("/dashboard/printer") &&
      role !== "printer"
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
