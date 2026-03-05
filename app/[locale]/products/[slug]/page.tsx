import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import AnimateSection from '@/components/AnimateSection';
import ProductDetailClient from '@/components/ProductDetailClient';
import { getTranslations } from 'next-intl/server';
import { getBaseUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

async function getProductBySlug(slug: string) {
    try {
        const baseUrl = getBaseUrl();
        
        const res = await fetch(`${baseUrl}/api/admin/products?limit=100`, { cache: 'no-store' });
        const json = await res.json();
        return json.data?.find((p: any) => p.slug === slug);
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return null;
    }
}

export async function generateStaticParams() {
    try {
        const baseUrl = 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/admin/products?limit=100`, { cache: 'no-store' });
        const json = await res.json();
        const products = json.data || [];
        
        return products.flatMap((p: any) => [
            { slug: p.slug, locale: 'vi' },
            { slug: p.slug, locale: 'en' }
        ]);
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return {};

    const title = product.name?.[locale as 'vi' | 'en'] || product.name?.['vi'] || product.slug;
    const desc = product.shortDescription?.[locale as 'vi' | 'en'] || product.shortDescription?.['vi'] || '';
    const firstImage = product.images?.[0]?.url || '/images/products/phin-collection.jpg';

    return {
        title: `${title} | PhinGift`,
        description: desc,
        openGraph: {
            title: title,
            description: desc,
            images: [{ url: firstImage }],
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug, locale } = await params;
    const product = await getProductBySlug(slug);
    if (!product) notFound();

    const t = await getTranslations({ locale, namespace: 'nav' });

    const title = product.name?.[locale as 'vi' | 'en'] || product.name?.['vi'] || product.slug;
    const desc = product.shortDescription?.[locale as 'vi' | 'en'] || product.shortDescription?.['vi'] || '';
    const firstImage = product.images?.[0]?.url || '/images/products/phin-collection.jpg';
    const price = product.variants?.[0]?.price || 0;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        image: [firstImage],
        description: desc,
        offers: {
            '@type': 'Offer',
            price: price,
            priceCurrency: 'VND',
            availability: 'https://schema.org/InStock',
            url: `https://phingift.vn/products/${product.slug}`,
            seller: {
                '@type': 'Organization',
                name: 'PhinGift',
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient product={product} />
        </>
    );
}
