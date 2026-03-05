import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';
import { blogPosts } from '@/lib/blog';

// Simple function to convert array content to HTML string
function contentToHtml(content: any[]) {
    return content.map(section => {
        switch (section.type) {
            case 'paragraph':
                return `<p>${section.content}</p>`;
            case 'heading':
                return `<h2>${section.content}</h2>`;
            case 'list':
                return `<ul>${section.items.map((item: string) => `<li>${item}</li>`).join('')}</ul>`;
            case 'cta':
                return `<a href="${section.href}" class="cta-button">${section.content}</a>`;
            default:
                return '';
        }
    }).join('\n');
}

export async function GET() {
    try {
        await dbConnect();
        
        const postsToInsert = blogPosts.map(post => ({
            title: {
                vi: post.title,
                en: post.title // Placeholder, in real world we'd translate
            },
            slug: post.slug,
            excerpt: {
                vi: post.excerpt,
                en: post.excerpt // Placeholder
            },
            content: {
                vi: contentToHtml(post.content),
                en: contentToHtml(post.content) // Placeholder
            },
            featuredImageUrl: post.image,
            status: 'Published',
            createdAt: new Date(post.publishedAt),
            views: 0
        }));

        for (const post of postsToInsert) {
            await BlogPost.findOneAndUpdate(
                { slug: post.slug },
                post,
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({ success: true, message: 'Blog posts seeded successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
