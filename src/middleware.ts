import { NextRequest, NextResponse } from "next/server";
import { unsealData } from "iron-session";
import { sessionOptions } from "@/lib/session";
import type { SessionData } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  let session: Partial<SessionData> = {};
  const cookie = req.cookies.get(sessionOptions.cookieName);
  if (cookie?.value) {
    try {
      session = await unsealData<SessionData>(cookie.value, {
        password: sessionOptions.password,
      });
    } catch {
      // Invalid or expired session — treat as logged out
    }
  }

  if (pathname.startsWith("/admin")) {
    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/staff")) {
    if (!session.role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*"],
};
