import localProducts from '@/data/products.json';
import ProductListingClient from '@/components/ProductListingClient';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'nav' });
    return {
        title: `${t('products')} | PhinGift`,
        description: 'Khám phá bộ sưu tập phin cà phê inox và nhôm cao cấp của PhinGift.',
    };
}

export default async function ProductsPage() {
    const products = localProducts;

    return <ProductListingClient initialProducts={products as any} />;
}
