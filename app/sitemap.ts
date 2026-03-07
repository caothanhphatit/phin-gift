import { MetadataRoute } from 'next';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import BlogPost from '@/models/BlogPost';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://phingift.vn';
    const locales = ['vi', 'en'];

    await dbConnect();

    // 1. Fetch data from DB
    const [products, posts] = await Promise.all([
        Product.find({ status: 'published' }, 'slug updatedAt').lean(),
        BlogPost.find({ status: 'Published' }, 'slug updatedAt').lean(),
    ]);

    // 2. Define static routes
    const staticRoutes = [
        '',
        '/products',
        '/blog',
        '/about',
        '/products/phin-ca-phe-khac-logo',
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // 3. Generate entries for static routes in all locales
    staticRoutes.forEach((route) => {
        locales.forEach((locale) => {
            const prefix = locale === 'vi' ? '' : `/${locale}`;
            sitemapEntries.push({
                url: `${baseUrl}${prefix}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : 0.8,
            });
        });
    });

    // 4. Generate entries for products
    products.forEach((product: any) => {
        locales.forEach((locale) => {
            const prefix = locale === 'vi' ? '' : `/${locale}`;
            sitemapEntries.push({
                url: `${baseUrl}${prefix}/products/${product.slug}`,
                lastModified: product.updatedAt || new Date(),
                changeFrequency: 'daily',
                priority: 0.7,
            });
        });
    });

    // 5. Generate entries for blog posts
    posts.forEach((post: any) => {
        locales.forEach((locale) => {
            const prefix = locale === 'vi' ? '' : `/${locale}`;
            sitemapEntries.push({
                url: `${baseUrl}${prefix}/blog/${post.slug}`,
                lastModified: post.updatedAt || new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
            });
        });
    });

    return sitemapEntries;
}
