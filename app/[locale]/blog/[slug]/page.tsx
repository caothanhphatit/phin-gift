import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import AnimateSection from '@/components/AnimateSection';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

interface Props {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
    await dbConnect();
    const post = await BlogPost.findOne({ slug, status: 'Published' }).lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
}

export async function generateStaticParams() {
    try {
        await dbConnect();
        const posts = await BlogPost.find({ status: 'Published' }, 'slug').lean();
        return posts.map((p: any) => ({ slug: p.slug }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return {};
    
    return {
        title: post.title?.vi || post.title?.en,
        description: post.excerpt?.vi || post.excerpt?.en,
        openGraph: {
            title: post.title?.vi || post.title?.en,
            description: post.excerpt?.vi || post.excerpt?.en,
            images: [{ url: post.featuredImageUrl, alt: post.title?.vi }],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) notFound();

    return (
        <article>
            {/* Header */}
            <div className="relative h-[60vh] min-h-[400px]">
                <Image
                    src={post.featuredImageUrl || '/images/hero/phin-coffee-pour.jpg'}
                    alt={post.title?.vi || 'Blog Image'}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container-custom text-center text-white px-4">
                        <AnimateSection>
                            <span className="inline-block px-3 py-1 bg-[var(--color-gold)] text-xs font-bold tracking-widest uppercase mb-4">
                                Kinh nghiệm
                            </span>
                            <h1 className="heading-display mb-6 max-w-4xl mx-auto leading-tight">
                                {post.title?.vi || post.title?.en}
                            </h1>
                            <div className="flex items-center justify-center gap-6 text-sm text-white/80">
                                <span className="flex items-center gap-2">
                                    <Clock size={16} />
                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                                <span>•</span>
                                <span>5 min read</span>
                            </div>
                        </AnimateSection>
                    </div>
                </div>
            </div>

            {/* Content */}
            <section className="section-padding bg-white">
                <div className="container-custom max-w-3xl">
                    <AnimateSection delay={0.2}>
                        <div 
                            className="prose prose-lg prose-stone max-w-none prose-headings:font-display prose-headings:text-[var(--color-brown-dark)] prose-a:text-[var(--color-gold)] prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: post.content?.vi || post.content?.en || '' }}
                        />
                    </AnimateSection>

                    {/* Navigation */}
                    <div className="mt-12 pt-8 border-t border-stone-200">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--color-brown)] hover:text-[var(--color-gold)] transition-colors font-medium">
                            <ArrowLeft size={20} />
                            Back to Blog
                        </Link>
                    </div>
                </div>
            </section>
        </article>
    );
}

