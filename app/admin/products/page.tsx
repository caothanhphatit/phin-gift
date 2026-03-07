'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import ProductImage from '@/components/admin/ProductImage';
import { useRouter, useSearchParams } from 'next/navigation';

interface Product {
    _id: string;
    name: { en: string; vi: string };
    slug: string;
    basePrice: number;
    salePrice?: number;
    variants: any[];
    categories: any[];
    images: any[];
    status: 'draft' | 'published';
    stock: number;
}

function ProductsList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const p = parseInt(searchParams.get('page') || '1');
        setPage(p);
        fetchProducts(p);
    }, [searchParams]);

    const fetchProducts = async (currentPage: number) => {
        setLoading(true);
        try {
            const query = new URLSearchParams(searchParams.toString());
            query.set('page', currentPage.toString());
            query.set('limit', '10');
            const res = await fetch(`/api/admin/products?${query.toString()}`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
                setTotalPages(data.totalPages);
                setTotal(data.total);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchProducts(page);
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/admin/products?search=${searchTerm}`);
    };

    const formatVND = (price: number) => `₫${price.toLocaleString('vi-VN')}`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Products</h1>
                    <p className="text-gray-400 text-sm mt-1">{total} products in catalog</p>
                </div>
                <Link href="/admin/products/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A84C] hover:bg-[#b8973b] text-black rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={16} />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50 transition-colors"
                    />
                </form>
            </div>

            {/* Table */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-[#C9A84C]" size={32} />
                    </div>
                ) : products.length === 0 ? (
                    <div className="px-6 py-16 text-center text-gray-500 text-sm">No products found. Add your first product!</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                                    <th key={h} className="text-left text-xs text-gray-500 font-medium px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => {
                                const firstVariant = p.variants?.[0];
                                const totalStock = p.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) ?? 0;
                                const catNames = p.categories?.map((c: any) => (typeof c === 'object' ? (c.name?.vi || c.name?.en) : c)).filter(Boolean).join(', ') || '-';
                                return (
                                    <tr key={p._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/[0.06] border border-white/[0.08] overflow-hidden flex-shrink-0">
                                                    <ProductImage src={p.images?.[0]?.url} alt={p.name?.vi} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white font-medium">{p.name?.vi}</p>
                                                    <p className="text-xs text-gray-500">{p.name?.en}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{firstVariant?.sku || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{catNames}</td>
                                        <td className="px-6 py-4 text-sm text-white font-medium">{formatVND(p.salePrice || p.basePrice)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={totalStock === 0 ? 'text-red-400' : 'text-gray-300'}>{totalStock}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium uppercase tracking-wider ${p.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/products/${p._id}`} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors">
                                                    <Edit2 size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(p._id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/[0.06] rounded-md transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => router.push(`/admin/products?page=${Math.max(1, page - 1)}`)}
                        disabled={page === 1}
                        className="px-3 py-1 bg-white/[0.03] text-sm text-gray-400 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-white">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => router.push(`/admin/products?page=${Math.min(totalPages, page + 1)}`)}
                        disabled={page === totalPages}
                        className="px-3 py-1 bg-white/[0.03] text-sm text-gray-400 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <ProductsList />
        </Suspense>
    );
}
