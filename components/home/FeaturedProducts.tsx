import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import AnimateSection from '@/components/AnimateSection';
import ProductCard, { Product } from '@/components/ProductCard';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

async function getFeaturedProducts() {
    try {
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_SITE_URL 
            ? process.env.NEXT_PUBLIC_SITE_URL
            : 'http://localhost:3000';
        
        const res = await fetch(`${baseUrl}/api/admin/products?limit=100`, { cache: 'no-store' });
        const json = await res.json();
        return (json.data || []).slice(0, 3);
    } catch (error) {
        console.error('Failed to fetch featured products:', error);
        return [];
    }
}

export default async function FeaturedProducts() {
    const featuredProducts = await getFeaturedProducts();
    const t = await getTranslations('nav');

    return (
        <section className="section-padding bg-[var(--color-cream)]">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <AnimateSection>
                        <span className="label-small block mb-3">Bộ Sưu Tập</span>
                        <h2 className="heading-section text-[var(--color-brown)]">
                            Sản Phẩm Nổi Bật
                        </h2>
                    </AnimateSection>
                    <AnimateSection direction="left">
                        <Link href="/products" className="flex items-center gap-2 text-sm text-[var(--color-gold)] font-medium tracking-wider uppercase hover:gap-3 transition-all">
                            {t('products')} <ArrowRight size={14} />
                        </Link>
                    </AnimateSection>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProducts.map((product: Product, i: number) => (
                        <AnimateSection key={product._id.toString()} delay={i * 0.1}>
                            <ProductCard product={product} />
                        </AnimateSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
