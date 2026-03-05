'use client';

import { ArrowLeft, Bold, Italic, List, Image, Link2, Type } from 'lucide-react';
import Link from 'next/link';

export default function NewBlogPostPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/blog" className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-white">New Blog Post</h1>
                    <p className="text-gray-400 text-sm mt-1">Create a bilingual blog post</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-4">
                    {/* Vietnamese */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-medium">VI</span>
                            <h2 className="text-sm font-semibold text-white">Vietnamese Content</h2>
                        </div>
                        <input type="text" placeholder="Tiêu đề bài viết..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors text-base font-medium" />

                        {/* Editor toolbar */}
                        <div className="flex items-center gap-1 p-2 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                            {[Bold, Italic, List, Type, Link2, Image].map((Icon, i) => (
                                <button key={i} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded transition-colors">
                                    <Icon size={14} />
                                </button>
                            ))}
                        </div>
                        <textarea rows={10} placeholder="Nội dung bài viết bằng tiếng Việt..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors resize-none" />
                    </div>

                    {/* English */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-medium">EN</span>
                            <h2 className="text-sm font-semibold text-white">English Content</h2>
                        </div>
                        <input type="text" placeholder="Blog post title..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors text-base font-medium" />
                        <div className="flex items-center gap-1 p-2 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                            {[Bold, Italic, List, Type, Link2, Image].map((Icon, i) => (
                                <button key={i} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded transition-colors">
                                    <Icon size={14} />
                                </button>
                            ))}
                        </div>
                        <textarea rows={10} placeholder="Blog content in English..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors resize-none" />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-3">
                        <h2 className="text-sm font-semibold text-white">Publish</h2>
                        <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none">
                            <option>Draft</option>
                            <option>Published</option>
                        </select>
                        <input type="text" placeholder="Post slug..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors font-mono" />
                    </div>

                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-3">
                        <h2 className="text-sm font-semibold text-white">Featured Image</h2>
                        <div className="border-2 border-dashed border-white/[0.10] rounded-lg p-6 text-center hover:border-[#C9A84C]/40 transition-colors cursor-pointer">
                            <Image size={20} className="mx-auto text-gray-500 mb-2" />
                            <p className="text-xs text-gray-500">Click to upload image</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <button className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#b8973b] text-black rounded-lg text-sm font-semibold transition-colors">
                            Publish Post
                        </button>
                        <button className="w-full py-2.5 bg-white/[0.04] border border-white/[0.08] text-gray-300 rounded-lg text-sm font-medium hover:text-white transition-colors">
                            Save as Draft
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
