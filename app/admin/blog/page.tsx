import Link from 'next/link';
import { Plus, Edit2, Trash2 } from 'lucide-react';

async function getBlogPosts() {
    try {
        const res = await fetch('/api/admin/blog', { cache: 'no-store' });
        const json = await res.json();
        return json.data || [];
    } catch {
        return [];
    }
}

const statusStyles: Record<string, string> = {
    Published: 'bg-green-500/10 text-green-400 border border-green-500/20',
    Draft: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
};

export default async function BlogPage() {
    const posts = await getBlogPosts();
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Blog</h1>
                    <p className="text-gray-400 text-sm mt-1">{posts.length} posts</p>
                </div>
                <Link href="/admin/blog/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A84C] hover:bg-[#b8973b] text-black rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} />
                    New Post
                </Link>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                {posts.length === 0 ? (
                    <div className="px-6 py-16 text-center text-gray-500 text-sm">No blog posts yet.</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {['Title', 'Status', 'Views', 'Date', 'Actions'].map((h) => (
                                    <th key={h} className="text-left text-xs text-gray-500 font-medium px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((p: any) => (
                                <tr key={p._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-white font-medium">{p.title?.vi}</p>
                                        <p className="text-xs text-gray-500">{p.title?.en}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[p.status]}`}>{p.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{(p.views || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"><Edit2 size={14} /></button>
                                            <button className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/[0.06] rounded-md transition-colors"><Trash2 size={14} /></button>
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
