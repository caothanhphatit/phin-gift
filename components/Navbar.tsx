'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

const navLinks = [
    { label: 'Trang Chủ', href: '/' },
    {
        label: 'Sản Phẩm',
        href: '/products',
        dropdown: [
            { label: 'Phin Cà Phê Inox', href: '/products/phin-ca-phe-inox' },
            { label: 'Phin Cà Phê Nhôm', href: '/products/phin-ca-phe-nhom' },
            { label: 'Phin Khắc Logo', href: '/products/phin-ca-phe-khac-logo' },
        ],
    },
    { label: 'Blog', href: '/blog' },
    { label: 'Về Chúng Tôi', href: '/about' },
    { label: 'Liên Hệ', href: '/contact' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const { totalItems } = useCart();
    const pathname = usePathname();
    const isHomePage = pathname === '/';

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

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
                <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-[var(--color-gold)] flex items-center justify-center">
                                <svg viewBox="0 0 36 36" fill="none" className="w-5 h-5">
                                    <ellipse cx="18" cy="20" rx="10" ry="7" fill="white" opacity="0.15" />
                                    <path d="M12 12 L14 26 L22 26 L24 12 Z" fill="white" opacity="0.7" />
                                    <circle cx="18" cy="10" r="3" fill="white" />
                                    <path d="M10 12 H26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M11 26 H25" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="font-serif text-xl text-white font-semibold tracking-wide">
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
                                                            className="block px-5 py-3 text-sm text-[var(--color-brown)] hover:bg-[var(--color-cream)] hover:text-[var(--color-gold)] transition-colors duration-150"
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
                            <Link
                                href="/cart"
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
                            </Link>

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
                                <span className="font-serif text-white text-lg">Menu</span>
                                <button onClick={() => setIsMobileOpen(false)} className="text-white/70 hover:text-white p-1">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto py-4">
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
                                    Giỏ Hàng {totalItems > 0 && `(${totalItems})`}
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
