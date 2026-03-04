import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import AnimateSection from '@/components/AnimateSection';
import { getBlogPostBySlug, blogPosts, BlogSection } from '@/lib/blog';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    if (!post) return {};
    return {
        title: post.metaTitle,
        description: post.metaDescription,
        openGraph: {
            title: post.metaTitle,
            description: post.metaDescription,
            images: [{ url: post.image, alt: post.imageAlt }],
        },
    };
}

function renderSection(section: BlogSection, i: number) {
    switch (section.type) {
        case 'heading':
            return (
                <h2 key={i} className="font-serif text-2xl text-[var(--color-brown)] mt-10 mb-4">
                    {section.content}
                </h2>
            );
        case 'paragraph':
            return (
                <p key={i} className="text-[var(--color-text-muted)] leading-relaxed mb-4">
                    {section.content}
                </p>
            );
        case 'list':
            return (
                <ul key={i} className="space-y-2 mb-6 ml-4">
                    {section.items?.map((item, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-[var(--color-text-muted)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shrink-0 mt-2" />
                            {item}
                        </li>
                    ))}
                </ul>
            );
        case 'image':
            return section.src ? (
                <div key={i} className="relative aspect-[16/9] overflow-hidden my-8">
                    <Image src={section.src} alt={section.alt ?? ''} fill className="object-cover" sizes="100vw" />
                </div>
            ) : null;
        case 'cta':
            return (
                <div key={i} className="bg-[var(--color-cream)] border border-[var(--color-gold)]/30 p-6 my-8 text-center">
                    <p className="text-[var(--color-brown)] mb-4">{section.content}</p>
                    {section.href && (
                        <Link href={section.href} className="btn-primary inline-flex">
                            {section.label} <ArrowRight size={14} />
                        </Link>
                    )}
                </div>
            );
        default:
            return null;
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);
    if (!post) notFound();

    const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        image: [post.image],
        datePublished: post.publishedAt,
        author: {
            '@type': 'Organization',
            name: 'PhinGift',
            url: 'https://phingift.vn',
        },
        publisher: {
            '@type': 'Organization',
            name: 'PhinGift',
            logo: {
                '@type': 'ImageObject',
                url: 'https://phingift.vn/images/logo.png',
            },
        },
        description: post.metaDescription,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Hero */}
            <section className="relative pt-32 pb-0 bg-[var(--color-brown-dark)]">
                <div className="relative h-[50vh] overflow-hidden">
                    <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        className="object-cover opacity-60"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brown-dark)] via-transparent to-transparent" />
                    <div className="absolute bottom-10 left-0 right-0 container-custom px-4 md:px-8 lg:px-16">
                        <AnimateSection>
                            <span className="label-small text-[var(--color-gold)] block mb-3">{post.category}</span>
                            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white max-w-3xl leading-tight">
                                {post.title}
                            </h1>
                            <div className="flex items-center gap-4 mt-4 text-white/60 text-sm">
                                <time dateTime={post.publishedAt}>
                                    {new Date(post.publishedAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </time>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} /> {post.readingTime} phút đọc
                                </span>
                            </div>
                        </AnimateSection>
                    </div>
                </div>
            </section>

            {/* Content */}
            <article className="section-padding bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <Link href="/blog" className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors mb-10">
                        <ArrowLeft size={14} /> Quay lại Blog
                    </Link>

                    <div className="prose-custom">
                        {post.content.map((section, i) => renderSection(section, i))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-[var(--color-cream-dark)]">
                        {post.tags.map((tag) => (
                            <span key={tag} className="text-xs tracking-wide bg-[var(--color-cream)] text-[var(--color-text-muted)] px-3 py-1.5">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Related Products */}
                    <div className="mt-10 pt-8 border-t border-[var(--color-cream-dark)]">
                        <h3 className="font-serif text-xl text-[var(--color-brown)] mb-4">Sản Phẩm Liên Quan</h3>
                        <div className="flex flex-wrap gap-3">
                            {post.relatedProducts.map((slug) => (
                                <Link
                                    key={slug}
                                    href={`/products/${slug}`}
                                    className="btn-outline text-sm"
                                >
                                    Xem: {slug.replace('phin-ca-phe-', '').replace(/-/g, ' ').toUpperCase()}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </article>

            {/* More Articles */}
            <section className="section-padding bg-[var(--color-cream)]">
                <div className="container-custom">
                    <h2 className="font-serif text-2xl text-[var(--color-brown)] mb-8">Bài Viết Khác</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {otherPosts.map((p) => (
                            <AnimateSection key={p.id}>
                                <Link href={`/blog/${p.slug}`} className="block group">
                                    <div className="relative aspect-[16/9] overflow-hidden mb-4">
                                        <Image src={p.image} alt={p.imageAlt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                                    </div>
                                    <span className="label-small block mb-2">{p.category}</span>
                                    <h3 className="font-serif text-base text-[var(--color-brown)] group-hover:text-[var(--color-gold)] transition-colors leading-snug">
                                        {p.title}
                                    </h3>
                                </Link>
                            </AnimateSection>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
