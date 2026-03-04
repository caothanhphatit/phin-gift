import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import AnimateSection from '@/components/AnimateSection';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/gsheets';
import { getTranslations } from 'next-intl/server';

export default async function FeaturedProducts() {
    const products = await getProducts();
    // Use first 3 products as featured
    const featuredProducts = products.slice(0, 3);
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
                    {featuredProducts.map((product, i) => (
                        <AnimateSection key={product.id} delay={i * 0.1}>
                            <ProductCard product={product} />
                        </AnimateSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
