import { Link } from "@/navigation"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Facebook, Instagram, Youtube, BookOpen } from "lucide-react"

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  return blocks?.find(b => b.key === key)?.content || fallback
}

export function Footer() {
  // Footer is now a Client Component if we use useTranslations, but let's check if we can keep it server.
  // Actually, useTranslations works in Server Components in next-intl 3+, but we need to await getTranslations or pass messages.
  // However, this file is imported in layout which is server.
  // Let's use getTranslations for async server component.
  // Wait, Footer is exported as async function Footer(), so it is a Server Component.
  
  // We need to use `getTranslations` for server components.
  // Let's import it.
  return <FooterContent />
}

import { getTranslations } from "next-intl/server"

async function FooterContent() {
  const t = await getTranslations('Footer')
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  return (
    <footer className="bg-white pt-16 pb-24 md:pb-8 border-t">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          
          {/* Logo & About Column */}
          <div className="space-y-6 md:w-1/4">
            <Link href="/" className="flex items-center space-x-2">
                <div className="relative h-12 w-12">
                  <Image
                    src="/images/logo-new.jpg"
                    alt="Sinoway Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#0056b3] text-xl leading-none">SinowayEdu</span>
                  <span className="text-[#0056b3] text-sm tracking-widest">华途国际教育</span>
                </div>
            </Link>
            
            <div className="space-y-4">
              <h4 className="text-[#0056b3] font-bold text-lg">{t('aboutSinoway')}</h4>
              <ul className="space-y-2 text-sm text-[#0056b3]">
                <li><Link href="/about" className="hover:text-[#0056b3]/80">{t('whyUs')} &rarr;</Link></li>
                <li><Link href="/universities" className="hover:text-[#0056b3]/80">{t('partners')} &rarr;</Link></li>
                <li><Link href="/universities" className="hover:text-[#0056b3]/80">{t('cooperativeUniversities')} &rarr;</Link></li>
              </ul>
            </div>
          </div>

          {/* Our Service */}
          <div className="md:w-1/4">
            <h4 className="text-[#0056b3] font-bold text-lg mb-6">{t('ourService')}</h4>
            <ul className="space-y-2 text-sm text-[#0056b3]">
              <li><Link href="/services" className="hover:text-[#0056b3]/80">{t('universityApplication')}</Link></li>
              <li><Link href="/services" className="hover:text-[#0056b3]/80">{t('airportPickup')}</Link></li>
              <li><Link href="/programs" className="hover:text-[#0056b3]/80">{t('shortTermStudy')}</Link></li>
            </ul>
          </div>

          {/* Contact US */}
          <div className="md:w-1/4">
             <h4 className="text-[#0056b3] font-bold text-lg mb-6">{t('contactUs')}</h4>
             <div className="space-y-2 text-sm text-[#0056b3]">
               <p><span className="font-semibold">{t('address')}:</span> {getContent(blocks, 'footer.connect.address', 'Room 1201, Building D, Guicheng Garden, Beijing Road, Haicheng District, Beihai City, Guangxi Province, China')}</p>
               <p><span className="font-semibold">{t('phone')}:</span> {getContent(blocks, 'footer.connect.phone', '+8613601965441')}</p>
               <p><span className="font-semibold">{t('email')}:</span> {getContent(blocks, 'footer.connect.email', 'info@sinowayedu.com')}</p>
             </div>
          </div>

          <div className="hidden md:block w-[1px] bg-[#0056b3] opacity-30 self-stretch"></div>

          {/* Social Icons */}
          <div className="md:w-1/4 flex flex-col items-start md:items-end gap-4">
             <div className="grid grid-cols-2 gap-4">
                <Link href="https://www.facebook.com/share/1DPPMYfmyZ/" className="h-12 w-12 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white hover:bg-[#3b82f6]/90 transition-colors">
                  <Facebook className="h-8 w-8" />
                </Link>
                <Link href="#" className="h-12 w-12 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white hover:bg-[#3b82f6]/90 transition-colors">
                  <div className="font-bold text-xl">VK</div>
                </Link>
                <Link href="https://www.instagram.com/sinowayedu/" className="h-12 w-12 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white hover:bg-[#3b82f6]/90 transition-colors">
                  <Instagram className="h-8 w-8" />
                </Link>
                <Link href="https://wa.me/8613601965441" className="h-12 w-12 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white hover:bg-[#3b82f6]/90 transition-colors">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="h-8 w-8"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </Link>
                <Link href="https://youtube.com/@sinowayedu?si=HB8B_8LLfJs1OO26" className="h-12 w-12 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white hover:bg-[#3b82f6]/90 transition-colors">
                  <Youtube className="h-8 w-8" />
                </Link>
                <Link href="https://www.tiktok.com/@sinowayedu?is_from_webapp=1&sender_device=pc" className="h-12 w-12 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white hover:bg-[#3b82f6]/90 transition-colors">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="h-8 w-8"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </Link>
                <Link href="https://www.xiaohongshu.com/user/profile/612b3765000000000101fdd4?xhsshare=userQrCode" className="h-12 w-12 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white hover:bg-[#3b82f6]/90 transition-colors">
                  <BookOpen className="h-8 w-8" />
                </Link>
             </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
