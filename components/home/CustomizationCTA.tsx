import { Link } from '@/i18n/routing';
import AnimateSection from '@/components/AnimateSection';
import { ArrowRight, Star } from 'lucide-react';

export default function CustomizationCTA() {
    return (
        <section className="relative section-padding bg-[var(--color-brown)] overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--color-gold)] rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--color-gold)] rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container-custom relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <AnimateSection>
                        <div className="inline-flex items-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={16} fill="#C9A84C" className="text-[var(--color-gold)]" />
                            ))}
                        </div>
                    </AnimateSection>

                    <AnimateSection delay={0.1}>
                        <span className="label-small block mb-4 text-[var(--color-gold)]">
                            Tùy Chỉnh Hoàn Toàn
                        </span>
                        <h2 className="heading-display text-white mb-6">
                            Tạo Phin Của Riêng Bạn
                        </h2>
                        <p className="text-white/70 text-lg leading-relaxed mb-10">
                            Từ màu sắc, kích thước, đến logo khắc laser và bao bì tùy chỉnh –
                            PhinGift biến ý tưởng của bạn thành hiện thực. Phù hợp cho doanh nghiệp,
                            quán cà phê, hay quà tặng đặc biệt.
                        </p>
                    </AnimateSection>

                    <AnimateSection delay={0.2}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
                            <Link href="/products" className="btn-outline-light group">
                                Xem Sản Phẩm
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/products/phin-ca-phe-khac-logo" className="btn-primary bg-[var(--color-gold)] border-[var(--color-gold)] hover:bg-[var(--color-gold-light)] hover:border-[var(--color-gold-light)] text-[var(--color-brown)]">
                                Liên Hệ Đặt Sỉ
                            </Link>
                        </div>
                    </AnimateSection>

                    {/* Trust badges */}
                    <AnimateSection delay={0.3}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { value: '1000+', label: 'Phin đã giao' },
                                { value: '50+', label: 'Thương hiệu tin dùng' },
                                { value: '7-14', label: 'Ngày sản xuất' },
                                { value: '100%', label: 'Made in Vietnam' },
                            ].map((badge) => (
                                <div key={badge.label} className="text-center">
                                    <div className="font-serif text-3xl text-[var(--color-gold)] mb-1">{badge.value}</div>
                                    <div className="text-white/50 text-xs uppercase tracking-wider">{badge.label}</div>
                                </div>
                            ))}
                        </div>
                    </AnimateSection>
                </div>
            </div>
        </section>
    );
}
