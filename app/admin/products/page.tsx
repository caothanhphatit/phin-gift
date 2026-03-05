import Link from 'next/link';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import ProductImage from '@/components/admin/ProductImage';

async function getProducts(page = 1, search = '') {
    try {
        const url = `/api/admin/products?page=${page}&limit=10${search ? `&search=${search}` : ''}`;
        console.log('Fetching products from:', url);
        const res = await fetch(url, { cache: 'no-store' });
        const json = await res.json();
        console.log('Products response:', json);
        return json;
    } catch (error) {
        console.error('Products fetch error:', error);
        return { data: [], total: 0, totalPages: 1 };
    }
}

async function getCategories() {
    try {
        const res = await fetch('/api/admin/categories', { cache: 'no-store' });
        const json = await res.json();
        return json.data || [];
    } catch {
        return [];
    }
}

function formatVND(price: number) {
    return `₫${price.toLocaleString('vi-VN')}`;
}

export default async function ProductsPage() {
    const [{ data: products = [], total = 0, totalPages = 1 }, categories] = await Promise.all([
        getProducts(),
        getCategories(),
    ]);

    // Build category map
    const catMap: Record<string, string> = {};
    categories.forEach((c: any) => { catMap[c._id] = c.name?.vi || c.name?.en || '-'; });

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

            {/* Table */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                {products.length === 0 ? (
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
                            {products.map((p: any) => {
                                const firstVariant = p.variants?.[0];
                                const totalStock = p.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) ?? 0;
                                const catNames = p.categories?.map((c: any) => (typeof c === 'object' ? c.name?.vi : catMap[c])).filter(Boolean).join(', ') || '-';
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
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                {p.isActive ? 'Active' : 'Inactive'}{totalStock === 0 ? ' (Out of Stock)' : ''}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/admin/products/${p._id}`} className="p-1.5 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors">
                                                    <Edit2 size={14} />
                                                </Link>
                                                <button className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/[0.06] rounded-md transition-colors">
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

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
                    <p className="text-xs text-gray-500">Showing {products.length} of {total} products</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-xs text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-md hover:text-white transition-colors">Previous</button>
                        <button className="px-3 py-1.5 text-xs text-white bg-[#C9A84C]/20 border border-[#C9A84C]/30 rounded-md">1</button>
                        {totalPages > 1 && <button className="px-3 py-1.5 text-xs text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-md hover:text-white transition-colors">Next</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}
