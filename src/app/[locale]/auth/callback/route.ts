import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBaseUrl } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const baseUrl = getBaseUrl()
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
        return NextResponse.redirect(`${baseUrl}/${locale}/auth/reset-password`)
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

      return NextResponse.redirect(`${baseUrl}${redirectUrl}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`)
}
