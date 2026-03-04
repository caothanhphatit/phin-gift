'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Product, ProductMaterial, ProductSize, materialLabels, sizeLabels, getProductPrice } from '@/lib/products';
import { useCart } from '@/lib/cart-context';

interface ProductDetailClientProps {
    product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedMaterial, setSelectedMaterial] = useState<ProductMaterial>(product.variants[0]?.material ?? 'inox');
    const [selectedSize, setSelectedSize] = useState<ProductSize>(product.variants[0]?.size ?? '150ml');
    const [engravingText, setEngravingText] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();

    const availableMaterials = [...new Set(product.variants.map((v) => v.material))];
    const availableSizes = [...new Set(product.variants.map((v) => v.size))];
    const price = getProductPrice(product, selectedMaterial, selectedSize);

    const handleAddToCart = () => {
        addToCart({
            productId: product.id,
            productSlug: product.slug,
            productName: product.name,
            material: selectedMaterial,
            materialLabel: materialLabels[selectedMaterial],
            size: selectedSize,
            engravingText,
            price,
            quantity: 1,
            image: product.images[0],
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
                        src={product.images[selectedImage]}
                        alt={`${product.name} - hình ${selectedImage + 1}`}
                        fill
                        className="object-cover transition-opacity duration-300"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                    />
                </div>
                {product.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-3">
                        {product.images.map((src, i) => (
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
                {product.badge && (
                    <span className="inline-block bg-[var(--color-gold)] text-white text-xs font-medium tracking-widest uppercase px-3 py-1 mb-4">
                        {product.badge}
                    </span>
                )}

                <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-brown)] mb-2">
                    {product.name}
                </h1>
                <p className="text-[var(--color-text-muted)] mb-6 leading-relaxed">{product.description}</p>

                {/* Price */}
                <div className="mb-8">
                    <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Giá</span>
                    <div className="font-serif text-4xl text-[var(--color-brown)] mt-1">
                        {price.toLocaleString('vi-VN')}đ
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">Chưa bao gồm phí giao hàng</span>
                </div>

                {/* Material Selector */}
                <div className="mb-6">
                    <label className="label-small block mb-3">
                        Chất Liệu: <span className="normal-case font-normal text-[var(--color-brown)]">{materialLabels[selectedMaterial]}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {availableMaterials.map((mat) => (
                            <button
                                key={mat}
                                onClick={() => setSelectedMaterial(mat)}
                                className={`px-5 py-2.5 text-sm border transition-all duration-200
                  ${selectedMaterial === mat
                                        ? 'border-[var(--color-brown)] bg-[var(--color-brown)] text-white'
                                        : 'border-[var(--color-cream-dark)] text-[var(--color-text-muted)] hover:border-[var(--color-brown)]'
                                    }`}
                            >
                                {materialLabels[mat]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                    <label className="label-small block mb-3">
                        Kích Thước: <span className="normal-case font-normal text-[var(--color-brown)]">{sizeLabels[selectedSize]}</span>
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

                {/* Engraving Text */}
                <div className="mb-8">
                    <label className="label-small block mb-3">
                        Nội Dung Khắc Laser{' '}
                        <span className="normal-case font-normal text-[var(--color-text-muted)] tracking-normal">(tùy chọn)</span>
                    </label>
                    <input
                        type="text"
                        value={engravingText}
                        onChange={(e) => setEngravingText(e.target.value)}
                        placeholder="Nhập tên, logo, câu chuyện của bạn..."
                        maxLength={100}
                        className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)]
              bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors"
                    />
                    <p className="text-xs text-[var(--color-text-muted)] mt-1.5">
                        {engravingText.length}/100 ký tự · File thiết kế (AI/PDF) có thể gửi qua email sau khi đặt hàng
                    </p>
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
                            <Check size={18} /> Đã Thêm Vào Giỏ
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={18} /> Thêm Vào Giỏ Hàng
                        </>
                    )}
                </motion.button>

                <p className="text-xs text-center text-[var(--color-text-muted)] mt-3">
                    Giao hàng toàn quốc · Đổi trả trong 7 ngày
                </p>

                {/* Short Features */}
                <div className="mt-8 pt-8 border-t border-[var(--color-cream-dark)]">
                    <ul className="grid grid-cols-1 gap-2">
                        {product.features.slice(0, 4).map((f) => (
                            <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--color-text-muted)]">
                                <Check size={14} className="text-[var(--color-gold)] shrink-0 mt-0.5" />
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* FAQ Section – spans full width below */}
            <div className="lg:col-span-2 mt-4">
                <h2 className="font-serif text-2xl text-[var(--color-brown)] mb-6">Câu Hỏi Thường Gặp</h2>
                <div className="space-y-2">
                    {product.faq.map((item, i) => (
                        <div key={i} className="border border-[var(--color-cream-dark)]">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between text-left px-6 py-4 text-[var(--color-brown)] hover:bg-[var(--color-cream)] transition-colors"
                            >
                                <span className="font-medium text-sm">{item.question}</span>
                                {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {openFaq === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-6 pb-5 text-sm text-[var(--color-text-muted)] leading-relaxed"
                                >
                                    {item.answer}
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
