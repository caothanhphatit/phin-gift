'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
    const t = useTranslations('home');
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/hero/phin-coffee-pour.jpg"
                    alt={t('heroTitle')}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                {/* Multi-layer overlay for warm, dark, premium feel */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-brown-dark)]/90 via-[var(--color-brown-dark)]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brown-dark)]/60 via-transparent to-[var(--color-brown-dark)]/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-20 pb-16">
                <div className="max-w-2xl">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="label-small text-[var(--color-gold)] mb-4 block"
                    >
                        Proudly Made in Vietnam 🇻🇳
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.4 }}
                        className="heading-display text-white mb-6"
                    >
                        Your Coffee.
                        <br />
                        <span className="text-[var(--color-gold)]">Your Story.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-white/75 text-lg leading-relaxed mb-10 max-w-lg"
                    >
                        {t('heroDesc')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            href="/products"
                            className="btn-primary group"
                        >
                            {t('collection')}
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/products/phin-ca-phe-khac-logo"
                            className="btn-outline-light"
                        >
                            Đặt Hàng Sỉ / B2B
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
            >
                <span className="text-white/40 text-xs tracking-widest uppercase">Cuộn xuống</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"
                />
            </motion.div>
        </section>
    );
}
