import Image from 'next/image';
import AnimateSection from '@/components/AnimateSection';
import { Zap, TreePine } from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Khắc Laser CO₂',
        description: 'Công nghệ laser CO₂ cho phép khắc các chi tiết cực kỳ mịn, sắc nét trên mặt nhôm anodize với độ chính xác đến từng điểm ảnh.',
    },
    {
        icon: TreePine,
        title: 'Tay Cầm Gỗ Beech',
        description: 'Tùy chọn tay cầm bằng gỗ Beech tự nhiên, mang lại cảm giác ấm áp, thân thiện môi trường và sự độc đáo cho từng chiếc phin.',
    },
];

export default function CraftsmanshipSection() {
    return (
        <section className="section-padding bg-[var(--color-cream)]">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Images */}
                    <AnimateSection direction="right" delay={0.1}>
                        <div className="relative">
                            <div className="aspect-square overflow-hidden">
                                <Image
                                    src="/images/craftsmanship/laser-engraving.jpg"
                                    alt="Khắc laser logo lên phin cà phê – PhinGift"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            {/* Small accent image */}
                            <div className="absolute -bottom-6 -right-6 w-2/5 aspect-square overflow-hidden border-4 border-white shadow-xl hidden md:block">
                                <Image
                                    src="/images/products/phin-inox.jpg"
                                    alt="Chi tiết phin cà phê PhinGift"
                                    fill
                                    className="object-cover"
                                    sizes="200px"
                                />
                            </div>
                        </div>
                    </AnimateSection>

                    {/* Text */}
                    <div>
                        <AnimateSection delay={0.1}>
                            <span className="label-small block mb-4">Nghệ Thuật Cá Nhân Hóa</span>
                            <h2 className="heading-section text-[var(--color-brown)] mb-6">
                                Khắc Logo Lên
                                <br />
                                <em className="text-[var(--color-gold)]">Cà Phê Của Bạn</em>
                            </h2>
                            <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
                                Mỗi chiếc phin PhinGift có thể trở thành một tác phẩm nghệ thuật cá nhân.
                                Từ logo doanh nghiệp đến tên riêng, từ câu nói yêu thích đến thiết kế truyền thống Việt Nam –
                                đều có thể được khắc laser với độ chính xác và sắc nét tuyệt vời.
                            </p>
                        </AnimateSection>

                        <div className="space-y-6">
                            {features.map((feature, i) => (
                                <AnimateSection key={feature.title} delay={0.2 + i * 0.1}>
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-11 h-11 bg-[var(--color-gold)]/10 flex items-center justify-center">
                                            <feature.icon size={20} className="text-[var(--color-gold)]" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-[var(--color-brown)] text-base mb-1.5">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </AnimateSection>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
