import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

export default function SEOHead({
    title = 'BrandMeetCreator - แพลตฟอร์มเชื่อมต่อแบรนด์กับครีเอเตอร์',
    description = 'แพลตฟอร์มที่เชื่อมต่อแบรนด์กับครีเอเตอร์ TikTok และ Instagram เพื่อสร้างแคมเปญการตลาดที่มีประสิทธิภาพ พร้อมระบบจัดการที่ครบวงจร',
    keywords = 'influencer marketing, creator platform, brand collaboration, TikTok marketing, Instagram marketing, แคมเปญการตลาด, ครีเอเตอร์, แบรนด์',
    image = '/og-image.jpg',
    url = typeof window !== 'undefined' ? window.location.href : '',
    type = 'website',
}: SEOHeadProps) {
    const fullTitle = title.includes('BrandMeetCreator') ? title : `${title} | BrandMeetCreator`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="BrandMeetCreator" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="Thai" />
            <meta name="author" content="BrandMeetCreator" />
            <link rel="canonical" href={url} />
        </Helmet>
    );
}
