import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {Inter} from "next/font/google";
import "@/app/globals.css";
import {Toaster} from "sonner";
import {BottomNav} from "@/components/layout/bottom-nav";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sinoway Education - Study in China",
  description: "Your trusted partner for Chinese education. Apply for scholarships and admissions in top Chinese universities.",
};

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <BottomNav />
          <Toaster position="top-center" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}