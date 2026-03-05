'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Upload, Loader2, Save, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';

interface Category {
    _id: string;
    name: { en: string; vi: string };
}

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: { en: '', vi: '' },
        slug: '',
        shortDescription: { en: '', vi: '' },
        description: { en: '', vi: '' },
        basePrice: 0,
        salePrice: 0,
        categories: [] as string[],
        images: [] as { url: string; publicId: string; isMain: boolean }[],
        variants: [] as { sku: string; size: string; color: string; price: number; salePrice?: number; stock: number }[],
        isActive: true,
        isFeatured: false,
    });

    useEffect(() => {
        fetchCategories();
        if (initialData) {
            setFormData({
                ...initialData,
                categories: initialData.categories.map((c: any) => typeof c === 'object' ? c._id : c),
            });
        }
    }, [initialData]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleChange = (field: string, value: any, subField?: string) => {
        if (subField) {
            setFormData(prev => ({ ...prev, [field]: { ...prev[field as keyof typeof prev] as any, [subField]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleAddVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...prev.variants, { sku: '', size: '', color: '', price: prev.basePrice, stock: 0 }]
        }));
    };

    const handleRemoveVariant = (index: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleVariantChange = (index: number, field: string, value: any) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleAddImage = () => {
        const url = prompt('Enter image URL (Cloudinary or other):');
        if (url) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, { url, publicId: 'manual', isMain: prev.images.length === 0 }]
            }));
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = isEdit ? `/api/admin/products/${initialData._id}` : '/api/admin/products';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                router.push('/admin/products');
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
             {/* Header */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-white">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#C9A84C] hover:bg-[#b8973b] text-black rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {isEdit ? 'Update Product' : 'Save Product'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-medium text-white mb-4">Basic Information</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Name (English)</label>
                                <input
                                    type="text"
                                    value={formData.name.en}
                                    onChange={(e) => handleChange('name', e.target.value, 'en')}
                                    required
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Name (Vietnamese)</label>
                                <input
                                    type="text"
                                    value={formData.name.vi}
                                    onChange={(e) => handleChange('name', e.target.value, 'vi')}
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

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Short Description (En)</label>
                                <textarea
                                    value={formData.shortDescription.en}
                                    onChange={(e) => handleChange('shortDescription', e.target.value, 'en')}
                                    rows={3}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Short Description (Vi)</label>
                                <textarea
                                    value={formData.shortDescription.vi}
                                    onChange={(e) => handleChange('shortDescription', e.target.value, 'vi')}
                                    rows={3}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                />
                            </div>
                        </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Description (En)</label>
                                <textarea
                                    value={formData.description.en}
                                    onChange={(e) => handleChange('description', e.target.value, 'en')}
                                    rows={5}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Description (Vi)</label>
                                <textarea
                                    value={formData.description.vi}
                                    onChange={(e) => handleChange('description', e.target.value, 'vi')}
                                    rows={5}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-medium text-white mb-4">Pricing</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Base Price (VND)</label>
                                <input
                                    type="number"
                                    value={formData.basePrice}
                                    onChange={(e) => handleChange('basePrice', Number(e.target.value))}
                                    required
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Sale Price (VND)</label>
                                <input
                                    type="number"
                                    value={formData.salePrice}
                                    onChange={(e) => handleChange('salePrice', Number(e.target.value))}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                         <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-white">Variants</h2>
                            <button type="button" onClick={handleAddVariant} className="text-xs flex items-center gap-1 text-[#C9A84C] hover:text-[#b8973b]">
                                <Plus size={14} /> Add Variant
                            </button>
                        </div>
                        
                        {formData.variants.map((variant, index) => (
                            <div key={index} className="grid grid-cols-6 gap-3 p-3 bg-white/[0.02] rounded-lg relative group">
                                <div className="col-span-1">
                                    <label className="block text-[10px] text-gray-500 mb-1">SKU</label>
                                    <input
                                        type="text"
                                        value={variant.sku}
                                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1.5 text-xs text-white"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] text-gray-500 mb-1">Size</label>
                                    <input
                                        type="text"
                                        value={variant.size}
                                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1.5 text-xs text-white"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] text-gray-500 mb-1">Color</label>
                                    <input
                                        type="text"
                                        value={variant.color}
                                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1.5 text-xs text-white"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] text-gray-500 mb-1">Price</label>
                                    <input
                                        type="number"
                                        value={variant.price}
                                        onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1.5 text-xs text-white"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] text-gray-500 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1.5 text-xs text-white"
                                    />
                                </div>
                                <div className="col-span-1 flex items-end justify-end pb-1">
                                    <button type="button" onClick={() => handleRemoveVariant(index)} className="text-red-400 hover:text-red-300">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Organization */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-medium text-white mb-4">Organization</h2>
                        
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5">Categories</label>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {categories.map(cat => (
                                    <label key={cat._id} className="flex items-center gap-2 text-sm text-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={formData.categories.includes(cat._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData(prev => ({ ...prev, categories: [...prev.categories, cat._id] }));
                                                } else {
                                                    setFormData(prev => ({ ...prev, categories: prev.categories.filter(id => id !== cat._id) }));
                                                }
                                            }}
                                            className="rounded border-gray-600 bg-transparent text-[#C9A84C] focus:ring-[#C9A84C]"
                                        />
                                        {cat.name.en} / {cat.name.vi}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                id="isActive"
                            />
                            <label htmlFor="isActive" className="text-sm text-gray-300">Active Product</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.isFeatured}
                                onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                id="isFeatured"
                            />
                            <label htmlFor="isFeatured" className="text-sm text-gray-300">Featured Product</label>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-white">Images</h2>
                            <button type="button" onClick={handleAddImage} className="text-xs text-[#C9A84C] hover:text-[#b8973b]">
                                Add URL
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {formData.images.map((img, i) => (
                                <div key={i} className="relative aspect-square bg-white/[0.06] rounded-lg overflow-hidden group">
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = formData.images.filter((_, idx) => idx !== i);
                                            setFormData(prev => ({ ...prev, images: newImages }));
                                        }}
                                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                    {img.isMain && (
                                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[#C9A84C] text-[10px] text-black font-bold rounded">
                                            MAIN
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}


