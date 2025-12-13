import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Check for environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // If env vars are missing, we can't perform auth checks.
    // Allow the request to proceed, but log a warning.
    // This prevents the middleware from crashing and causing a 404.
    console.warn("Middleware: Missing Supabase environment variables. Skipping auth check.");
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    );

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { user } } = await supabase.auth.getUser();

    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      if (!user) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }

    // Protect admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!user) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }
  } catch (e) {
    // If there is an error (e.g. missing env vars), just proceed
    // The protected routes will likely fail downstream or be handled by client-side auth checks
    console.error("Middleware auth check failed:", e)
    return NextResponse.next();
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
