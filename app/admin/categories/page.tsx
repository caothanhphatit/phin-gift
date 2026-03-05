import Link from 'next/link';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const categories = [
    { id: 1, name_vi: 'Phin Inox', name_en: 'Stainless Steel', slug: 'phin-inox', products: 14, status: 'Active' },
    { id: 2, name_vi: 'Phin Nhôm', name_en: 'Aluminum', slug: 'phin-nhom', products: 9, status: 'Active' },
    { id: 3, name_vi: 'Bộ Quà Tặng', name_en: 'Gift Sets', slug: 'bo-qua-tang', products: 5, status: 'Active' },
    { id: 4, name_vi: 'Phụ Kiện', name_en: 'Accessories', slug: 'phu-kien', products: 8, status: 'Active' },
];

export default function CategoriesPage() {
    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Categories</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage product categories</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A84C] hover:bg-[#b8973b] text-black rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} />
                    Add Category
                </button>
            </div>

            {/* Add Form */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
                <h2 className="text-sm font-semibold text-white mb-4">New Category</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Name (Vietnamese)</label>
                        <input type="text" placeholder="Tên danh mục..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Name (English)</label>
                        <input type="text" placeholder="Category name..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Slug</label>
                        <input type="text" placeholder="category-slug" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors font-mono" />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="px-4 py-2 bg-[#C9A84C] hover:bg-[#b8973b] text-black rounded-lg text-sm font-semibold transition-colors">
                        Save Category
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            {['Category', 'Slug', 'Products', 'Status', 'Actions'].map((h) => (
                                <th key={h} className="text-left text-xs text-gray-500 font-medium px-6 py-3">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-sm text-white font-medium">{cat.name_vi}</p>
                                    <p className="text-xs text-gray-500">{cat.name_en}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400 font-mono">{cat.slug}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{cat.products} products</td>
                                <td className="px-6 py-4">
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{cat.status}</span>
                                </td>
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
            </div>
        </div>
    );
}
