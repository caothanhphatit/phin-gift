'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useLocale } from 'next-intl';

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
    variants: Array<{ sku: string; size?: string; color?: string; price: number; salePrice?: number; stock: number; attributes?: any; image?: { url: string; publicId: string; } }>;
}

export type { Product };

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart, dispatch } = useCart();
    const locale = useLocale() as 'vi' | 'en';

    const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
    const isOutOfStock = totalStock === 0;

    const firstVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0];
    const displayImage = product.images?.[0]?.url || '/images/products/phin-collection.jpg';
    const displayTitle = product.name?.[locale] || product.name?.['vi'] || 'Product';
    const displayDescription = product.shortDescription?.[locale] || product.shortDescription?.['vi'] || '';
    const displayPrice = firstVariant?.price || 0;

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!firstVariant || isOutOfStock) return;

        addToCart({
            productId: product._id,
            productSlug: product.slug,
            productName: displayTitle,
            attributes: firstVariant.attributes || {},
            engravingText: '',
            price: displayPrice,
            quantity: 1,
            image: firstVariant.image?.url || displayImage,
        });
        dispatch({ type: 'TOGGLE_CART' });
    };

    return (
        <motion.div
            whileHover={!isOutOfStock ? { y: -6, boxShadow: '0 20px 60px rgba(61,44,30,0.15)' } : {}}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`group bg-white overflow-hidden relative ${isOutOfStock ? 'opacity-80' : ''}`}
        >
            <Link href={`/products/${product.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-[#F5F0E8]">
                    <Image
                        src={displayImage}
                        alt={displayTitle}
                        fill
                        className={`object-cover transition-transform duration-700 ${!isOutOfStock ? 'group-hover:scale-105' : ''}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Quick add overlay */}
                    {!isOutOfStock && (
                        <>
                            <div className="absolute inset-0 bg-[var(--color-brown)]/0 group-hover:bg-[var(--color-brown)]/10 transition-all duration-300" />
                            <button
                                onClick={handleQuickAdd}
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300
                    bg-white text-[var(--color-brown)] text-xs font-medium tracking-widest uppercase px-5 py-2.5 flex items-center gap-2
                    hover:bg-[var(--color-brown)] hover:text-white z-20"
                            >
                                <ShoppingCart size={14} />
                                {locale === 'en' ? 'Add' : 'Thêm'}
                            </button>
                        </>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="flex items-center justify-between mb-1.5">
                        <p className="label-small uppercase tracking-widest text-[#B5915F] font-semibold text-xs">
                            {product.slug.includes('inox') ? 'Inox' : product.slug.includes('nhom') ? 'Alu' : 'Phin'}
                        </p>
                        {isOutOfStock && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-0.5 rounded">
                                {locale === 'en' ? 'Out of Stock' : 'Hết hàng'}
                            </span>
                        )}
                    </div>
                    <h3 className={`font-serif text-lg text-[var(--color-brown)] mb-1 leading-snug ${isOutOfStock ? 'text-gray-400' : ''}`}>
                        {displayTitle}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4">
                        {displayDescription}
                    </p>

                    <div className="flex items-center justify-between">
                        <div>
                            <span className={`font-serif text-xl ${isOutOfStock ? 'text-gray-400 line-through decoration-1' : 'text-[var(--color-brown)]'}`}>
                                {displayPrice.toLocaleString('vi-VN')}{locale === 'en' ? ' VND' : 'đ'}
                            </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-[var(--color-gold)] font-medium tracking-wider uppercase group-hover:gap-2 transition-all duration-200">
                            {locale === 'en' ? 'Details' : 'Chi tiết'} <ArrowRight size={12} />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
