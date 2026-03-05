'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Upload, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Variant {
    _id?: string;
    sku: string;
    size: string;
    color: string;
    price: number;
    salePrice?: number;
    stock: number;
}

interface Product {
    _id: string;
    name: { en: string; vi: string };
    slug: string;
    shortDescription: { en: string; vi: string };
    description: { en: string; vi: string };
    basePrice: number;
    salePrice?: number | null;
    variants: Variant[];
    isActive: boolean;
    isFeatured: boolean;
    categories: any[];
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [productId, setProductId] = useState<string>('');

    useEffect(() => {
        params.then(({ id }) => {
            setProductId(id);
            fetchProduct(id);
        });
    }, []);

    async function fetchProduct(id: string) {
        try {
            const res = await fetch(`/api/admin/products/${id}`);
            const json = await res.json();
            if (json.success) setProduct(json.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!product) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });
            const json = await res.json();
            if (json.success) {
                router.push('/admin/products');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    }

    function updateField(path: string, value: any) {
        setProduct((prev: any) => {
            const next = { ...prev };
            const keys = path.split('.');
            let obj = next;
            for (let i = 0; i < keys.length - 1; i++) {
                obj[keys[i]] = { ...obj[keys[i]] };
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            return next;
        });
    }

    function updateVariant(idx: number, field: string, value: any) {
        setProduct((prev: any) => {
            const variants = [...(prev?.variants || [])];
            variants[idx] = { ...variants[idx], [field]: value };
            return { ...prev, variants };
        });
    }

    function addVariant() {
        setProduct((prev: any) => ({
            ...prev,
            variants: [...(prev?.variants || []), { sku: '', size: '', color: '', price: 0, stock: 0 }],
        }));
    }

    function removeVariant(idx: number) {
        setProduct((prev: any) => ({
            ...prev,
            variants: prev.variants.filter((_: any, i: number) => i !== idx),
        }));
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 size={24} className="animate-spin text-[#C9A84C]" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-400">Product not found.</p>
                <Link href="/admin/products" className="text-[#C9A84C] text-sm mt-4 inline-block hover:underline">← Back to Products</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-white">Edit Product</h1>
                    <p className="text-gray-400 text-sm mt-0.5">{product.name?.vi}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="col-span-2 space-y-4">
                    {/* Basic Info */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <h2 className="text-sm font-semibold text-white">Basic Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Name (Vietnamese) *</label>
                                <input type="text" value={product.name?.vi || ''} onChange={(e) => updateField('name.vi', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Name (English) *</label>
                                <input type="text" value={product.name?.en || ''} onChange={(e) => updateField('name.en', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5">Slug *</label>
                            <input type="text" value={product.slug || ''} onChange={(e) => updateField('slug', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors font-mono" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Short Description (VI)</label>
                                <textarea rows={3} value={product.shortDescription?.vi || ''} onChange={(e) => updateField('shortDescription.vi', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Short Description (EN)</label>
                                <textarea rows={3} value={product.shortDescription?.en || ''} onChange={(e) => updateField('shortDescription.en', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors resize-none" />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <h2 className="text-sm font-semibold text-white">Pricing</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Base Price (₫) *</label>
                                <input type="number" value={product.basePrice || ''} onChange={(e) => updateField('basePrice', Number(e.target.value))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Sale Price (₫)</label>
                                <input type="number" value={product.salePrice || ''} onChange={(e) => updateField('salePrice', e.target.value ? Number(e.target.value) : null)} placeholder="Leave blank if no sale" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-white">Variants ({product.variants?.length || 0})</h2>
                            <button onClick={addVariant} className="flex items-center gap-1.5 text-xs text-[#C9A84C] hover:underline">
                                <Plus size={13} />Add Variant
                            </button>
                        </div>

                        {product.variants?.length === 0 && (
                            <p className="text-xs text-gray-500 text-center py-4">No variants. Click "Add Variant" to add one.</p>
                        )}

                        {product.variants?.map((v: Variant, idx: number) => (
                            <div key={idx} className="grid grid-cols-5 gap-2 items-end">
                                <div className="col-span-2">
                                    <label className="block text-xs text-gray-500 mb-1">SKU</label>
                                    <input type="text" value={v.sku} onChange={(e) => updateVariant(idx, 'sku', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-[#C9A84C]/50 transition-colors font-mono" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Size</label>
                                    <input type="text" value={v.size || ''} onChange={(e) => updateVariant(idx, 'size', e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-[#C9A84C]/50 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Stock</label>
                                    <input type="number" value={v.stock} onChange={(e) => updateVariant(idx, 'stock', Number(e.target.value))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-[#C9A84C]/50 transition-colors" />
                                </div>
                                <button onClick={() => removeVariant(idx)} className="p-2 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mb-0.5">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Status */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-3">
                        <h2 className="text-sm font-semibold text-white">Status</h2>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                onClick={() => updateField('isActive', !product.isActive)}
                                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${product.isActive ? 'bg-green-500' : 'bg-gray-600'}`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${product.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </div>
                            <span className="text-sm text-gray-300">{product.isActive ? 'Active' : 'Inactive'}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={product.isFeatured}
                                onChange={(e) => updateField('isFeatured', e.target.checked)}
                                className="accent-[#C9A84C] w-4 h-4"
                            />
                            <span className="text-sm text-gray-300">Featured product</span>
                        </label>
                    </div>

                    {/* Images */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-3">
                        <h2 className="text-sm font-semibold text-white">Product Images</h2>
                        <div className="border-2 border-dashed border-white/[0.10] rounded-lg p-5 text-center hover:border-[#C9A84C]/40 transition-colors cursor-pointer">
                            <Upload size={18} className="mx-auto text-gray-500 mb-2" />
                            <p className="text-xs text-gray-500">Drop images or click to upload</p>
                            <p className="text-xs text-gray-600 mt-1">via Cloudinary</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#C9A84C] hover:bg-[#b8973b] disabled:opacity-60 text-black rounded-lg text-sm font-semibold transition-colors"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <Link href="/admin/products" className="block w-full py-2.5 bg-white/[0.04] border border-white/[0.08] text-gray-300 rounded-lg text-sm font-medium text-center hover:text-white transition-colors">
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
