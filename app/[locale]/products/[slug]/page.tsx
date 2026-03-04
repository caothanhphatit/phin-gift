import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import AnimateSection from '@/components/AnimateSection';
import ProductDetailClient from '@/components/ProductDetailClient';
import { getProducts } from '@/lib/gsheets';
import { getTranslations } from 'next-intl/server';

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
    const products = await getProducts();
    // Assuming we support both locales
    return products.flatMap((p) => [
        { slug: p.slug, locale: 'vi' },
        { slug: p.slug, locale: 'en' }
    ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const products = await getProducts();
    const product = products.find(p => p.slug === slug);
    if (!product) return {};

    const title = product.title[locale as 'vi' | 'en'] || product.title['vi'];
    const desc = product.description[locale as 'vi' | 'en'] || product.description['vi'];
    const firstImage = product.variants?.[0]?.image || '/images/products/phin-collection.jpg';

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
    const products = await getProducts();
    const product = products.find(p => p.slug === slug);
    if (!product) notFound();

    const t = await getTranslations({ locale, namespace: 'nav' });

    const title = product.title[locale as 'vi' | 'en'] || product.title['vi'];
    const desc = product.description[locale as 'vi' | 'en'] || product.description['vi'];
    const firstImage = product.variants?.[0]?.image || '';
    const price = product.price || 0;

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
            {/* Header */}
            <div className="pt-20 pb-6 bg-[var(--color-cream)]">
                <div className="container-custom px-4 md:px-8 lg:px-16">
                    <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6 mt-4">
                        <Link href="/" className="hover:text-[var(--color-gold)] transition-colors">{t('home')}</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-[var(--color-gold)] transition-colors">{t('products')}</Link>
                        <span>/</span>
                        <span className="text-[var(--color-brown)]">{title}</span>
                    </nav>
                </div>
            </div>

            {/* Main product content */}
            <section className="section-padding bg-[var(--color-cream)] !pt-0">
                <div className="container-custom">
                    <AnimateSection>
                        <ProductDetailClient product={product} />
                    </AnimateSection>

                    {/* Description Addendum */}
                    <div className="mt-16 pt-16 border-t border-[var(--color-cream-dark)]">
                        <AnimateSection delay={0.1}>
                            <h2 className="font-serif text-2xl text-[var(--color-brown)] mb-4">
                                {locale === 'en' ? 'Product Description' : 'Mô Tả Sản Phẩm'}
                            </h2>
                            <p className="text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {desc}
                            </p>
                        </AnimateSection>
                    </div>
                </div>
            </section>
        </>
    );
}
