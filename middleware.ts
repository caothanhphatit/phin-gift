import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Admin Authentication Check
    if (pathname.startsWith('/admin')) {
        const adminToken = request.cookies.get('admin_token')?.value;
        const isLoginPage = pathname === '/admin/login';

        // Protected admin routes
        if (!isLoginPage && adminToken !== 'authenticated') {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        // If already authenticated and trying to access login, redirect to admin dashboard
        if (isLoginPage && adminToken === 'authenticated') {
            const dashboardUrl = new URL('/admin/dashboard', request.url);
            return NextResponse.redirect(dashboardUrl);
        }

        return NextResponse.next();
    }

    // 2. Next-Intl (Internationalization) for all non-admin routes
    const isApiRoute = pathname.startsWith('/api');
    const isPublicStatic = pathname.includes('.') || pathname.startsWith('/_next');

    if (!isApiRoute && !isPublicStatic) {
        return intlMiddleware(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
