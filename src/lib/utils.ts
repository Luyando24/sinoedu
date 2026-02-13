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
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "https://sinovisa.org"; // Default fallback
}
