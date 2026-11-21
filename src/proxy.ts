import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "./lib/session";

/**
 * Proteção rápida do /admin. A checagem definitiva acontece também no
 * layout protegido (`requireAdmin`), então o proxy é apenas a primeira barreira.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);

    if (pathname !== "/admin") {
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
