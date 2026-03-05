import ProductListingClient from '@/components/ProductListingClient';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getProducts() {
    try {
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_SITE_URL 
            ? process.env.NEXT_PUBLIC_SITE_URL
            : 'http://localhost:3000';
        
        const res = await fetch(`${baseUrl}/api/admin/products?limit=100`, { cache: 'no-store' });
        const json = await res.json();
        return json.data || [];
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'nav' });
    return {
        title: `${t('products')} | PhinGift`,
        description: 'Khám phá bộ sưu tập phin cà phê inox và nhôm cao cấp của PhinGift.',
    };
}

export default async function ProductsPage() {
    const products = await getProducts();

    return <ProductListingClient initialProducts={products} />;
}
