import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = (await requestLocale) || routing.defaultLocale;

    // Ensure that a valid locale is used
    if (!routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: {
            nav: (await import(`../locales/${locale}/nav.json`)).default,
            home: (await import(`../locales/${locale}/home.json`)).default,
            product: (await import(`../locales/${locale}/product.json`)).default,
        }
    };
});
