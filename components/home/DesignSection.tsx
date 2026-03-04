'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, Variants } from 'framer-motion';

const components = [
    {
        id: '01',
        name: 'Nắp Phin',
        nameEn: 'Lid',
        description: 'Nắp đậy giữ nhiệt trong quá trình pha, đồng thời là canvas chính để khắc logo hoặc thiết kế.',
        image: '/images/factory/factory-2.png',
        spec: 'ø74.5 · h12.5mm',
    },
    {
        id: '02',
        name: 'Ép Phin',
        nameEn: 'Filter Press',
        description: 'Lưới ép điều chỉnh độ nén cà phê, ảnh hưởng trực tiếp đến tốc độ và hương vị cà phê.',
        image: '/images/factory/factory-1.png',
        spec: 'ø60 · h33mm',
    },
    {
        id: '03',
        name: 'Thân Phin',
        nameEn: 'Filter Body',
        description: 'Thân phin chứa cà phê, được đục lỗ laser chính xác để lọc đều và giữ lại cặn.',
        image: '/images/factory/factory-3.png',
        spec: 'ø72.5 · h59.5mm',
    },
    {
        id: '04',
        name: 'Đế Phin',
        nameEn: 'Base Plate',
        description: 'Đế phin đặt trên miệng ly, thiết kế vừa khít để cà phê nhỏ trực tiếp vào ly.',
        image: '/images/factory/factory-4.png',
        spec: 'ø96 · h14.5mm',
    },
];

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
};

const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function DesignSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

    return (
        <section
            ref={sectionRef}
            className="section-padding bg-[var(--color-brown-dark)] text-white overflow-hidden"
        >
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    variants={headerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    <span className="label-small block mb-4">Thiết Kế</span>
                    <h2 className="heading-section text-white mb-4">
                        Giải Phẫu
                        <span className="text-[var(--color-gold)]"> Chiếc Phin</span>
                    </h2>
                    <p className="text-white/60 max-w-xl mx-auto">
                        Mỗi thành phần được thiết kế tỉ mỉ để mang lại trải nghiệm pha cà phê hoàn hảo nhất.
                    </p>
                </motion.div>

                {/* Blueprint Grid */}
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {components.map((comp) => (
                        <motion.div
                            key={comp.id}
                            variants={itemVariants}
                            className="group relative flex flex-col"
                        >
                            {/* Card */}
                            <div className="relative flex flex-col h-full border border-white/10 bg-white/[0.03] hover:border-[var(--color-gold)]/40 hover:bg-white/[0.06] transition-all duration-500 rounded-sm overflow-hidden">
                                {/* Index badge */}
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="font-serif text-[var(--color-gold)] text-xs tracking-widest opacity-70">
                                        {comp.id}
                                    </span>
                                </div>

                                {/* Blueprint image */}
                                <div className="relative w-full aspect-square overflow-hidden flex items-center justify-center p-4 pt-8">
                                    {/* Subtle grid background — blueprint feel */}
                                    <div
                                        className="absolute inset-0 opacity-5"
                                        style={{
                                            backgroundImage:
                                                'linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px)',
                                            backgroundSize: '20px 20px',
                                        }}
                                    />
                                    <div
                                        className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
                                        style={{ mixBlendMode: 'screen' }}
                                    >
                                        <Image
                                            src={comp.image}
                                            alt={`${comp.name} – bản vẽ kỹ thuật`}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="mx-4 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/30 to-transparent" />

                                {/* Labels */}
                                <div className="p-4 pt-3 flex-1 flex flex-col gap-1">
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="font-serif text-white text-base leading-tight">
                                            {comp.name}
                                        </h3>
                                        <span className="text-[10px] text-white/35 tracking-wider uppercase hidden sm:inline">
                                            {comp.nameEn}
                                        </span>
                                    </div>
                                    <p className="text-white/50 text-xs leading-relaxed mt-1 flex-1">
                                        {comp.description}
                                    </p>
                                    <div className="mt-3 pt-2 border-t border-white/8">
                                        <span className="text-[var(--color-gold)]/60 text-[10px] tracking-widest font-mono">
                                            {comp.spec}
                                        </span>
                                    </div>
                                </div>

                                {/* Hover glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-sm"
                                    style={{
                                        boxShadow: 'inset 0 0 30px 0 rgba(201,168,76,0.08)',
                                    }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom note */}
                <motion.p
                    className="text-center text-white/30 text-xs tracking-widest mt-10 uppercase font-mono"
                    variants={headerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    transition={{ delay: 0.6 }}
                >
                    Bản vẽ kỹ thuật · Tiêu chuẩn sản xuất nhà máy
                </motion.p>
            </div>
        </section>
    );
}
