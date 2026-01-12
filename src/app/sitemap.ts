import { MetadataRoute } from 'next'
import { routing } from '@/routing'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://sinowayedu.com'
    const locales = routing.locales
    const paths = [
        '',
        '/about',
        '/services',
        '/universities',
        '/programs',
        '/jobs',
        '/news',
        '/contact',
        '/why-us',
        '/scholarships',
    ]

    const sitemapEntries: MetadataRoute.Sitemap = []

    paths.forEach((path) => {
        // Add default locale entry (or language-neutral entry if using rewrites)
        sitemapEntries.push({
            url: `${baseUrl}${path}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: path === '' ? 1 : 0.8,
        })

        // Add localized entries
        locales.forEach((locale) => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: path === '' ? 1 : 0.8,
            })
        })
    })

    return sitemapEntries
}
