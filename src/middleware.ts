import createMiddleware from 'next-intl/middleware';
import {routing} from './routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Exclude paths that should ALWAYS be accessible
  const isExcluded = 
    pathname.includes('/site-access-control') ||
    pathname.includes('/maintenance') ||
    pathname.includes('/_next') ||
    pathname.includes('/api') ||
    pathname.includes('/images') ||
    pathname.includes('/admin') || // Keep admin accessible for safety
    pathname.match(/\.(.*)$/); // Static files

  if (isExcluded) {
    return intlMiddleware(request);
  }

  // 2. Check site_locked status from Supabase REST API
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/site_settings?key=eq.site_locked&select=value`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
          // Cache the result for a short time to avoid hitting DB on every single request
          next: { revalidate: 60 } 
        }
      );

      const data = await response.json();
      const isLocked = data?.[0]?.value === true;

      if (isLocked) {
        // Redirect to maintenance page
        // We need to preserve the locale if possible, or just go to /en/maintenance
        const locale = request.nextUrl.pathname.split('/')[1] || 'en';
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/maintenance`;
        return NextResponse.redirect(url);
      }
    }
  } catch (error) {
    console.error('Maintenance check failed:', error);
    // If check fails, allow access to prevent locking out the whole site due to API error
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|admin|dashboard|images|.*\\..*).*)']
};