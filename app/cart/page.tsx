'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
    const { state, dispatch, totalPrice } = useCart();
    const { items } = state;

    if (items.length === 0) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] pt-20">
                <div className="text-center max-w-md mx-auto px-4">
                    <ShoppingCart size={64} className="text-[var(--color-cream-dark)] mx-auto mb-6" />
                    <h1 className="font-serif text-3xl text-[var(--color-brown)] mb-4">Giỏ Hàng Trống</h1>
                    <p className="text-[var(--color-text-muted)] mb-8">
                        Bạn chưa có sản phẩm nào trong giỏ hàng. Khám phá bộ sưu tập phin của chúng tôi!
                    </p>
                    <Link href="/products" className="btn-primary">
                        Khám Phá Ngay <ArrowRight size={16} />
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="section-padding bg-[var(--color-cream)] min-h-screen pt-32">
            <div className="container-custom">
                <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-brown)] mb-10">
                    Giỏ Hàng ({items.length} sản phẩm)
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    className="bg-white p-5 flex gap-5"
                                >
                                    {/* Image */}
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 bg-[var(--color-cream)] overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.productName}
                                            fill
                                            className="object-cover"
                                            sizes="128px"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-serif text-[var(--color-brown)] text-lg leading-snug mb-1">
                                            {item.productName}
                                        </h3>
                                        <div className="text-sm text-[var(--color-text-muted)] space-y-0.5 mb-3">
                                            <p>Chất liệu: <span className="text-[var(--color-brown)]">{item.materialLabel}</span></p>
                                            <p>Kích thước: <span className="text-[var(--color-brown)]">{item.size}</span></p>
                                            {item.engravingText && (
                                                <p>Khắc: <span className="text-[var(--color-brown)] italic">"{item.engravingText}"</span></p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between gap-4 flex-wrap">
                                            {/* Qty controls */}
                                            <div className="flex items-center border border-[var(--color-cream-dark)]">
                                                <button
                                                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })}
                                                    className="p-2 hover:bg-[var(--color-cream)] transition-colors"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                                                    className="p-2 hover:bg-[var(--color-cream)] transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className="font-serif text-lg text-[var(--color-brown)]">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                                </span>
                                                <button
                                                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                                                    className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors p-1"
                                                    aria-label="Xóa sản phẩm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 sticky top-24">
                            <h2 className="font-serif text-xl text-[var(--color-brown)] mb-6">Tóm Tắt Đơn Hàng</h2>

                            <div className="space-y-3 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-[var(--color-text-muted)] truncate mr-2">
                                            {item.productName} ×{item.quantity}
                                        </span>
                                        <span className="text-[var(--color-brown)] shrink-0">
                                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t border-[var(--color-cream-dark)] pt-3">
                                    <div className="flex justify-between text-sm text-[var(--color-text-muted)] mb-2">
                                        <span>Phí giao hàng</span>
                                        <span>Tính khi thanh toán</span>
                                    </div>
                                    <div className="flex justify-between font-serif text-xl text-[var(--color-brown)]">
                                        <span>Tổng cộng</span>
                                        <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout" className="btn-primary w-full justify-center mb-3">
                                Thanh Toán Ngay <ArrowRight size={16} />
                            </Link>
                            <Link href="/products" className="btn-outline w-full justify-center text-sm">
                                Tiếp Tục Mua Hàng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
