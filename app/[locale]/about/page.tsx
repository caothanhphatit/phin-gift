import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AnimateSection from '@/components/AnimateSection';
import { Heart, Award, Users, Leaf } from 'lucide-react';


export const metadata: Metadata = {
    title: 'Về Chúng Tôi | PhinGift – Phin Cà Phê Khắc Logo Việt Nam',
    description: 'PhinGift – thương hiệu phin cà phê khắc logo cao cấp Made in Vietnam. Kết hợp nghệ thuật thủ công truyền thống với công nghệ laser hiện đại.',
};

const values = [
    { icon: Heart, title: 'Đam Mê Cà Phê', description: 'Mỗi chiếc phin là tình yêu với văn hóa uống cà phê Việt Nam – chậm rãi, đậm đà, và ý nghĩa.' },
    { icon: Award, title: 'Chất Lượng Cao Cấp', description: 'Inox 304/430 và nhôm định hình tiêu chuẩn an toàn thực phẩm, khắc laser chính xác.' },
    { icon: Users, title: 'Phục Vụ B2B & C2C', description: 'Từ cá nhân đến doanh nghiệp lớn – chúng tôi đều có giải pháp phù hợp.' },
    { icon: Leaf, title: 'Made in Vietnam', description: 'Tự hào sản xuất tại Việt Nam, hỗ trợ thợ thủ công và ngành cà phê nội địa.' },
];

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-32 pb-20 bg-[var(--color-brown-dark)] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image src="/images/craftsmanship/laser-engraving.jpg" alt="" fill className="object-cover" />
                </div>
                <div className="relative z-10 container-custom px-4 md:px-8 lg:px-16 text-center">
                    <AnimateSection>
                        <span className="label-small text-[var(--color-gold)] block mb-4">Về Chúng Tôi</span>
                        <h1 className="heading-display text-white mb-6">Câu Chuyện PhinGift</h1>
                        <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
                            PhinGift ra đời từ tình yêu với cà phê Việt Nam và khao khát mang lại
                            những vật phẩm có ý nghĩa – nơi kỹ thuật thủ công gặp gỡ nghệ thuật hiện đại.
                        </p>
                    </AnimateSection>
                </div>
            </section>

            {/* Story */}
            <section className="section-padding bg-[var(--color-cream)]">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <AnimateSection direction="right">
                            <div className="relative aspect-square overflow-hidden">
                                <Image
                                    src="/images/hero/phin-coffee-pour.jpg"
                                    alt="Pha cà phê phin Việt Nam – PhinGift"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                        </AnimateSection>
                        <div>
                            <AnimateSection delay={0.1}>
                                <span className="label-small block mb-4">Nguồn Gốc</span>
                                <h2 className="heading-section text-[var(--color-brown)] mb-6">Từ Tình Yêu Với Cà Phê</h2>
                            </AnimateSection>
                            <AnimateSection delay={0.2}>
                                <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
                                    PhinGift bắt đầu từ một câu hỏi đơn giản: <em>"Tại sao quà tặng liên quan đến cà phê lại không đặc biệt như chính ly cà phê ấy?"</em>
                                </p>
                                <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
                                    Chúng tôi nhận ra rằng chiếc phin – biểu tượng của cà phê Việt Nam – hoàn toàn có thể trở thành một tác phẩm nghệ thuật cá nhân,
                                    mang theo tên, logo, và câu chuyện của người nhận.
                                </p>
                                <p className="text-[var(--color-text-muted)] leading-relaxed">
                                    Từ đó, PhinGift ra đời với sứ mệnh kết hợp kỹ nghệ thủ công Việt Nam truyền thống với công nghệ khắc laser hiện đại,
                                    tạo ra những chiếc phin không chỉ đẹp mà còn mang đầy ý nghĩa.
                                </p>
                            </AnimateSection>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <AnimateSection>
                            <span className="label-small block mb-4">Giá Trị Cốt Lõi</span>
                            <h2 className="heading-section text-[var(--color-brown)]">Điều Chúng Tôi Tin Tưởng</h2>
                        </AnimateSection>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((val, i) => (
                            <AnimateSection key={val.title} delay={i * 0.1}>
                                <div className="text-center p-6">
                                    <div className="w-14 h-14 bg-[var(--color-gold)]/10 flex items-center justify-center mx-auto mb-5">
                                        <val.icon size={28} className="text-[var(--color-gold)]" />
                                    </div>
                                    <h3 className="font-serif text-lg text-[var(--color-brown)] mb-3">{val.title}</h3>
                                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{val.description}</p>
                                </div>
                            </AnimateSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-[var(--color-brown)] text-white text-center">
                <AnimateSection>
                    <h2 className="heading-section text-white mb-6">Bắt Đầu Câu Chuyện Của Bạn</h2>
                    <p className="text-white/70 mb-8 max-w-lg mx-auto">
                        Hãy để PhinGift giúp bạn tạo ra một vật phẩm đặc biệt mang dấu ấn riêng.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products" className="btn-outline-light">Xem Sản Phẩm</Link>
                        <Link href="/contact" className="btn-primary bg-[var(--color-gold)] border-[var(--color-gold)] text-[var(--color-brown)] hover:bg-[var(--color-gold-light)]">Liên Hệ</Link>
                    </div>
                </AnimateSection>
            </section>
        </>
    );
}
