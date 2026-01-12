import { createClient } from "@/lib/supabase/server"
import { HomeClient } from "@/components/home-client"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
  };
}

export default async function Home() {
  const supabase = createClient()
  const { data: blocks } = await supabase.from('content_blocks').select('*')

  return <HomeClient content={blocks || []} />
}
