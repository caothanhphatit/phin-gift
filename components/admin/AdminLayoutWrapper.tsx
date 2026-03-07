'use client';
import { usePathname } from 'next/navigation';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname === '/admin/login';

    if (isLogin) {
        return <>{children}</>;
    }

    return (
        <main className="flex-1 ml-64 min-h-screen">
            <div className="p-8">
                {children}
            </div>
        </main>
    );
}
