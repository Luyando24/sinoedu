import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Facebook, Instagram, MessageCircle, Youtube, BookOpen } from "lucide-react"

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
}

export async function Footer() {
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  return (
    <footer className="bg-white pt-16 pb-8 border-t">
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
              <h4 className="text-[#0056b3] font-bold text-lg">About Sinoway</h4>
              <ul className="space-y-2 text-sm text-[#0056b3]">
                <li><Link href="/why-us" className="hover:text-[#0056b3]/80">Why us &rarr;</Link></li>
                <li><Link href="/partners" className="hover:text-[#0056b3]/80">Our partner &rarr;</Link></li>
                <li><Link href="/universities" className="hover:text-[#0056b3]/80">Domestic cooperative universities &rarr;</Link></li>
              </ul>
            </div>
          </div>

          {/* Our Service */}
          <div className="md:w-1/4">
            <h4 className="text-[#0056b3] font-bold text-lg mb-6">Our service</h4>
            <ul className="space-y-2 text-sm text-[#0056b3]">
              <li><Link href="/services" className="hover:text-[#0056b3]/80">University application</Link></li>
              <li><Link href="/services" className="hover:text-[#0056b3]/80">Airport pick up</Link></li>
              <li><Link href="/programs" className="hover:text-[#0056b3]/80">Short-term study abroad</Link></li>
            </ul>
          </div>

          {/* Contact US */}
          <div className="md:w-1/4">
             <h4 className="text-[#0056b3] font-bold text-lg mb-6">Contact US</h4>
             <div className="space-y-2 text-sm text-[#0056b3]">
               <p><span className="font-semibold">Address:</span> {getContent(blocks, 'footer.connect.address', 'Room 1201, Building D, Guicheng Garden, Beijing Road, Haicheng District, Beihai City, Guangxi Province, China')}</p>
               <p><span className="font-semibold">Phone:</span> {getContent(blocks, 'footer.connect.phone', '+8613601965441')}</p>
               <p><span className="font-semibold">E-mail:</span> {getContent(blocks, 'footer.connect.email', 'info@sinowayedu.com')}</p>
             </div>
          </div>

          {/* Social Icons */}
          <div className="md:w-1/4 flex flex-col items-start md:items-end gap-4 md:pl-8">
             <div className="grid grid-cols-2 gap-4">
                <Link href="https://www.facebook.com/share/1DPPMYfmyZ/" className="h-12 w-12 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white hover:bg-[#3b82f6]/90 transition-colors">
                  <Facebook className="h-8 w-8" />
                </Link>
                <Link href="#" className="h-12 w-12 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white hover:bg-[#3b82f6]/90 transition-colors">
                  <div className="font-bold text-xl">VK</div>
                </Link>
                <Link href="#" className="h-12 w-12 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white hover:bg-[#3b82f6]/90 transition-colors">
                  <Instagram className="h-8 w-8" />
                </Link>
                <Link href="#" className="h-12 w-12 bg-[#3b82f6] rounded-lg flex items-center justify-center text-white hover:bg-[#3b82f6]/90 transition-colors">
                  <MessageCircle className="h-8 w-8" />
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
