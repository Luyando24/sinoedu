import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const type = searchParams.get('type')

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get the locale from the 'next' parameter if it exists
      const locale = next.split('/')[1] || 'en'
      
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/${locale}/auth/reset-password`)
      }

      // Check user role for redirection
      const { data: { user } } = await supabase.auth.getUser()
      let redirectUrl = next
      
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (profile?.role === 'admin') {
          redirectUrl = `/${locale}/admin`
        }
      }

      // Ensure the redirect URL has the locale prefix if it's not there
      if (!redirectUrl.startsWith(`/${locale}`)) {
        redirectUrl = `/${locale}${redirectUrl}`
      }

      return NextResponse.redirect(`${origin}${redirectUrl}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
