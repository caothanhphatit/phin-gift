'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/products';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const firstVariant = product.variants[0];

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!firstVariant) return;
        addToCart({
            productId: product.id,
            productSlug: product.slug,
            productName: product.name,
            material: firstVariant.material,
            materialLabel: firstVariant.material === 'inox' ? 'Inox' : 'Nhôm',
            size: firstVariant.size,
            engravingText: '',
            price: firstVariant.price,
            quantity: 1,
            image: product.images[0],
        });
    };

    return (
        <motion.div
            whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(61,44,30,0.15)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="group bg-white overflow-hidden"
        >
            <Link href={`/products/${product.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-[#F5F0E8]">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {product.badge && (
                        <span className="absolute top-4 left-4 bg-[var(--color-gold)] text-white text-xs font-medium tracking-widest uppercase px-3 py-1">
                            {product.badge}
                        </span>
                    )}
                    {/* Quick add overlay */}
                    <div className="absolute inset-0 bg-[var(--color-brown)]/0 group-hover:bg-[var(--color-brown)]/10 transition-all duration-300" />
                    <button
                        onClick={handleQuickAdd}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300
              bg-white text-[var(--color-brown)] text-xs font-medium tracking-widest uppercase px-5 py-2.5 flex items-center gap-2
              hover:bg-[var(--color-brown)] hover:text-white"
                    >
                        <ShoppingCart size={14} />
                        Thêm vào giỏ
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    <p className="label-small mb-1.5">
                        {product.category === 'inox' ? 'Phin Inox' : product.category === 'nhom' ? 'Phin Nhôm' : 'Custom'}
                    </p>
                    <h3 className="font-serif text-lg text-[var(--color-brown)] mb-1 leading-snug">
                        {product.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-4">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs text-[var(--color-text-muted)] block mb-0.5">Từ</span>
                            <span className="font-serif text-xl text-[var(--color-brown)]">
                                {firstVariant?.price.toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-[var(--color-gold)] font-medium tracking-wider uppercase group-hover:gap-2 transition-all duration-200">
                            Chi tiết <ArrowRight size={12} />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
