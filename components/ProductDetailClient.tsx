'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useLocale } from 'next-intl';

interface BilingualString {
    vi: string;
    en: string;
}

interface ProductVariant {
    size: string;
    color: string;
    image: string;
}

interface ProductSheet {
    id: string;
    slug: string;
    category: string;
    title: BilingualString;
    description: BilingualString;
    price: number;
    variants: ProductVariant[];
    tags: string[];
}

interface ProductDetailClientProps {
    product: ProductSheet;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const locale = useLocale() as 'vi' | 'en';
    const title = product.title[locale] || product.title['vi'];
    const desc = product.description[locale] || product.description['vi'];

    // Fallbacks to generic images if variant missing
    const defaultImage = '/images/products/phin-collection.jpg';

    const availableSizes = useMemo(() => {
        const sizes = new Set<string>();
        product.variants.forEach(v => {
            if (v.size) sizes.add(v.size);
        });
        return Array.from(sizes);
    }, [product]);

    const availableColors = useMemo(() => {
        const colors = new Set<string>();
        product.variants.forEach(v => {
            if (v.color) colors.add(v.color);
        });
        return Array.from(colors);
    }, [product]);

    const aggregatedImages = useMemo(() => {
        const imgs = product.variants.map(v => v.image).filter(Boolean);
        return imgs.length > 0 ? imgs : [defaultImage];
    }, [product, defaultImage]);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || '150ml');
    const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || 'silver');
    const [engravingText, setEngravingText] = useState('');
    const [addedToCart, setAddedToCart] = useState(false);

    const { addToCart } = useCart();

    const price = product.price || 0;

    const handleAddToCart = () => {
        addToCart({
            productId: product.id,
            productSlug: product.slug,
            productName: title,
            material: product.category as any,
            materialLabel: product.category === 'inox' ? 'Inox' : 'Nhôm', // Or adapt dynamically based on locale
            size: selectedSize as any,
            engravingText,
            price,
            quantity: 1,
            image: aggregatedImages[selectedImage] || defaultImage,
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div>
                <div className="relative aspect-square overflow-hidden bg-[var(--color-cream)] mb-4">
                    <Image
                        src={aggregatedImages[selectedImage]}
                        alt={`${title} - hình ${selectedImage + 1}`}
                        fill
                        className="object-cover transition-opacity duration-300"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                    />
                </div>
                {aggregatedImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                        {aggregatedImages.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={`relative aspect-square overflow-hidden border-2 transition-all duration-200
                  ${selectedImage === i ? 'border-[var(--color-gold)]' : 'border-transparent hover:border-[var(--color-brown)]/30'}`}
                            >
                                <Image src={src} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="150px" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div>
                <span className="inline-block uppercase tracking-widest text-[#B5915F] font-semibold text-xs mb-4">
                    {product.category === 'inox' ? 'Inox' : product.category === 'nhom' ? 'Alu' : product.category}
                </span>

                <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-brown)] mb-2">
                    {title}
                </h1>
                <p className="text-[var(--color-text-muted)] mb-6 leading-relaxed line-clamp-3">{desc}</p>

                {/* Price */}
                <div className="mb-8">
                    <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                        {locale === 'en' ? 'Price' : 'Giá'}
                    </span>
                    <div className="font-serif text-4xl text-[var(--color-brown)] mt-1">
                        {price.toLocaleString('vi-VN')}{locale === 'en' ? ' VND' : 'đ'}
                    </div>
                </div>

                {/* Size Selector */}
                {availableSizes.length > 0 && (
                    <div className="mb-6">
                        <label className="label-small block mb-3">
                            {locale === 'en' ? 'Size' : 'Kích Thước'}: <span className="normal-case font-normal text-[var(--color-brown)]">{selectedSize}</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {availableSizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-5 py-2.5 text-sm border transition-all duration-200
                      ${selectedSize === size
                                            ? 'border-[var(--color-brown)] bg-[var(--color-brown)] text-white'
                                            : 'border-[var(--color-cream-dark)] text-[var(--color-text-muted)] hover:border-[var(--color-brown)]'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Color Selector */}
                {availableColors.length > 0 && (
                    <div className="mb-6">
                        <label className="label-small block mb-3">
                            {locale === 'en' ? 'Color' : 'Màu sắc'}: <span className="normal-case font-normal uppercase text-[var(--color-brown)]">{selectedColor}</span>
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {availableColors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-5 py-2.5 text-sm border transition-all duration-200 capitalize
                      ${selectedColor === color
                                            ? 'border-[var(--color-brown)] bg-[var(--color-brown)] text-white'
                                            : 'border-[var(--color-cream-dark)] text-[var(--color-text-muted)] hover:border-[var(--color-brown)]'
                                        }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Engraving Text */}
                <div className="mb-8">
                    <label className="label-small block mb-3">
                        {locale === 'en' ? 'Engraving Text' : 'Nội Dung Khắc Laser'}{' '}
                        <span className="normal-case font-normal text-[var(--color-text-muted)] tracking-normal">
                            ({locale === 'en' ? 'optional' : 'tùy chọn'})
                        </span>
                    </label>
                    <input
                        type="text"
                        value={engravingText}
                        onChange={(e) => setEngravingText(e.target.value)}
                        placeholder={locale === 'en' ? "Name, logo, your story..." : "Nhập tên, logo, câu chuyện của bạn..."}
                        maxLength={100}
                        className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)]
              bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors"
                    />
                </div>

                {/* Add to Cart */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className={`w-full py-4 flex items-center justify-center gap-3 text-sm font-medium tracking-widest uppercase transition-all duration-300
            ${addedToCart
                            ? 'bg-green-700 text-white'
                            : 'bg-[var(--color-brown)] text-white hover:bg-[var(--color-brown-light)]'
                        }`}
                >
                    {addedToCart ? (
                        <>
                            <Check size={18} /> {locale === 'en' ? 'Added to Cart' : 'Đã Thêm Vào Giỏ'}
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={18} /> {locale === 'en' ? 'Add To Cart' : 'Thêm Vào Giỏ Hàng'}
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
