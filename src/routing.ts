import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru', 'fr', 'es', 'ar', 'zh'],
  defaultLocale: 'en'
});