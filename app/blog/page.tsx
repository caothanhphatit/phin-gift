import type { Metadata } from 'next';
import AnimateSection from '@/components/AnimateSection';
import BlogCard from '@/components/BlogCard';
import { blogPosts } from '@/lib/blog';

export const metadata: Metadata = {
    title: 'Blog Cà Phê Phin | Hướng Dẫn & Kiến Thức | PhinGift',
    description: 'Khám phá bí quyết pha cà phê phin, so sánh phin inox và nhôm, và nhiều kiến thức thú vị về cà phê Việt Nam từ PhinGift.',
    openGraph: {
        title: 'Blog Cà Phê Phin | PhinGift',
        description: 'Bí quyết pha cà phê phin, so sánh chất liệu và hướng dẫn mua phin chất lượng.',
    },
};

export default function BlogPage() {
    return (
        <>
            {/* Header */}
            <section className="pt-32 pb-16 bg-[var(--color-brown-dark)] text-white">
                <div className="container-custom px-4 md:px-8 lg:px-16 text-center">
                    <AnimateSection>
                        <span className="label-small text-[var(--color-gold)] block mb-4">Nhật Ký Cà Phê</span>
                        <h1 className="heading-display text-white mb-4">Blog PhinGift</h1>
                        <p className="text-white/60 max-w-xl mx-auto">
                            Bí quyết pha cà phê, kiến thức về phin, và câu chuyện từ những người yêu cà phê Việt Nam.
                        </p>
                    </AnimateSection>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="section-padding bg-[var(--color-cream)]">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post, i) => (
                            <AnimateSection key={post.id} delay={i * 0.1}>
                                <BlogCard post={post} />
                            </AnimateSection>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
