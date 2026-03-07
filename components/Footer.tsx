import { Link } from '@/i18n/routing';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[var(--color-brown-dark)] text-white/70">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center mb-5">
                            <span className="font-serif text-xl md:text-2xl text-white font-medium tracking-tight">
                                PhinGift
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6 text-white/60">
                            Phin cà phê khắc logo cao cấp – kết hợp giữa nghệ thuật thủ công Việt Nam và công nghệ khắc laser hiện đại.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[var(--color-gold)] transition-colors" aria-label="Facebook">
                                <Facebook size={18} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[var(--color-gold)] transition-colors" aria-label="Instagram">
                                <Instagram size={18} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[var(--color-gold)] transition-colors" aria-label="Youtube">
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-serif text-white text-base mb-5 font-semibold">Sản Phẩm</h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                { label: 'Phin Cà Phê Inox', href: '/products/phin-ca-phe-inox' },
                                { label: 'Phin Cà Phê Nhôm', href: '/products/phin-ca-phe-nhom' },
                                { label: 'Phin Khắc Logo', href: '/products/phin-ca-phe-khac-logo' },
                                { label: 'Tất Cả Sản Phẩm', href: '/products' },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="hover:text-[var(--color-gold)] transition-colors duration-200">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-serif text-white text-base mb-5 font-semibold">Thông Tin</h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                { label: 'Về Chúng Tôi', href: '/about' },
                                { label: 'Blog Cà Phê', href: '/blog' },
                                { label: 'Liên Hệ', href: '/contact' },
                                { label: 'Giỏ Hàng', href: '/cart' },
                                { label: 'Chính Sách Đổi Trả', href: '/about#policy' },
                                { label: 'Chính Sách Shipping', href: '/about#shipping' },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="hover:text-[var(--color-gold)] transition-colors duration-200">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-serif text-white text-base mb-5 font-semibold">Liên Hệ</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <Phone size={15} className="text-[var(--color-gold)] mt-0.5 shrink-0" />
                                <a href="tel:+84359331365" className="hover:text-[var(--color-gold)] transition-colors">
                                    (+84) 359331365
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail size={15} className="text-[var(--color-gold)] mt-0.5 shrink-0" />
                                <a href="mailto:phingift@gmail.com" className="hover:text-[var(--color-gold)] transition-colors break-all">
                                    phingift@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={15} className="text-[var(--color-gold)] mt-0.5 shrink-0" />
                                <span>TP. Hồ Chí Minh, Việt Nam</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
                    <p>© {new Date().getFullYear()} PhinGift. Tự hào Made in Vietnam 🇻🇳</p>
                    <p>Thiết kế bởi PhinGift Team</p>
                </div>
            </div>
        </footer>
    );
}
