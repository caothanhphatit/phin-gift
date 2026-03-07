'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
// import { useLocale } from 'next-intl'; // Removed

interface Category {
    _id: string;
    name: { en: string; vi: string };
    slug: string;
    description: { en: string; vi: string };
    classificationIds: string[];
    isActive: boolean;
}

interface Classification {
    _id: string;
    name: { en: string; vi: string };
}

export default function CategoriesPage() {
    // const locale = useLocale(); // Removed
    const [categories, setCategories] = useState<Category[]>([]);
    const [classifications, setClassifications] = useState<Classification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: { en: '', vi: '' },
        slug: '',
        description: { en: '', vi: '' },
        classificationIds: [] as string[],
        isActive: true,
    });

    useEffect(() => {
        fetchCategories();
        fetchClassifications();
    }, []);

    const fetchClassifications = async () => {
        try {
            const res = await fetch('/api/admin/classifications?activeOnly=true');
            const data = await res.json();
            if (data.success) setClassifications(data.data);
        } catch (error) {
            console.error('Failed to fetch classifications', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                fetchCategories();
                resetForm();
            } else {
                alert(data.error || 'Operation failed');
            }
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category._id);
        setFormData({
            name: { ...category.name },
            slug: category.slug,
            description: { ...category.description },
            classificationIds: category.classificationIds || [],
            isActive: category.isActive,
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCategories();
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({
            name: { en: '', vi: '' },
            slug: '',
            description: { en: '', vi: '' },
            classificationIds: [],
            isActive: true,
        });
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Categories</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage product categories</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-white">{isEditing ? 'Edit Category' : 'New Category'}</h2>
                    {isEditing && (
                        <button type="button" onClick={resetForm} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                            <X size={14} /> Cancel
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Name (English)</label>
                        <input
                            type="text"
                            value={formData.name.en}
                            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                            required
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Name (Vietnamese)</label>
                        <input
                            type="text"
                            value={formData.name.vi}
                            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, vi: e.target.value } })}
                            required
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs text-gray-400 mb-1.5">Slug</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors font-mono"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs text-gray-400 mb-1.5">Description (Optional)</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="English"
                                value={formData.description.en}
                                onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors"
                            />
                            <input
                                type="text"
                                placeholder="Vietnamese"
                                value={formData.description.vi}
                                onChange={(e) => setFormData({ ...formData, description: { ...formData.description, vi: e.target.value } })}
                                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs text-gray-400 mb-1.5">Linked Classifications (Optional)</label>
                        <p className="text-[10px] text-gray-500 mb-2">Select the technical specifications schemas that apply to this category.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-white/[0.02] p-4 rounded-lg border border-white/[0.05]">
                            {classifications.map(cls => (
                                <label key={cls._id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-600 bg-gray-700 text-[#C9A84C] focus:ring-[#C9A84C]"
                                        checked={formData.classificationIds.includes(cls._id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFormData({ ...formData, classificationIds: [...formData.classificationIds, cls._id] });
                                            } else {
                                                setFormData({ ...formData, classificationIds: formData.classificationIds.filter(id => id !== cls._id) });
                                            }
                                        }}
                                    />
                                    <span className="text-sm text-gray-300">{cls.name.en}</span>
                                </label>
                            ))}
                            {classifications.length === 0 && (
                                <span className="text-xs text-gray-500 italic">No active classifications found. Create them first.</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-[#C9A84C] hover:bg-[#b8973b] text-black rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                        {isEditing ? <Edit2 size={16} /> : <Plus size={16} />}
                        {isEditing ? 'Update Category' : 'Create Category'}
                    </button>
                </div>
            </form>

            {/* List */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Name</th>
                            <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Slug</th>
                            <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Description</th>
                            <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Status</th>
                            <th className="text-left text-xs text-gray-500 font-medium px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-sm text-white font-medium">{category.name.vi}</p>
                                    <p className="text-xs text-gray-500">{category.name.en}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400 font-mono">{category.slug}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    <p>{category.description?.vi}</p>
                                    <p className="text-xs">{category.description?.en}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${category.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-1.5 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
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
            </div>
        </div>
    );
}
