import React from 'react';

export default function JsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Sinoway Education",
        "alternateName": ["Sinoway", "Sinowayedu", "华途教育", "华途国际教育", "华途教育科技"],
        "url": "https://sinowayedu.com",
        "logo": "https://sinowayedu.com/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+86-13601965441",
            "contactType": "customer service",
            "email": "info@sinowayedu.com",
            "availableLanguage": ["en", "zh", "ru", "fr", "es", "ar"]
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Room 1201, Building D, Guicheng Garden, Beijing Road, Haicheng District",
            "addressLocality": "Beihai City",
            "addressRegion": "Guangxi Province",
            "postalCode": "536000",
            "addressCountry": "CN"
        },
        "sameAs": [
            "https://www.facebook.com/share/1DPPMYfmyZ/",
            "https://www.instagram.com/sinowayedu/",
            "https://youtube.com/@sinowayedu",
            "https://www.tiktok.com/@sinowayedu"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
