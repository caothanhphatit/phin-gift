import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import AnimateSection from '@/components/AnimateSection';
import ProductDetailClient from '@/components/ProductDetailClient';
import { getProductBySlug, products } from '@/lib/products';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = getProductBySlug(slug);
    if (!product) return {};
    return {
        title: product.metaTitle,
        description: product.metaDescription,
        openGraph: {
            title: product.metaTitle,
            description: product.metaDescription,
            images: [{ url: product.images[0] }],
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;
    const product = getProductBySlug(slug);
    if (!product) notFound();

    return (
        <>
            {/* Header */}
            <div className="pt-20 pb-6 bg-[var(--color-cream)]">
                <div className="container-custom px-4 md:px-8 lg:px-16">
                    <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6 mt-4">
                        <Link href="/" className="hover:text-[var(--color-gold)] transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-[var(--color-gold)] transition-colors">Sản phẩm</Link>
                        <span>/</span>
                        <span className="text-[var(--color-brown)]">{product.shortName}</span>
                    </nav>
                </div>
            </div>

            {/* Main product content */}
            <section className="section-padding bg-[var(--color-cream)] !pt-0">
                <div className="container-custom">
                    <AnimateSection>
                        <ProductDetailClient product={product} />
                    </AnimateSection>

                    {/* Description + Features + Specs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pt-16 border-t border-[var(--color-cream-dark)]">
                        {/* Description */}
                        <AnimateSection delay={0.1}>
                            <h2 className="font-serif text-2xl text-[var(--color-brown)] mb-4">Mô Tả Sản Phẩm</h2>
                            <p className="text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                                {product.longDescription}
                            </p>
                        </AnimateSection>

                        {/* Specifications */}
                        <AnimateSection delay={0.2}>
                            <h2 className="font-serif text-2xl text-[var(--color-brown)] mb-4">Thông Số Kỹ Thuật</h2>
                            <table className="w-full text-sm">
                                <tbody>
                                    {Object.entries(product.specifications).map(([key, val]) => (
                                        <tr key={key} className="border-b border-[var(--color-cream-dark)]">
                                            <td className="py-3 pr-4 font-medium text-[var(--color-brown)] w-2/5">{key}</td>
                                            <td className="py-3 text-[var(--color-text-muted)]">{val}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </AnimateSection>

                        {/* Full Features */}
                        <AnimateSection delay={0.1}>
                            <h2 className="font-serif text-2xl text-[var(--color-brown)] mb-4">Tính Năng Nổi Bật</h2>
                            <ul className="space-y-3">
                                {product.features.map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shrink-0 mt-1.5" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </AnimateSection>
                    </div>
                </div>
            </section>
        </>
    );
}
