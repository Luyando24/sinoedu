import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Handle missing env vars during build time to prevent crashes
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'example-key'

  return createBrowserClient(supabaseUrl, supabaseKey)
}
