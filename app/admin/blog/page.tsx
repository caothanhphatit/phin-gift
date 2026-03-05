'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

interface BlogPost {
    _id: string;
    title: { en: string; vi: string };
    slug: string;
    status: 'Draft' | 'Published';
    createdAt: string;
    views: number;
}

const statusStyles: Record<string, string> = {
    Published: 'bg-green-500/10 text-green-400 border border-green-500/20',
    Draft: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
};

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/blog');
            const data = await res.json();
            if (data.success) {
                setPosts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchPosts();
            } else {
                alert('Failed to delete post');
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Blog Posts</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage your blog content</p>
                </div>
                <Link href="/admin/blog/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A84C] hover:bg-[#b8973b] text-black rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} />
                    New Post
                </Link>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-[#C9A84C]" size={32} />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="px-6 py-16 text-center text-gray-500 text-sm">No posts found. Create your first post!</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Title</th>
                                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Slug</th>
                                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Status</th>
                                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Views</th>
                                <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Date</th>
                                <th className="text-right text-xs text-gray-500 font-medium px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-white font-medium">{post.title?.vi}</p>
                                        <p className="text-xs text-gray-500">{post.title?.en}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">{post.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[post.status] || statusStyles.Draft}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{post.views || 0}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/blog/${post._id}`} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors">
                                                <Edit2 size={14} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(post._id)}
                                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/[0.06] rounded-md transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
