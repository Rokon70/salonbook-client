import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Fast guard: no session cookie -> go to Sign In. Real role checks happen in the dashboard layouts and on the API.
export function middleware(request) {
  if (!getSessionCookie(request)) {
    const url = new URL("/signin", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/services/:path+", "/dashboard/:path*", "/payment/:path*"] };
