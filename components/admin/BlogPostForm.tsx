'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Upload, Loader2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BlogPostFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function BlogPostForm({ initialData, isEdit = false }: BlogPostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: { en: '', vi: '' },
        slug: '',
        content: { en: '', vi: '' },
        excerpt: { en: '', vi: '' },
        featuredImageUrl: '',
        status: 'Draft',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
            });
        }
    }, [initialData]);

    const handleChange = (field: string, value: any, subField?: string) => {
        if (subField) {
            setFormData(prev => ({ ...prev, [field]: { ...prev[field as keyof typeof prev] as any, [subField]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = isEdit ? `/api/admin/blog/${initialData._id}` : '/api/admin/blog';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                router.push('/admin/blog');
                router.refresh();
            } else {
                alert(data.error || 'Operation failed');
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-white">{isEdit ? 'Edit Post' : 'New Blog Post'}</h1>
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#C9A84C] hover:bg-[#b8973b] text-black rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isEdit ? 'Update Post' : 'Save Post'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-medium text-white mb-4">Content</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Title (En)</label>
                                <input
                                    type="text"
                                    value={formData.title.en}
                                    onChange={(e) => handleChange('title', e.target.value, 'en')}
                                    required
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Title (Vi)</label>
                                <input
                                    type="text"
                                    value={formData.title.vi}
                                    onChange={(e) => handleChange('title', e.target.value, 'vi')}
                                    required
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5">Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => handleChange('slug', e.target.value)}
                                required
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:border-[#C9A84C]/50 outline-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Excerpt (En)</label>
                                <textarea
                                    value={formData.excerpt.en}
                                    onChange={(e) => handleChange('excerpt', e.target.value, 'en')}
                                    rows={3}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                />
                            </div>
                             <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Excerpt (Vi)</label>
                                <textarea
                                    value={formData.excerpt.vi}
                                    onChange={(e) => handleChange('excerpt', e.target.value, 'vi')}
                                    rows={3}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                />
                            </div>
                        </div>

                         <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Content (En)</label>
                                <textarea
                                    value={formData.content.en}
                                    onChange={(e) => handleChange('content', e.target.value, 'en')}
                                    rows={10}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none font-mono"
                                />
                            </div>
                             <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Content (Vi)</label>
                                <textarea
                                    value={formData.content.vi}
                                    onChange={(e) => handleChange('content', e.target.value, 'vi')}
                                    rows={10}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none font-mono"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-medium text-white mb-4">Settings</h2>
                        
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                            >
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5">Featured Image URL</label>
                            <input
                                type="text"
                                value={formData.featuredImageUrl}
                                onChange={(e) => handleChange('featuredImageUrl', e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                            />
                            {formData.featuredImageUrl && (
                                <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-white/[0.06]">
                                    <img src={formData.featuredImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
