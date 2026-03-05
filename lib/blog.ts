
export const blogPosts: any[] = [];

export function getLatestBlogPosts(limit: number) {
    return blogPosts.slice(0, limit);
}

export function getBlogPostBySlug(slug: string) {
    return blogPosts.find((post) => post.slug === slug);
}
