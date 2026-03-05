'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import AnimateSection from '@/components/AnimateSection';
import ProductCard from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Filter, X } from 'lucide-react';

interface Product {
    _id: string;
    slug: string;
    name: {
        en: string;
        vi: string;
    };
    shortDescription?: {
        en?: string;
        vi?: string;
    };
    images: Array<{ url: string; publicId: string; isMain: boolean }>;
    variants: Array<{ sku: string; size?: string; color?: string; price: number; salePrice?: number; stock: number }>;
    categories?: string[];
}

interface Props {
    initialProducts: Product[];
}

export default function ProductListingClient({ initialProducts }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const locale = useLocale() as 'vi' | 'en';
    const t = useTranslations('product');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filters
    const categoryFilter = searchParams.get('category');

    const updateFilter = (key: string, value: string | null) => {
        if (value) {
            router.push(`?${key}=${value}`, { scroll: false });
        } else {
            router.push('/products', { scroll: false });
        }
    };

    const clearFilters = () => {
        router.push('/products', { scroll: false });
    };

    const filteredProducts = useMemo(() => {
        let products = initialProducts;

        if (categoryFilter) {
            products = products.filter((p) => p.categories?.includes(categoryFilter));
        }

        return products;
    }, [initialProducts, categoryFilter]);

    return (
        <>
            {/* Page Header */}
            <section className="relative pt-32 pb-16 bg-[var(--color-brown-dark)] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <Image src="/images/products/phin-collection.jpg" alt="" fill className="object-cover" />
                </div>
                <div className="relative z-10 container-custom text-center">
                    <AnimateSection>
                        <span className="label-small text-[var(--color-gold)] block mb-4">
                            {locale === 'en' ? 'Our Products' : 'Sản Phẩm'}
                        </span>
                        <h1 className="heading-display text-white mb-4">
                            {locale === 'en' ? 'Coffee Filter Collection' : 'Bộ Sưu Tập Phin'}
                        </h1>
                        <p className="text-white/60 max-w-xl mx-auto">
                            {locale === 'en'
                                ? 'Premium stainless steel and aluminum coffee filters.'
                                : 'Phin cà phê inox và nhôm cao cấp, khắc laser logo theo yêu cầu.'}
                        </p>
                    </AnimateSection>
                </div>
            </section>

            {/* Products Layout */}
            <section className="section-padding bg-[var(--color-cream)]">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* Mobile Filter Toggle */}
                        <div className="md:hidden flex justify-end">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 px-4 py-2 border border-[var(--color-brown)] rounded"
                            >
                                <Filter size={16} /> {locale === 'en' ? 'Filters' : 'Bộ Lọc'}
                            </button>
                        </div>

                        {/* Sidebar */}
                        <aside className={`w-full md:w-1/4 space-y-8 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
                            {/* Categories */}
                            <div>
                                <h3 className="font-serif text-lg mb-4 text-[var(--color-brown)]">{t('categoryTitle')}</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => updateFilter('category', null)}
                                        className={`block w-full text-left text-sm ${!categoryFilter ? 'font-bold text-[var(--color-gold)]' : 'text-gray-600'}`}
                                    >
                                        {t('allCategories')}
                                    </button>
                                    <button
                                        onClick={() => updateFilter('category', 'inox')}
                                        className={`block w-full text-left text-sm ${categoryFilter === 'inox' ? 'font-bold text-[var(--color-gold)]' : 'text-gray-600'}`}
                                    >
                                        {t('inoxFilter')}
                                    </button>
                                    <button
                                        onClick={() => updateFilter('category', 'nhom')}
                                        className={`block w-full text-left text-sm ${categoryFilter === 'nhom' ? 'font-bold text-[var(--color-gold)]' : 'text-gray-600'}`}
                                    >
                                        {t('nhomFilter')}
                                    </button>
                                </div>
                            </div>

                            {categoryFilter && (
                                <button
                                    onClick={clearFilters}
                                    className="pt-4 text-sm text-[var(--color-gold)] flex items-center gap-1 hover:underline"
                                >
                                    <X size={14} /> {t('clearFilters')}
                                </button>
                            )}
                        </aside>

                        <div className="w-full md:w-3/4">
                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">
                                    {t('noProductsFound')}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProducts.map((product, i) => (
                                        <AnimateSection key={product._id} delay={i * 0.1}>
                                            <ProductCard product={product} />
                                        </AnimateSection>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
