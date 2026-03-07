'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, ArrowLeft, AlertCircle, Truck, CreditCard, Building2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useLocale } from 'next-intl';

interface FormData {
    fullName: string;
    phone: string;
    email: string;
    provinceCode: string;
    provinceName: string;
    districtCode: string;
    districtName: string;
    wardCode: string;
    wardName: string;
    streetAddress: string;
    notes: string;
}

type PaymentMethod = 'COD' | 'BANK' | 'PAYPAL';

export default function CheckoutPage() {
    const { state, totalPrice, dispatch } = useCart();
    const { items } = state;
    const locale = useLocale();
    const [formData, setFormData] = useState<FormData>({
        fullName: '', phone: '', email: '',
        provinceCode: '', provinceName: '',
        districtCode: '', districtName: '',
        wardCode: '', wardName: '',
        streetAddress: '', notes: '',
    });
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

    // API States
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [error, setError] = useState('');
    const [savedCustomerInfo, setSavedCustomerInfo] = useState<any>(null);
    const [useSavedAddress, setUseSavedAddress] = useState(false);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            const getCookieInfo = () => {
                const name = "phin_customer_info=";
                const decodedCookie = decodeURIComponent(document.cookie);
                const ca = decodedCookie.split(';');
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i];
                    while (c.charAt(0) === ' ') c = c.substring(1);
                    if (c.indexOf(name) === 0) {
                        try { return JSON.parse(c.substring(name.length, c.length)); }
                        catch (e) { return null; }
                    }
                }
                return null;
            };

            const savedInfo = getCookieInfo();
            if (savedInfo) {
                setFormData(prev => ({
                    ...prev,
                    fullName: savedInfo.fullName || '',
                    phone: savedInfo.phone || '',
                    email: savedInfo.email || '',
                }));
                if (savedInfo.address && savedInfo.address.length > 5) {
                    setSavedCustomerInfo(savedInfo);
                    setUseSavedAddress(true);
                }
            } else {
                const savedPhone = sessionStorage.getItem('phin_customer_phone');
                if (savedPhone) setFormData(prev => ({ ...prev, phone: savedPhone }));
            }
        }
    }, []);

    useEffect(() => {
        fetch('https://provinces.open-api.vn/api/p/')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (formData.provinceCode) {
            fetch(`https://provinces.open-api.vn/api/p/${formData.provinceCode}?depth=2`)
                .then(res => res.json())
                .then(data => setDistricts(data.districts || []))
                .catch(err => console.error(err));
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [formData.provinceCode]);

    useEffect(() => {
        if (formData.districtCode) {
            fetch(`https://provinces.open-api.vn/api/d/${formData.districtCode}?depth=2`)
                .then(res => res.json())
                .then(data => setWards(data.wards || []))
                .catch(err => console.error(err));
        } else {
            setWards([]);
        }
    }, [formData.districtCode]);

    const shippingFee = 35000;
    const total = totalPrice + shippingFee;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const up = { ...prev, [name]: value };
            if (name === 'provinceCode') {
                const p = provinces.find(x => String(x.code) === String(value));
                if (p) up.provinceName = p.name;
                up.districtCode = ''; up.districtName = '';
                up.wardCode = ''; up.wardName = '';
            }
            if (name === 'districtCode') {
                const d = districts.find(x => String(x.code) === String(value));
                if (d) up.districtName = d.name;
                up.wardCode = ''; up.wardName = '';
            }
            if (name === 'wardCode') {
                const w = wards.find(x => String(x.code) === String(value));
                if (w) up.wardName = w.name;
            }
            return up;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const fullAddress = useSavedAddress && savedCustomerInfo
            ? savedCustomerInfo.address
            : [formData.streetAddress, formData.wardName, formData.districtName, formData.provinceName]
                .filter(Boolean).join(', ');

        const submissionData = useSavedAddress && savedCustomerInfo
            ? { ...savedCustomerInfo, notes: formData.notes, address: fullAddress }
            : { ...formData, address: fullAddress };

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer: submissionData, items, total, paymentMethod }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Order submission failed');

            // Save customer info to cookie (expires 365 days)
            if (typeof document !== 'undefined') {
                const d = new Date();
                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
                const expires = "expires=" + d.toUTCString();
                const infoToSave = { ...submissionData, notes: '' };
                document.cookie = "phin_customer_info=" + encodeURIComponent(JSON.stringify(infoToSave)) + ";" + expires + ";path=/";
            }

            dispatch({ type: 'CLEAR_CART' });
            setOrderId(data.orderId || '');
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
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
                    <h1 className="font-serif text-3xl text-[var(--color-brown)] mb-2">Đặt Hàng Thành Công!</h1>
                    {orderId && (
                        <p className="text-sm font-mono bg-[var(--color-cream-dark)] px-3 py-1.5 inline-block rounded mb-4 text-[var(--color-brown)]">
                            Mã đơn: {orderId}
                        </p>
                    )}
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

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        {/* ── Left: Shipping Info ── */}
                        <div className="lg:col-span-3 space-y-5">
                            <Link href="/cart" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors">
                                <ArrowLeft size={14} /> Quay lại Giỏ Hàng
                            </Link>

                            <div className="bg-white p-6 space-y-5">
                                <h2 className="font-serif text-lg text-[var(--color-brown)]">Thông Tin Giao Hàng</h2>

                                {/* Saved address selector */}
                                {savedCustomerInfo && (
                                    <div className="space-y-3">
                                        <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${useSavedAddress ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/5' : 'border-[var(--color-cream-dark)] hover:border-[var(--color-brown)]'}`}>
                                            <input
                                                type="radio"
                                                name="addressOption"
                                                checked={useSavedAddress}
                                                onChange={() => setUseSavedAddress(true)}
                                                className="mt-1"
                                            />
                                            <div>
                                                <p className="font-medium text-[var(--color-brown)]">Giao đến địa chỉ đã lưu</p>
                                                <p className="text-sm text-[var(--color-text-muted)] mt-1">{savedCustomerInfo.fullName} — {savedCustomerInfo.phone}</p>
                                                <p className="text-sm text-[var(--color-text-muted)]">{savedCustomerInfo.address}</p>
                                            </div>
                                        </label>
                                        <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${!useSavedAddress ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/5' : 'border-[var(--color-cream-dark)] hover:border-[var(--color-brown)]'}`}>
                                            <input
                                                type="radio"
                                                name="addressOption"
                                                checked={!useSavedAddress}
                                                onChange={() => setUseSavedAddress(false)}
                                            />
                                            <p className="font-medium text-[var(--color-brown)]">Giao đến địa chỉ khác</p>
                                        </label>
                                    </div>
                                )}

                                {/* New address form */}
                                {!useSavedAddress && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="label-small block mb-2">Họ Và Tên *</label>
                                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Nguyễn Văn A"
                                                    className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors" />
                                            </div>
                                            <div>
                                                <label className="label-small block mb-2">Số Điện Thoại *</label>
                                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="0909 80 69 77"
                                                    className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="label-small block mb-2">Email *</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com"
                                                className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors" />
                                            <p className="text-xs text-[var(--color-text-muted)] mt-1.5 italic">* Chúng tôi sẽ gửi email xác nhận đơn hàng qua email</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="label-small block mb-2">Tỉnh / Thành Phố *</label>
                                                <select name="provinceCode" value={formData.provinceCode} onChange={handleChange} required
                                                    className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors">
                                                    <option value="">Chọn Tỉnh / Thành phố</option>
                                                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="label-small block mb-2">Quận / Huyện *</label>
                                                <select name="districtCode" value={formData.districtCode} onChange={handleChange} required disabled={!formData.provinceCode || districts.length === 0}
                                                    className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors disabled:opacity-50 disabled:bg-gray-50">
                                                    <option value="">Chọn Quận / Huyện</option>
                                                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="label-small block mb-2">Phường / Xã *</label>
                                                <select name="wardCode" value={formData.wardCode} onChange={handleChange} required disabled={!formData.districtCode || wards.length === 0}
                                                    className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors disabled:opacity-50 disabled:bg-gray-50">
                                                    <option value="">Chọn Phường / Xã</option>
                                                    {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="label-small block mb-2">Số Nhà / Tên Đường *</label>
                                                <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} required placeholder="Số nhà, tên đường..."
                                                    className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="label-small block mb-2">Ghi Chú Đơn Hàng</label>
                                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
                                        placeholder="Ghi chú về thiết kế khắc, bao bì, hoặc yêu cầu đặc biệt..."
                                        className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors resize-none" />
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Order Summary + Payment + Submit ── */}
                        <div className="lg:col-span-2 space-y-5">
                            {/* Order Summary */}
                            <div className="bg-white p-6">
                                <h2 className="font-serif text-lg text-[var(--color-brown)] mb-5">Tóm Tắt Đơn Hàng</h2>

                                <div className="space-y-4 mb-5">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="relative w-14 h-14 shrink-0 bg-[var(--color-cream)] overflow-hidden rounded">
                                                <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="56px" />
                                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-brown)] text-white text-[9px] rounded-full flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[var(--color-brown)] truncate">{item.productName}</p>
                                                {item.attributes && Object.keys(item.attributes).length > 0 && (
                                                    <div className="text-xs text-[var(--color-text-muted)] truncate">
                                                        {Object.entries(item.attributes).map(([key, val], idx, arr) => (
                                                            <span key={key}>
                                                                {typeof val === 'object' ? (val as any)[locale] || (val as any).vi : String(val)}
                                                                {idx < arr.length - 1 ? ' · ' : ''}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
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

                            {/* Payment Method */}
                            <div className="bg-white p-6">
                                <h2 className="font-serif text-lg text-[var(--color-brown)] mb-4">Phương Thức Thanh Toán</h2>
                                <div className="space-y-3">
                                    {/* COD */}
                                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/5' : 'border-[var(--color-cream-dark)] hover:border-[var(--color-brown)]'}`}>
                                        <input type="radio" name="paymentMethod" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="shrink-0" />
                                        <Truck size={20} className="shrink-0 text-[var(--color-brown)]" />
                                        <div>
                                            <p className="font-medium text-[var(--color-brown)] text-sm">Thanh toán khi nhận hàng (COD)</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">Trả tiền mặt khi nhận hàng</p>
                                        </div>
                                    </label>

                                    {/* Bank Transfer — disabled */}
                                    <label className="flex items-center gap-3 p-4 border border-[var(--color-cream-dark)] rounded-lg opacity-50 cursor-not-allowed bg-gray-50">
                                        <input type="radio" name="paymentMethod" disabled className="shrink-0" />
                                        <Building2 size={20} className="shrink-0 text-[var(--color-text-muted)]" />
                                        <div>
                                            <p className="font-medium text-[var(--color-text-muted)] text-sm">Chuyển khoản ngân hàng</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">Sắp khả dụng</p>
                                        </div>
                                    </label>

                                    {/* PayPal — disabled */}
                                    <label className="flex items-center gap-3 p-4 border border-[var(--color-cream-dark)] rounded-lg opacity-50 cursor-not-allowed bg-gray-50">
                                        <input type="radio" name="paymentMethod" disabled className="shrink-0" />
                                        <CreditCard size={20} className="shrink-0 text-[var(--color-text-muted)]" />
                                        <div>
                                            <p className="font-medium text-[var(--color-text-muted)] text-sm">PayPal</p>
                                            <p className="text-xs text-[var(--color-text-muted)]">Sắp khả dụng</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 text-red-600 text-sm rounded-lg">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    {error}
                                </div>
                            )}

                            {/* Submit */}
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
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
