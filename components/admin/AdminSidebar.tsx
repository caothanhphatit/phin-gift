'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Tag,
    ShoppingBag,
    Users,
    FileText,
    Briefcase,
    Image as ImageIcon,
    Settings,
    ChevronRight,
    Coffee,
    LogOut,
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Tag },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Blog', href: '/admin/blog', icon: FileText },
    { label: 'B2B Orders', href: '/admin/b2b-orders', icon: Briefcase },
    { label: 'Media', href: '/admin/media', icon: ImageIcon },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 bg-[#0A0C12] border-r border-white/[0.06] flex flex-col z-50">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-white/[0.06]">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center shadow-lg shadow-amber-900/30">
                        <Coffee size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-white text-sm tracking-wide">PhinGift</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Backoffice</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
                {navItems.map(({ label, href, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${isActive(href)
                                ? 'bg-[#C9A84C]/10 text-[#C9A84C] font-medium'
                                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                            }`}
                    >
                        <Icon size={16} className={`flex-shrink-0 ${isActive(href) ? 'text-[#C9A84C]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                        <span className="flex-1">{label}</span>
                        {isActive(href) && <ChevronRight size={14} className="text-[#C9A84C]/60" />}
                    </Link>
                ))}
            </nav>

            {/* Footer / User */}
            <div className="px-3 py-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C]/40 to-[#8B6914]/40 flex items-center justify-center text-xs text-[#C9A84C] font-semibold">
                        A
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">Admin</p>
                        <p className="text-xs text-gray-500 truncate">Super Admin</p>
                    </div>
                    <button className="text-gray-500 hover:text-white transition-colors">
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
