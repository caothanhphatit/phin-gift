import { headers } from 'next/headers';

export async function getBaseUrl() {
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    if (process.env.URL) return process.env.URL;
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

    try {
        const headersList = await headers();
        const host = headersList.get('host');
        const protocol = headersList.get('x-forwarded-proto') || 'http';
        if (host) return `${protocol}://${host}`;
    } catch (e) {
        // Ignore error
    }

    return 'http://localhost:3000';
}
