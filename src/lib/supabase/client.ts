import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Handle missing env vars during build time to prevent crashes
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let supabaseUrl = envUrl ? envUrl.trim() : 'https://example.supabase.co'
  let supabaseKey = envKey ? envKey.trim() : 'example-key'

  try {
    new URL(supabaseUrl)
  } catch {
    supabaseUrl = 'https://example.supabase.co'
    supabaseKey = 'example-key'
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
