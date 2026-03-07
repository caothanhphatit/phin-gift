'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import AnimateSection from '@/components/AnimateSection';
import ProductCard from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Filter, X } from 'lucide-react';

interface Category {
    _id: string;
    name: { en: string; vi: string };
    isActive: boolean;
}

interface Product {
    _id: string;
    slug: string;
    name: { en: string; vi: string };
    shortDescription?: { en?: string; vi?: string };
    images: Array<{ url: string; publicId: string; isMain: boolean }>;
    variants: Array<{ sku: string; size?: string; color?: string; price: number; salePrice?: number; stock: number }>;
    categories?: any[]; // Array of ObjectId strings or populated objects
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
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetch('/api/admin/categories')
            .then(r => r.json())
            .then(json => { if (json.success) setCategories(json.data || []); })
            .catch(() => { });
    }, []);

    // categoryFilter is an ObjectId string from the URL query param
    const categoryFilter = searchParams.get('category');

    const updateFilter = (categoryId: string | null) => {
        if (categoryId) {
            router.push(`?category=${categoryId}`, { scroll: false });
        } else {
            router.push('/products', { scroll: false });
        }
    };

    const filteredProducts = useMemo(() => {
        if (!categoryFilter) return initialProducts;

        return initialProducts.filter(p => {
            if (!p.categories || p.categories.length === 0) return false;
            // categories can be ObjectId strings or populated objects with _id
            return p.categories.some((c: any) => {
                const id = typeof c === 'object' ? (c._id?.toString() || c.toString()) : String(c);
                return id === categoryFilter;
            });
        });
    }, [initialProducts, categoryFilter]);

    const activeCategoryName = useMemo(() => {
        if (!categoryFilter) return null;
        const found = categories.find(c => c._id === categoryFilter);
        return found?.name?.[locale] || null;
    }, [categoryFilter, categories, locale]);

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
                            {activeCategoryName
                                ? activeCategoryName
                                : locale === 'en' ? 'Coffee Filter Collection' : 'Bộ Sưu Tập Phin'}
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
                        <aside className={`w-full md:w-1/4 space-y-4 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
                            <h3 className="font-serif text-lg text-[var(--color-brown)]">{t('categoryTitle')}</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => updateFilter(null)}
                                    className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${!categoryFilter
                                            ? 'font-bold text-[var(--color-gold)] bg-[var(--color-gold)]/10'
                                            : 'text-gray-600 hover:text-[var(--color-brown)]'
                                        }`}
                                >
                                    {t('allCategories')}
                                </button>

                                {categories.map(cat => (
                                    <button
                                        key={cat._id}
                                        onClick={() => updateFilter(cat._id)}
                                        className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${categoryFilter === cat._id
                                                ? 'font-bold text-[var(--color-gold)] bg-[var(--color-gold)]/10'
                                                : 'text-gray-600 hover:text-[var(--color-brown)]'
                                            }`}
                                    >
                                        {cat.name?.[locale] || cat.name?.en}
                                    </button>
                                ))}

                                {categories.length === 0 && (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-7 bg-gray-100 rounded animate-pulse" />
                                    ))
                                )}
                            </div>

                            {categoryFilter && (
                                <button
                                    onClick={() => updateFilter(null)}
                                    className="pt-2 text-sm text-[var(--color-gold)] flex items-center gap-1 hover:underline"
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
