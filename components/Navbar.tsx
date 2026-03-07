'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useTranslations, useLocale } from 'next-intl';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const { totalItems, dispatch } = useCart();
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('nav');

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/admin/categories');
                const data = await res.json();
                if (data.success) {
                    setCategories(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch categories for nav:', error);
            }
        };
        fetchCategories();
    }, []);

    const isHomePage = pathname === '/';

    const navLinks = [
        { label: t('home'), href: '/' },
        {
            label: t('products'),
            href: '/products',
            dropdown: [
                ...(categories.length > 0
                    ? categories.map(c => ({
                        label: c.name[locale as keyof typeof c.name] || c.name.en,
                        href: `/products?category=${c._id}`,
                        divider: false,
                    }))
                    : [
                        { label: t('inox_filter'), href: '/products?category=inox', divider: false },
                        { label: t('aluminum_filter'), href: '/products?category=nhom', divider: false },
                    ]),
            ],
        },
        { label: t('blog'), href: '/blog' },
        { label: t('about'), href: '/about' },
        { label: t('contact'), href: '/products/phin-ca-phe-khac-logo' },
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileOpen(false);
        setOpenDropdown(null);
    }, [pathname]);

    const navBg = isHomePage
        ? isScrolled
            ? 'bg-[var(--color-brown-dark)]/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        : 'bg-[var(--color-brown-dark)] shadow-md';

    const changeLanguage = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center group">
                            <span className="font-serif text-2xl md:text-3xl text-white font-medium tracking-tight transition-all duration-300 group-hover:text-[var(--color-gold)]">
                                PhinGift
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-6">
                            {navLinks.map((link) =>
                                link.dropdown ? (
                                    <div
                                        key={link.href}
                                        className="relative"
                                        onMouseEnter={() => setOpenDropdown(link.label)}
                                        onMouseLeave={() => setOpenDropdown(null)}
                                    >
                                        <button className="flex items-center gap-1 text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-200 py-2">
                                            {link.label}
                                            <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {openDropdown === link.label && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 8 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-0 min-w-[220px] bg-white shadow-xl py-2 mt-1"
                                                >
                                                    {link.dropdown.map((item) => (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className={`block px-5 py-3 text-sm transition-colors duration-150 ${(item as any).divider
                                                                ? 'border-t border-gray-100 text-[var(--color-gold)] font-semibold hover:bg-[var(--color-cream)] mt-1'
                                                                : 'text-[var(--color-brown)] hover:bg-[var(--color-cream)] hover:text-[var(--color-gold)]'
                                                                }`}
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`text-sm tracking-wide transition-colors duration-200 py-2
                      ${pathname === link.href ? 'text-[var(--color-gold)]' : 'text-white/80 hover:text-white'}`}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            )}
                        </div>

                        {/* Right actions */}
                        <div className="flex items-center gap-3">
                            {/* Language Switcher */}
                            <div className="hidden md:flex flex-col items-center gap-1 mx-2">
                                <div className="flex items-center text-xs font-semibold text-white/80 border border-white/20 rounded p-1">
                                    <div className="relative group">
                                        <button
                                            onClick={() => changeLanguage('vi')}
                                            className={`px-2 py-1 tracking-wider ${locale === 'vi' ? 'bg-white/20 text-white rounded-sm' : 'hover:text-white'}`}
                                        >
                                            VI
                                        </button>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                                            <div className="bg-[var(--color-brown-dark)] border border-white/10 text-white/80 text-[10px] rounded px-2 py-1.5 whitespace-nowrap shadow-lg">
                                                🇻🇳 Vietnamese locale coming soon
                                            </div>
                                        </div>
                                    </div>
                                    <span className="opacity-30">|</span>
                                    <button
                                        onClick={() => changeLanguage('en')}
                                        className={`px-2 py-1 tracking-wider ${locale === 'en' ? 'bg-white/20 text-white rounded-sm' : 'hover:text-white'}`}
                                    >
                                        EN
                                    </button>
                                </div>
                                <span className="text-[9px] text-[var(--color-gold)]/70 tracking-wider whitespace-nowrap">🇻🇳 Proudly Made in Vietnam</span>
                            </div>

                            <button
                                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                                className="relative text-white/80 hover:text-white transition-colors p-2"
                                aria-label="Giỏ hàng"
                            >
                                <ShoppingCart size={20} />
                                {totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[var(--color-gold)] text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] px-0.5"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </button>

                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setIsMobileOpen(!isMobileOpen)}
                                className="lg:hidden text-white/80 hover:text-white transition-colors p-2"
                                aria-label="Menu"
                            >
                                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed right-0 top-0 bottom-0 z-50 w-[300px] bg-[var(--color-brown-dark)] flex flex-col"
                        >
                            <div className="flex items-center justify-between px-6 h-16">
                                <span className="font-serif text-white text-lg">{t('menu')}</span>
                                <button onClick={() => setIsMobileOpen(false)} className="text-white/70 hover:text-white p-1">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Mobile Language Switcher */}
                            <div className="flex flex-col items-center py-4 border-b border-white/5 mx-6 gap-3">
                                <div className="flex items-center justify-center gap-4">
                                    <div className="relative">
                                        <button
                                            onClick={() => changeLanguage('vi')}
                                            className={`flex items-center gap-2 text-sm font-semibold tracking-wider ${locale === 'vi' ? 'text-[var(--color-gold)]' : 'text-white/60'}`}
                                        >
                                            Tiếng Việt {locale === 'vi' && '✓'}
                                        </button>
                                    </div>
                                    <span className="text-white/20">|</span>
                                    <button
                                        onClick={() => changeLanguage('en')}
                                        className={`flex items-center gap-2 text-sm font-semibold tracking-wider ${locale === 'en' ? 'text-[var(--color-gold)]' : 'text-white/60'}`}
                                    >
                                        English {locale === 'en' && '✓'}
                                    </button>
                                </div>
                                <p className="text-[10px] text-white/40 tracking-wide">🇻🇳 Proudly Made in Vietnam · Vietnamese locale coming soon</p>
                            </div>

                            <div className="flex-1 overflow-y-auto py-2">
                                {navLinks.map((link) => (
                                    <div key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={`block px-6 py-3.5 text-sm tracking-wide border-b border-white/5
                        ${pathname === link.href ? 'text-[var(--color-gold)]' : 'text-white/80 hover:text-white'}`}
                                        >
                                            {link.label}
                                        </Link>
                                        {link.dropdown && (
                                            <div className="bg-black/20">
                                                {link.dropdown.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className="block px-10 py-3 text-sm text-white/60 hover:text-[var(--color-gold)] border-b border-white/5"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 border-t border-white/10">
                                <Link href="/cart" className="btn-outline-light w-full justify-center text-center">
                                    {t('cart')} {totalItems > 0 && `(${totalItems})`}
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
