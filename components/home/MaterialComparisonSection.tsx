import AnimateSection from '@/components/AnimateSection';
import { Check } from 'lucide-react';

const columns = [
    {
        name: 'Phin Inox',
        subtitle: 'Stainless Steel 304/430',
        emoji: '🥈',
        highlight: true,
        price: 'Từ 180.000đ',
        features: [
            'Inox 304/430 không gỉ',
            'Màu sắc: Silver, Gold, Bronze, Black (PVD)',
            'Độ bền cực cao, không oxy hóa',
            'Giữ nhiệt xuất sắc',
            'Sang trọng, cao cấp',
            'Khắc laser sắc nét',
            'Phù hợp quà tặng tặng VIP',
            'MOQ: ≥ 50 phin',
        ],
    },
    {
        name: 'Phin Nhôm',
        subtitle: 'Anodized Aluminum',
        emoji: '🌈',
        highlight: false,
        price: 'Từ 120.000đ',
        features: [
            'Nhôm định hình + anodize',
            'Màu sắc: 15+ màu tươi sáng',
            'Nhẹ, tiện dụng',
            'Giữ nhiệt tốt',
            'Phong cách truyền thống',
            'Khắc laser tương phản rõ',
            'Phù hợp quán cà phê, cafe',
            'MOQ: ≥ 60 phin/màu',
        ],
    },
];

export default function MaterialComparisonSection() {
    return (
        <section className="section-padding bg-[var(--color-cream-dark)]">
            <div className="container-custom">
                <div className="text-center mb-14">
                    <AnimateSection>
                        <span className="label-small block mb-4">So Sánh Vật Liệu</span>
                        <h2 className="heading-section text-[var(--color-brown)] mb-4">
                            Inox hay Nhôm?
                            <span className="text-[var(--color-gold)]"> Lựa Chọn Của Bạn</span>
                        </h2>
                        <p className="text-[var(--color-text-muted)] max-w-xl mx-auto">
                            Cả hai đều là vật liệu cao cấp, mỗi loại có ưu điểm riêng. Hãy tìm hiểu để chọn phù hợp nhất.
                        </p>
                    </AnimateSection>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {columns.map((col, i) => (
                        <AnimateSection key={col.name} delay={0.1 + i * 0.15}>
                            <div className={`relative p-8 h-full flex flex-col
                ${col.highlight
                                    ? 'bg-[var(--color-brown)] text-white ring-2 ring-[var(--color-gold)]'
                                    : 'bg-white text-[var(--color-brown)] border border-[var(--color-cream-dark)]'
                                }`}>
                                {col.highlight && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-gold)] text-white text-xs font-medium tracking-widest uppercase px-4 py-1">
                                        Phổ biến nhất
                                    </span>
                                )}
                                <div className="text-center mb-6 pb-6 border-b border-current/10">
                                    <div className="text-4xl mb-3">{col.emoji}</div>
                                    <h3 className="font-serif text-xl mb-1">{col.name}</h3>
                                    <p className={`text-xs tracking-wider uppercase ${col.highlight ? 'text-white/60' : 'text-[var(--color-text-muted)]'}`}>
                                        {col.subtitle}
                                    </p>
                                    <div className={`text-2xl font-serif mt-4 ${col.highlight ? 'text-[var(--color-gold-light)]' : 'text-[var(--color-gold)]'}`}>
                                        {col.price}
                                    </div>
                                </div>

                                <ul className="space-y-3 flex-1">
                                    {col.features.map((feat) => (
                                        <li key={feat} className="flex items-start gap-3 text-sm">
                                            <Check
                                                size={14}
                                                className={`shrink-0 mt-0.5 ${col.highlight ? 'text-[var(--color-gold-light)]' : 'text-[var(--color-gold)]'}`}
                                            />
                                            <span className={col.highlight ? 'text-white/80' : 'text-[var(--color-text-muted)]'}>
                                                {feat}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </AnimateSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
