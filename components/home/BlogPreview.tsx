import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import AnimateSection from '@/components/AnimateSection';
import BlogCard from '@/components/BlogCard';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

async function getLatestPosts() {
    try {
        await dbConnect();
        const posts = await BlogPost.find({ status: 'Published' })
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();
        return JSON.parse(JSON.stringify(posts));
    } catch (error) {
        console.error('BlogPreview: Failed to fetch posts', error);
        return [];
    }
}

export default async function BlogPreview() {
    const posts = await getLatestPosts();

    if (posts.length === 0) return null;

    return (
        <section className="section-padding bg-white">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <AnimateSection>
                        <span className="label-small block mb-3">Nhật Ký Cà Phê</span>
                        <h2 className="heading-section text-[var(--color-brown)]">
                            Từ Blog PhinGift
                        </h2>
                    </AnimateSection>
                    <AnimateSection direction="left">
                        <Link href="/blog" className="flex items-center gap-2 text-sm text-[var(--color-gold)] font-medium tracking-wider uppercase hover:gap-3 transition-all">
                            Xem tất cả bài viết <ArrowRight size={14} />
                        </Link>
                    </AnimateSection>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post: any, i: number) => (
                        <AnimateSection key={post._id} delay={i * 0.1}>
                            <BlogCard post={{
                                id: post._id,
                                slug: post.slug,
                                title: post.title?.vi || post.title?.en || '',
                                excerpt: post.excerpt?.vi || post.excerpt?.en || '',
                                image: post.featuredImageUrl || '/images/hero/phin-coffee-pour.jpg',
                                imageAlt: post.title?.vi || 'Blog Image',
                                category: 'Kinh nghiệm',
                                readingTime: 5,
                                publishedAt: new Date(post.createdAt).toISOString(),
                            }} />
                        </AnimateSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
