'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollToTop() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Force scroll to top on every route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' as ScrollBehavior // Use instant to bypass smooth scroll lag during navigation
        });
    }, [pathname, searchParams]);

    return null;
}
