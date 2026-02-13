import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets the base URL for the application.
 * Priority:
 * 1. window.location.origin (if in browser)
 * 2. NEXT_PUBLIC_SITE_URL environment variable
 * 3. Default fallback (sinovisa.org)
 * 
 * To force a specific URL (e.g. production URL when testing locally),
 * set NEXT_PUBLIC_SITE_URL in your .env file.
 */
export function getBaseUrl() {
  let url = process.env.NEXT_PUBLIC_SITE_URL || 
            process.env.NEXT_PUBLIC_URL ||
            (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "") ||
            (typeof window !== "undefined" ? window.location.origin : "https://www.sinowayedu.com");
  
  // Ensure protocol is present
  if (url && !url.startsWith('http')) {
    url = `https://${url}`;
  }

  // Remove trailing slash if present
  return url.replace(/\/$/, "");
}
