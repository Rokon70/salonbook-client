import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Fast guard: no session cookie -> go to Sign In. Real role checks happen in the dashboard layouts and on the API.
export function middleware(request) {
  if (!getSessionCookie(request)) {
    const url = new URL("/signin", request.url);
    // Keep the query string too (e.g. Stripe's session_id) so the user returns to the exact page after sign in.
    url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/services/:path+", "/dashboard/:path*", "/payment/:path*"] };
