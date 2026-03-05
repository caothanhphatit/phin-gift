'use client';

import { useState, useEffect } from 'react';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditPostPage() {
    const params = useParams();
    const id = params.id as string;
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchPost(id);
        }
    }, [id]);

    async function fetchPost(postId: string) {
        try {
            const res = await fetch(`/api/admin/blog/${postId}`);
            const json = await res.json();
            if (json.success) {
                setPost(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch post:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-[#C9A84C]" size={32} />
            </div>
        );
    }

    if (!post) {
        return <div className="text-white">Post not found</div>;
    }

    return (
        <div className="space-y-6">
            <BlogPostForm initialData={post} isEdit={true} />
        </div>
    );
}
