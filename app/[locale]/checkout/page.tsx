'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface FormData {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
}

export default function CheckoutPage() {
    const { state, totalPrice, dispatch } = useCart();
    const { items } = state;
    const [formData, setFormData] = useState<FormData>({
        fullName: '', phone: '', email: '', address: '', notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const shippingFee = 35000;
    const total = totalPrice + shippingFee;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer: formData, items, total }),
            });
            if (!response.ok) throw new Error('Order submission failed');
            dispatch({ type: 'CLEAR_CART' });
            setIsSubmitted(true);
        } catch {
            setError('Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp qua WhatsApp.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0 && !isSubmitted) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] pt-20">
                <div className="text-center">
                    <h1 className="font-serif text-3xl text-[var(--color-brown)] mb-4">Giỏ hàng trống</h1>
                    <Link href="/products" className="btn-primary">Mua Sắm Ngay</Link>
                </div>
            </section>
        );
    }

    if (isSubmitted) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] pt-20">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center max-w-md mx-auto px-4"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={40} className="text-green-600" />
                    </div>
                    <h1 className="font-serif text-3xl text-[var(--color-brown)] mb-4">Đặt Hàng Thành Công!</h1>
                    <p className="text-[var(--color-text-muted)] mb-2">
                        Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ trong vòng 24 giờ để xác nhận đơn hàng.
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)] mb-8">
                        Liên hệ: <a href="tel:+84909806977" className="text-[var(--color-gold)]">(+84)35 9331 365</a>
                    </p>
                    <Link href="/products" className="btn-primary">Tiếp Tục Mua Hàng</Link>
                </motion.div>
            </section>
        );
    }

    return (
        <section className="section-padding bg-[var(--color-cream)] min-h-screen pt-32">
            <div className="container-custom">
                <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-brown)] mb-10">Thanh Toán</h1>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Form */}
                    <div className="lg:col-span-3">
                        <Link href="/cart" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors mb-8">
                            <ArrowLeft size={14} /> Quay lại Giỏ Hàng
                        </Link>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="label-small block mb-2">Họ Và Tên *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nguyễn Văn A"
                                        className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="label-small block mb-2">Số Điện Thoại *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="0909 80 69 77"
                                        className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label-small block mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="email@example.com"
                                    className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="label-small block mb-2">Địa Chỉ Giao Hàng *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                                    className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="label-small block mb-2">Ghi Chú Đơn Hàng</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Ghi chú về thiết kế khắc, bao bì, hoặc yêu cầu đặc biệt..."
                                    className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors resize-none"
                                />
                            </div>

                            {error && (
                                <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 text-red-600 text-sm">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    {error}
                                </div>
                            )}

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileTap={{ scale: 0.99 }}
                                className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Đang xử lý...' : `Đặt Hàng – ${total.toLocaleString('vi-VN')}đ`}
                            </motion.button>

                            <p className="text-xs text-center text-[var(--color-text-muted)]">
                                Bằng cách đặt hàng, bạn đồng ý với chính sách đổi trả và điều khoản dịch vụ của PhinGift.
                            </p>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 sticky top-24">
                            <h2 className="font-serif text-xl text-[var(--color-brown)] mb-6">Tóm Tắt Đơn Hàng</h2>

                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 shrink-0 bg-[var(--color-cream)] overflow-hidden">
                                            <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="64px" />
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-brown)] text-white text-[9px] rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[var(--color-brown)] truncate">{item.productName}</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">{item.materialLabel} · {item.size}</p>
                                            {item.engravingText && (
                                                <p className="text-xs text-[var(--color-text-muted)] italic truncate">"{item.engravingText}"</p>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-[var(--color-brown)] shrink-0">
                                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[var(--color-cream-dark)] pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
                                    <span>Tạm tính</span>
                                    <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
                                    <span>Phí giao hàng (dự kiến)</span>
                                    <span>{shippingFee.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between font-serif text-xl text-[var(--color-brown)] pt-2 border-t border-[var(--color-cream-dark)]">
                                    <span>Tổng cộng</span>
                                    <span>{total.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
