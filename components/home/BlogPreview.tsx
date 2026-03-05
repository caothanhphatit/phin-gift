import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import AnimateSection from '@/components/AnimateSection';
import BlogCard from '@/components/BlogCard';
import { getLatestBlogPosts } from '@/lib/blog';

export default function BlogPreview() {
    const posts = getLatestBlogPosts(3);

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
                    {posts.map((post, i) => (
                        <AnimateSection key={post.id} delay={i * 0.1}>
                            <BlogCard post={post} />
                        </AnimateSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
