'use client';

import { useState } from 'react';
import AnimateSection from '@/components/AnimateSection';
import { Phone, Mail, MapPin, MessageCircle, Check } from 'lucide-react';

const contactInfo = [
    {
        icon: Phone,
        label: 'Điện Thoại / WhatsApp',
        value: '(+84) 909 80 69 77',
        href: 'tel:+84909806977',
    },
    {
        icon: Mail,
        label: 'Email',
        value: 'phingift@gmail.com',
        href: 'mailto:phingift@gmail.com',
    },
    {
        icon: MessageCircle,
        label: 'WhatsApp Business',
        value: 'Nhắn tin ngay',
        href: 'https://wa.me/84909806977',
    },
    {
        icon: MapPin,
        label: 'Địa Chỉ',
        value: 'TP. Hồ Chí Minh, Việt Nam',
        href: '#',
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await new Promise(r => setTimeout(r, 1000)); // Simulate API call
        setSubmitted(true);
        setSubmitting(false);
    };

    return (
        <>
            {/* Header */}
            <section className="pt-32 pb-16 bg-[var(--color-brown-dark)] text-white text-center">
                <div className="container-custom px-4 md:px-8 lg:px-16">
                    <AnimateSection>
                        <span className="label-small text-[var(--color-gold)] block mb-4">Liên Hệ</span>
                        <h1 className="heading-display text-white mb-4">Nói Chuyện Với Chúng Tôi</h1>
                        <p className="text-white/60 max-w-xl mx-auto">
                            Chúng tôi luôn sẵn sàng tư vấn, báo giá sỉ, và hỗ trợ thiết kế cho đơn hàng của bạn.
                        </p>
                    </AnimateSection>
                </div>
            </section>

            {/* Contact */}
            <section className="section-padding bg-[var(--color-cream)]">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Info */}
                        <div>
                            <AnimateSection>
                                <h2 className="font-serif text-2xl text-[var(--color-brown)] mb-8">Thông Tin Liên Hệ</h2>
                            </AnimateSection>
                            <div className="space-y-6 mb-10">
                                {contactInfo.map((info, i) => (
                                    <AnimateSection key={info.label} delay={i * 0.1}>
                                        <a
                                            href={info.href}
                                            target={info.href.startsWith('http') ? '_blank' : undefined}
                                            rel="noopener noreferrer"
                                            className="flex items-start gap-4 group"
                                        >
                                            <div className="w-11 h-11 bg-[var(--color-gold)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-gold)]/20 transition-colors">
                                                <info.icon size={18} className="text-[var(--color-gold)]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{info.label}</p>
                                                <p className="text-[var(--color-brown)] font-medium group-hover:text-[var(--color-gold)] transition-colors">
                                                    {info.value}
                                                </p>
                                            </div>
                                        </a>
                                    </AnimateSection>
                                ))}
                            </div>

                            <AnimateSection delay={0.3}>
                                <div className="bg-[var(--color-brown)] p-6 text-white">
                                    <h3 className="font-serif text-lg mb-3">Đặt Hàng Sỉ B2B</h3>
                                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                                        Đơn hàng doanh nghiệp từ 50 phin trở lên: nhận báo giá ưu đãi,
                                        hỗ trợ thiết kế miễn phí, và ưu tiên sản xuất.
                                    </p>
                                    <a
                                        href="https://wa.me/84909806977"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-green-600 text-white text-sm px-5 py-2.5 hover:bg-green-700 transition-colors"
                                    >
                                        <MessageCircle size={16} /> Chat WhatsApp ngay
                                    </a>
                                </div>
                            </AnimateSection>
                        </div>

                        {/* Form */}
                        <AnimateSection direction="left" delay={0.1}>
                            <div className="bg-white p-8">
                                <h2 className="font-serif text-2xl text-[var(--color-brown)] mb-6">Gửi Tin Nhắn</h2>

                                {submitted ? (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Check size={32} className="text-green-600" />
                                        </div>
                                        <h3 className="font-serif text-xl text-[var(--color-brown)] mb-2">Đã gửi thành công!</h3>
                                        <p className="text-[var(--color-text-muted)] text-sm">Chúng tôi sẽ liên hệ lại trong vòng 24 giờ làm việc.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="label-small block mb-2">Họ tên *</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors"
                                                    placeholder="Nguyễn Văn A"
                                                />
                                            </div>
                                            <div>
                                                <label className="label-small block mb-2">Email *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors"
                                                    placeholder="email@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="label-small block mb-2">Chủ đề</label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors"
                                            >
                                                <option value="">Chọn chủ đề...</option>
                                                <option value="b2b">Đặt hàng sỉ / B2B</option>
                                                <option value="custom">Khắc logo tùy chỉnh</option>
                                                <option value="retail">Mua lẻ</option>
                                                <option value="other">Khác</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label-small block mb-2">Nội dung *</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                className="w-full border border-[var(--color-cream-dark)] px-4 py-3 text-sm text-[var(--color-brown)] bg-white focus:outline-none focus:border-[var(--color-brown)] transition-colors resize-none"
                                                placeholder="Mô tả yêu cầu của bạn: số lượng, chất liệu, thiết kế cần khắc..."
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="btn-primary w-full justify-center disabled:opacity-60"
                                        >
                                            {submitting ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </AnimateSection>
                    </div>
                </div>
            </section>
        </>
    );
}
