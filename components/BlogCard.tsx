import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/blog';

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <article className="group bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <Link href={`/blog/${post.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-[#F5F0E8]">
                    <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4 bg-[var(--color-gold)] text-white text-xs font-medium tracking-widest uppercase px-3 py-1">
                        {post.category}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] mb-3">
                        <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </time>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {post.readingTime} phút đọc
                        </span>
                    </div>

                    <h3 className="font-serif text-xl text-[var(--color-brown)] mb-3 leading-snug line-clamp-2 group-hover:text-[var(--color-gold)] transition-colors duration-200">
                        {post.title}
                    </h3>

                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-3 mb-4 leading-relaxed">
                        {post.excerpt}
                    </p>

                    <span className="flex items-center gap-1 text-xs text-[var(--color-gold)] font-medium tracking-wider uppercase group-hover:gap-2 transition-all duration-200">
                        Đọc tiếp <ArrowRight size={12} />
                    </span>
                </div>
            </Link>
        </article>
    );
}
