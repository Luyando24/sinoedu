import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "sonner";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL('https://sinowayedu.com'), // Replace with actual domain
    alternates: {
      canonical: '/',
      languages: {
        'en': '/en',
        'zh': '/zh',
        'fr': '/fr',
        'es': '/es',
        'ar': '/ar',
        'ru': '/ru',
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Sinoway Education',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: '0r4Hlq3g-1RfgSR9gVUD8GnB9XgWa5qzGYN4VUZzuoY',
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <AnalyticsTracker />
          {children}
          <BottomNav />
          <Toaster position="top-center" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}