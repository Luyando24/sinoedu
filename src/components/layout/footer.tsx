import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
}

export async function Footer() {
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h4 className="text-lg font-bold">{getContent(blocks, 'footer.about.title', 'Sinoway Education')}</h4>
            <p className="text-sm text-muted-foreground">
              {getContent(blocks, 'footer.about.desc', 'Empowering global students to achieve academic excellence in China through trusted guidance and expert support.')}
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">{getContent(blocks, 'footer.services.title', 'Services')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary">University Admissions</Link></li>
              <li><Link href="/services" className="hover:text-primary">Scholarship Strategy</Link></li>
              <li><Link href="/services" className="hover:text-primary">Visa & Immigration</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">{getContent(blocks, 'footer.company.title', 'Company')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Get in Touch</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">{getContent(blocks, 'footer.connect.title', 'Connect')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{getContent(blocks, 'footer.connect.email', 'admission@sinoway.com')}</li>
              <li>{getContent(blocks, 'footer.connect.phone', '+86 123 456 7890')}</li>
              <li>{getContent(blocks, 'footer.connect.address', 'Beijing, China')}</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {getContent(blocks, 'footer.copyright', 'Sinoway Education. All rights reserved.')}
        </div>
      </div>
    </footer>
  )
}
