import Image from 'next/image';
import AnimateSection from '@/components/AnimateSection';

export default function StorySection() {
    return (
        <section className="section-padding bg-[var(--color-cream)]">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Text */}
                    <div>
                        <AnimateSection delay={0.1}>
                            <span className="label-small block mb-4">Câu Chuyện Của Chúng Tôi</span>
                            <h2 className="heading-section text-[var(--color-brown)] mb-6">
                                Hơn Một Chiếc Phin,
                                <br />
                                <em>Là Một Ký Ức</em>
                            </h2>
                        </AnimateSection>
                        <AnimateSection delay={0.2}>
                            <p className="text-[var(--color-text-muted)] leading-relaxed mb-5">
                                Người Việt uống cà phê không chỉ bằng miệng, mà bằng cả trái tim. Mỗi giọt cà phê
                                nhỏ từ từ qua phin là một khoảnh khắc dừng lại, lắng nghe chính mình.
                            </p>
                            <p className="text-[var(--color-text-muted)] leading-relaxed mb-5">
                                PhinGift ra đời với sứ mệnh biến chiếc phin bình thường thành một vật phẩm đặc biệt –
                                khắc lên đó logo công ty, tên người thân, hay một câu chuyện ý nghĩa mà bạn muốn gửi trao.
                            </p>
                            <p className="text-[var(--color-text-muted)] leading-relaxed">
                                Mỗi chiếc phin chúng tôi làm ra đều mang theo câu chuyện của người nhận nó.
                                <strong className="text-[var(--color-brown)]"> Đó là cà phê của bạn. Câu chuyện của bạn.</strong>
                            </p>
                        </AnimateSection>

                        <AnimateSection delay={0.3}>
                            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-[var(--color-cream-dark)]">
                                {[
                                    { number: '1000+', label: 'Phin đã giao' },
                                    { number: '15+', label: 'Màu sắc' },
                                    { number: '100%', label: 'Made in VN' },
                                ].map((stat) => (
                                    <div key={stat.label} className="text-center">
                                        <div className="font-serif text-3xl text-[var(--color-gold)] font-semibold mb-1">
                                            {stat.number}
                                        </div>
                                        <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimateSection>
                    </div>

                    {/* Image */}
                    <AnimateSection direction="left" delay={0.2}>
                        <div className="relative aspect-[4/5] overflow-hidden">
                            <Image
                                src="/images/products/phin-collection.jpg"
                                alt="Bộ sưu tập phin cà phê PhinGift"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            {/* Decorative frame */}
                            <div className="absolute -bottom-4 -right-4 w-3/4 h-3/4 border border-[var(--color-gold)]/30 pointer-events-none" />
                        </div>
                    </AnimateSection>
                </div>
            </div>
        </section>
    );
}
