import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

const getContent = (blocks: { key: string; content: string }[] | null, key: string, fallback: string) => {
  if (!blocks) return fallback
  const block = blocks.find(b => b.key === key)
  return block ? block.content : fallback
}

export default async function PrivacyPage() {
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  return (
    <div className="container py-20 max-w-4xl bg-slate-50 min-h-screen">
      <div className="space-y-6 mb-16 border-b pb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#0056b3]">{getContent(blocks, 'privacy.title', "Privacy Policy")}</h1>
        <p className="text-xl text-muted-foreground">
          {getContent(blocks, 'privacy.subtitle', "Your privacy is important to us. This document outlines how we handle your personal information.")}
        </p>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {getContent(blocks, 'privacy.updated', "Last Updated: October 24, 2024")}
        </p>
      </div>

      <div className="space-y-16">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#0056b3]">{getContent(blocks, 'privacy.1.title', "1. Introduction")}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {getContent(blocks, 'privacy.1.text', 'Sinoway Education ("we", "our", or "us") provides educational consultancy services. By using our website and services, you consent to the data practices described in this statement. We are committed to protecting your personal data and ensuring transparency in how we handle it.')}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#0056b3]">{getContent(blocks, 'privacy.2.title', "2. Data We Collect")}</h2>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <ul className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0056b3]" /> Personal Identity (Name, Passport)</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0056b3]" /> Contact Details (Email, Phone)</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0056b3]" /> Academic Records (Transcripts)</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0056b3]" /> Financial Proofs</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0056b3]" /> Payment Information</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0056b3]" /> Usage Data & Cookies</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#0056b3]">{getContent(blocks, 'privacy.3.title', "3. Usage of Information")}</h2>
          <p className="text-muted-foreground leading-relaxed">
             {getContent(blocks, 'privacy.3.text', "We use the collected data for various purposes:")}
          </p>
          <ul className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To process applications to universities on your behalf</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[#0056b3]">{getContent(blocks, 'privacy.4.title', "4. Data Security")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {getContent(blocks, 'privacy.4.text', "The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.")}
          </p>
        </section>

        <section className="space-y-4 pt-8 border-t">
          <h2 className="text-2xl font-bold text-[#0056b3]">{getContent(blocks, 'privacy.contact.title', "Contact Our Privacy Officer")}</h2>
          <p className="text-muted-foreground">
            {getContent(blocks, 'privacy.contact.text', "If you have any questions about this Privacy Policy, please contact us:")}
          </p>
          <div className="mt-4 p-6 border border-gray-200 rounded-xl inline-block pr-12 bg-white shadow-sm">
             <p className="font-bold text-[#0056b3]">Sinoway Education Legal Team</p>
             <p className="text-muted-foreground">{getContent(blocks, 'privacy.contact.email', "info@sinowayedu.com")}</p>
             <p className="text-muted-foreground">{getContent(blocks, 'privacy.contact.phone', "+8613601965441")}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
