'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, ListTree, MoreVertical, Pencil, Trash2, Search, Loader2 } from 'lucide-react';

interface Classification {
    _id: string;
    name: { en: string; vi: string };
    attributes: any[];
    isActive: boolean;
    createdAt: string;
}

export default function ClassificationsPage() {
    const [classifications, setClassifications] = useState<Classification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClassifications();
    }, []);

    const fetchClassifications = async () => {
        try {
            const res = await fetch('/api/admin/classifications');
            const json = await res.json();
            if (json.success) setClassifications(json.data);
        } catch (error) {
            console.error('Failed to fetch classifications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete the classification "${name}"?`)) return;

        try {
            const res = await fetch(`/api/admin/classifications/${id}`, { method: 'DELETE' });
            if (res.ok) fetchClassifications();
        } catch (error) {
            alert('Delete failed');
        }
    };

    const filtered = classifications.filter(c =>
        c.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.vi.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-[#C9A84C]" size={32} /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ListTree className="text-[#C9A84C]" /> Classifications
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Manage dynamic product technical attributes and variants.</p>
                </div>
                <Link href="/admin/classifications/new" className="btn-primary flex items-center gap-2 text-sm px-4 py-2 bg-[#C9A84C] hover:bg-[#b8973b] text-black font-semibold rounded-lg transition-colors">
                    <Plus size={16} /> Add Classification
                </Link>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search classifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/[0.02] border-b border-white/[0.05]">
                        <tr className="text-gray-400 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-medium">Name (EN / VI)</th>
                            <th className="px-6 py-4 font-medium">Attributes Total</th>
                            <th className="px-6 py-4 font-medium">Variant Defining</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                        {filtered.length > 0 ? filtered.map((c) => {
                            const variantAttributes = c.attributes.filter(a => a.isVariantDefining).length;
                            return (
                                <tr key={c._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium">{c.name.en}</p>
                                        <p className="text-gray-500 text-xs">{c.name.vi}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        {c.attributes.length} attrs
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        <span className={variantAttributes > 0 ? "text-[#C9A84C] font-medium" : "text-gray-500"}>
                                            {variantAttributes} fields
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${c.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                                            {c.isActive ? 'Active' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/classifications/${c._id}`} className="p-2 text-gray-400 hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-lg transition-colors">
                                                <Pencil size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(c._id, c.name.en)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No classifications found. Check back later or create a new one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
