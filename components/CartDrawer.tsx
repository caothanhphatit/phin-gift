'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { X, Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import OTPVerificationModal from './checkout/OTPVerificationModal';

export default function CartDrawer() {
    const { state, dispatch, totalPrice } = useCart();
    const router = useRouter();
    const locale = useLocale();

    // The localized strings. In a full production app, you might want to move these to your locale JSONs.
    const t = {
        title: locale === 'en' ? 'Your Cart' : 'Giỏ Hàng',
        empty: locale === 'en' ? 'Your cart is empty' : 'Giỏ hàng của bạn đang trống',
        explore: locale === 'en' ? 'Explore Products' : 'Khám Phá Sản Phẩm',
        material: locale === 'en' ? 'Material' : 'Chất liệu',
        size: locale === 'en' ? 'Size' : 'Kích thước',
        color: locale === 'en' ? 'Color' : 'Màu sắc',
        engraving: locale === 'en' ? 'Engraving' : 'Khắc',
        standard: locale === 'en' ? 'Standard' : 'Tiêu chuẩn',
        subtotal: locale === 'en' ? 'Subtotal' : 'Tổng cộng',
        viewCart: locale === 'en' ? 'View Cart' : 'Xem Giỏ Hàng',
        checkout: locale === 'en' ? 'Checkout' : 'Thanh Toán',
    };

    const handleClose = () => {
        dispatch({ type: 'CLOSE_CART' });
    };

    const handleNavigate = (path: string) => {
        handleClose();
        router.push(path);
    };

    const [isOtpOpen, setIsOtpOpen] = useState(false);

    const handleCheckoutClick = () => {
        // Intercept checkout to require OTP phone verification
        const customerId = sessionStorage.getItem('phin_customer_id');
        if (customerId) {
            handleNavigate('/checkout');
        } else {
            setIsOtpOpen(true);
        }
    };

    const handleOtpVerified = (customerId: string) => {
        setIsOtpOpen(false);
        handleNavigate('/checkout');
    };

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (state.isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [state.isOpen]);

    // Added to prevent hydration error where SSR doesn't match CSR due to localStorage load
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <AnimatePresence>
                {state.isOpen && (
                    <motion.div
                        key="cart-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
                    />
                )}

                {state.isOpen && (
                    <motion.div
                        key="cart-drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-[var(--color-cream-dark)]">
                            <h2 className="font-serif text-xl text-[var(--color-brown)] flex items-center gap-2">
                                <ShoppingCart size={20} />
                                {t.title} <span className="text-sm font-sans text-[var(--color-text-muted)] font-normal">({state.items.length})</span>
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-[var(--color-cream)] rounded-full transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-brown)]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {state.items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-[var(--color-cream)] flex items-center justify-center text-[var(--color-cream-dark)]">
                                        <ShoppingCart size={32} />
                                    </div>
                                    <p className="text-[var(--color-text-muted)]">{t.empty}</p>
                                    <button
                                        onClick={() => handleNavigate('/products')}
                                        className="text-sm font-semibold tracking-wider text-[var(--color-gold)] uppercase"
                                    >
                                        {t.explore}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {state.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 group">
                                            {/* Item Image */}
                                            <div className="relative w-20 h-20 bg-[var(--color-cream)] shrink-0 cursor-pointer" onClick={() => handleNavigate(`/products/${item.productSlug}`)}>
                                                <Image
                                                    src={item.image}
                                                    alt={item.productName}
                                                    fill
                                                    className="object-cover"
                                                    sizes="80px"
                                                />
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3
                                                        className="font-serif text-[var(--color-brown)] leading-snug truncate pr-2 cursor-pointer hover:text-[var(--color-gold)] transition-colors"
                                                        onClick={() => handleNavigate(`/products/${item.productSlug}`)}
                                                    >
                                                        {item.productName}
                                                    </h3>
                                                    <button
                                                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                                                        className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors shrink-0 pt-0.5"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>

                                                <div className="text-xs text-[var(--color-text-muted)] space-y-0.5 mt-1 mb-2">
                                                    {item.attributes && Object.entries(item.attributes).map(([key, val]) => {
                                                        const displayVal = val && typeof val === 'object' ? (val as any)[locale] || (val as any).vi || (val as any).en : String(val);
                                                        return (
                                                            <p key={key} className="capitalize">{key}: <span className="text-[var(--color-brown)]">{displayVal}</span></p>
                                                        );
                                                    })}
                                                    {item.engravingText && (
                                                        <p>{t.engraving}: <span className="text-[var(--color-brown)] italic">"{item.engravingText}"</span></p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    {/* Qty controls */}
                                                    <div className="flex items-center border border-[var(--color-cream-dark)] shrink-0">
                                                        <button
                                                            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })}
                                                            className="p-1.5 hover:bg-[var(--color-cream)] transition-colors"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                                                            className="p-1.5 hover:bg-[var(--color-cream)] transition-colors"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>

                                                    <span className="font-serif text-sm text-[var(--color-brown)] font-medium">
                                                        {(item.price * item.quantity).toLocaleString('vi-VN')} {locale === 'en' ? 'VND' : 'đ'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {state.items.length > 0 && (
                            <div className="p-5 border-t border-[var(--color-cream-dark)] bg-[var(--color-cream)]/30">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[var(--color-text-muted)] text-sm">{t.subtotal}</span>
                                    <span className="font-serif text-xl text-[var(--color-brown)]">
                                        {totalPrice.toLocaleString('vi-VN')} {locale === 'en' ? 'VND' : 'đ'}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={handleCheckoutClick}
                                        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
                                    >
                                        {t.checkout} <ArrowRight size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleNavigate('/cart')}
                                        className="btn-outline w-full py-3.5 text-sm"
                                    >
                                        {t.viewCart}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <OTPVerificationModal
                isOpen={isOtpOpen}
                onClose={() => setIsOtpOpen(false)}
                onVerified={handleOtpVerified}
            />
        </>
    );
}
