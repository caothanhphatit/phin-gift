import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AnimateSection from '@/components/AnimateSection';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';

export const metadata: Metadata = {
    title: 'Tất Cả Sản Phẩm Phin Cà Phê | PhinGift',
    description: 'Khám phá bộ sưu tập phin cà phê inox và nhôm cao cấp của PhinGift. Tùy chỉnh khắc logo, nhiều màu sắc và kích thước.',
    openGraph: {
        title: 'Tất Cả Sản Phẩm Phin Cà Phê | PhinGift',
        description: 'Khám phá bộ sưu tập phin cà phê inox và nhôm cao cấp của PhinGift.',
    },
};

export default function ProductsPage() {
    return (
        <>
            {/* Page Header */}
            <section className="relative pt-32 pb-16 bg-[var(--color-brown-dark)] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <Image src="/images/products/phin-collection.jpg" alt="" fill className="object-cover" />
                </div>
                <div className="relative z-10 container-custom text-center">
                    <AnimateSection>
                        <span className="label-small text-[var(--color-gold)] block mb-4">Sản Phẩm</span>
                        <h1 className="heading-display text-white mb-4">Bộ Sưu Tập Phin</h1>
                        <p className="text-white/60 max-w-xl mx-auto">
                            Phin cà phê inox và nhôm cao cấp, khắc laser logo theo yêu cầu.
                            Phù hợp cho cá nhân, quán cà phê và doanh nghiệp.
                        </p>
                    </AnimateSection>
                </div>
            </section>

            {/* Products Grid */}
            <section className="section-padding bg-[var(--color-cream)]">
                <div className="container-custom">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-10">
                        <Link href="/" className="hover:text-[var(--color-gold)] transition-colors">Trang chủ</Link>
                        <span>/</span>
                        <span className="text-[var(--color-brown)]">Sản Phẩm</span>
                    </nav>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, i) => (
                            <AnimateSection key={product.id} delay={i * 0.1}>
                                <ProductCard product={product} />
                            </AnimateSection>
                        ))}
                    </div>

                    {/* B2B banner */}
                    <AnimateSection delay={0.2}>
                        <div className="mt-16 bg-[var(--color-brown)] p-8 md:p-12 text-center text-white">
                            <span className="label-small text-[var(--color-gold)] block mb-4">Dành Cho Doanh Nghiệp</span>
                            <h2 className="font-serif text-2xl md:text-3xl mb-4">Đặt Hàng Sỉ & Khắc Logo</h2>
                            <p className="text-white/70 mb-8 max-w-xl mx-auto">
                                Đơn hàng từ 50 phin trở lên được hưởng giá sỉ đặc biệt.
                                Liên hệ để được tư vấn miễn phí.
                            </p>
                            <Link href="/contact" className="btn-outline-light">
                                Liên Hệ Ngay
                            </Link>
                        </div>
                    </AnimateSection>
                </div>
            </section>
        </>
    );
}
