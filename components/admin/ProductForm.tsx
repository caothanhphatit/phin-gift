'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Loader2, Save, ArrowLeft, X, Wand2, UploadCloud, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { FormEvent, useRef } from 'react';

interface Category {
    _id: string;
    name: { en: string; vi: string };
    classificationIds: Classification[];
}

interface Classification {
    _id: string;
    name: { en: string; vi: string };
    attributes: Attribute[];
}

interface Attribute {
    code: string;
    name: { en: string; vi: string };
    type: 'text' | 'number' | 'boolean' | 'select';
    options: { en: string; vi: string }[];
    unit?: string;
    isVariantDefining: boolean;
    required: boolean;
}

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // For Dynamic Attribute Variant Matrix generation state
    const [matrixOptions, setMatrixOptions] = useState<Record<string, string[]>>({});

    const [formData, setFormData] = useState({
        name: { en: '', vi: '' },
        slug: '',
        shortDescription: { en: '', vi: '' },
        description: { en: '', vi: '' },
        usageGuide: { en: '', vi: '' },
        shippingReturns: { en: '', vi: '' },
        basePrice: 0,
        salePrice: 0,
        categories: [] as string[],
        images: [] as { url: string; publicId: string; isMain: boolean }[],
        variants: [] as { sku: string; price: number; salePrice?: number; stock: number; attributes: Record<string, any>; image?: { url: string; publicId: string; } }[],
        specifications: {} as Record<string, any>,
        status: 'draft' as 'draft' | 'published',
        isFeatured: false,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const variantFileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [activeVariantUploadIndex, setActiveVariantUploadIndex] = useState<number | null>(null);
    const [variantImageModalIndex, setVariantImageModalIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchCategories();
        if (initialData) {
            setFormData({
                ...initialData,
                categories: initialData.categories.map((c: any) => typeof c === 'object' ? c._id : c),
                specifications: initialData.specifications || {},
                variants: initialData.variants || [],
                status: initialData.status || 'draft',
                usageGuide: initialData.usageGuide || { en: '', vi: '' },
                shippingReturns: initialData.shippingReturns || { en: '', vi: '' },
            });

            // Reconstruct Matrix Options from existing variants if editing
            if (initialData.variants && initialData.variants.length > 0) {
                const extractedOptions: Record<string, Set<string>> = {};
                initialData.variants.forEach((v: any) => {
                    if (v.attributes) {
                        Object.entries(v.attributes).forEach(([code, val]) => {
                            if (!extractedOptions[code]) extractedOptions[code] = new Set();
                            const enVal = (val && typeof val === 'object') ? (val as any).en : String(val);
                            extractedOptions[code].add(enVal);
                        });
                    }
                });
                const reconstructed: Record<string, string[]> = {};
                Object.entries(extractedOptions).forEach(([code, set]) => reconstructed[code] = Array.from(set));
                setMatrixOptions(reconstructed);
            }
        }
    }, [initialData]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories?includeClassifications=true');
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    // Calculate active classifications based on selected categories
    const activeClassifications = useMemo(() => {
        const clsMap = new Map<string, Classification>();
        categories.forEach(cat => {
            if (formData.categories.includes(cat._id) && cat.classificationIds) {
                cat.classificationIds.forEach(cls => {
                    clsMap.set(cls._id, cls);
                });
            }
        });
        return Array.from(clsMap.values());
    }, [categories, formData.categories]);

    // Split attributes into Global Specs and Variant Defining Specs
    const { globalSpecs, variantDefiningSpecs } = useMemo(() => {
        const global: Attribute[] = [];
        const defining: Attribute[] = [];

        activeClassifications.forEach(cls => {
            cls.attributes.forEach(attr => {
                // Avoid duplicates if multiple categories share a classification
                if (attr.isVariantDefining) {
                    if (!defining.find(a => a.code === attr.code)) defining.push(attr);
                } else {
                    if (!global.find(a => a.code === attr.code)) global.push(attr);
                }
            });
        });

        return { globalSpecs: global, variantDefiningSpecs: defining };
    }, [activeClassifications]);


    const handleChange = (field: string, value: any, subField?: string) => {
        if (subField) {
            setFormData(prev => ({ ...prev, [field]: { ...prev[field as keyof typeof prev] as any, [subField]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSpecChange = (code: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [code]: value
            }
        }));
    };

    // Variant Matrix Generation Logic
    const toggleMatrixOption = (code: string, value: string) => {
        setMatrixOptions(prev => {
            const current = prev[code] || [];
            if (current.includes(value)) {
                return { ...prev, [code]: current.filter(v => v !== value) };
            } else {
                return { ...prev, [code]: [...current, value] };
            }
        });
    };

    const generateVariants = () => {
        // Collect arrays of active options for each defining attribute
        const arraysToCartesian: { code: string; activeOptions: any[] }[] = [];

        variantDefiningSpecs.forEach(spec => {
            const activeStrings = matrixOptions[spec.code] || [];
            // Crucial Fix: Only consider options that are actually defined/visible in the UI for this category
            // and map them to their full objects for localized storage
            const validActive = spec.options?.filter(opt => activeStrings.includes(opt.en)) || [];

            if (validActive.length > 0) {
                arraysToCartesian.push({ code: spec.code, activeOptions: validActive });
            }
        });

        if (arraysToCartesian.length < variantDefiningSpecs.length) {
            console.log("Matrix Generation Failure Debug:");
            console.log("- variantDefiningSpecs count:", variantDefiningSpecs.length);
            console.log("- arraysToCartesian count:", arraysToCartesian.length);
            console.log("- variantDefiningSpecs codes:", variantDefiningSpecs.map(s => s.code));
            console.log("- Selected matrix option codes:", Object.keys(matrixOptions));

            alert(`Please select at least one option for ALL defining attributes (${variantDefiningSpecs.map(s => s.name.en).join(', ')}).`);
            return;
        }

        // Cartesian product - now handles full { en, vi } objects
        const generateCartesian = (arrays: { code: string; activeOptions: any[] }[]): Record<string, any>[] => {
            if (arrays.length === 0) return [{}];
            const [first, ...rest] = arrays;
            const restCombinations = generateCartesian(rest);

            const results: Record<string, any>[] = [];
            first.activeOptions.forEach(val => {
                restCombinations.forEach(combo => {
                    results.push({ ...combo, [first.code]: val });
                });
            });
            return results;
        };

        const combinations = generateCartesian(arraysToCartesian);

        // Map to variant objects, trying to preserve old data if SKU matches or attributes match
        const generatedVariants = combinations.map((combo, i) => {
            // Find if existing exists by matching all attributes (comparing the .en property)
            const existing = formData.variants.find(v => {
                const vAttrs = v.attributes || {};
                const comboKeys = Object.keys(combo);
                const vKeys = Object.keys(vAttrs).filter(k => vAttrs[k] !== undefined && vAttrs[k] !== null);

                if (comboKeys.length !== vKeys.length) return false;

                return comboKeys.every(k => {
                    const vVal = (vAttrs[k] && typeof vAttrs[k] === 'object') ? (vAttrs[k] as any).en : String(vAttrs[k]);
                    const comboVal = (combo[k] && typeof combo[k] === 'object') ? (combo[k] as any).en : String(combo[k]);
                    return vVal === comboVal;
                });
            });

            if (existing) return existing;

            // Generate temporary SKU prefix
            const prefix = formData.slug || 'SKU';
            const suffix = Object.values(combo).map(val => {
                const s = typeof val === 'object' ? val.en : String(val);
                return s.replace(/\s+/g, '').substring(0, 3).toUpperCase();
            }).join('-');

            return {
                sku: `${prefix}-${suffix}-${Date.now()}-${i + 1}`.toUpperCase(),
                price: formData.basePrice,
                salePrice: 0,
                stock: 0,
                attributes: combo
            };
        });

        // Additive Logic: Instead of replacing everything, we merge.
        // We keep all current variants, and add any NEWLY generated ones that aren't already in the list.
        setFormData(prev => {
            const result = [...prev.variants];
            generatedVariants.forEach(gv => {
                const alreadyInList = result.find(v => {
                    const vAttrs = v.attributes || {};
                    const gAttrs = gv.attributes || {};
                    const gKeys = Object.keys(gAttrs);

                    if (gKeys.length !== Object.keys(vAttrs).length) return false;

                    return gKeys.every(k => {
                        const vVal = (vAttrs[k] && typeof vAttrs[k] === 'object') ? (vAttrs[k] as any).en : String(vAttrs[k]);
                        const gVal = (gAttrs[k] && typeof gAttrs[k] === 'object') ? (gAttrs[k] as any).en : String(gAttrs[k]);
                        return vVal === gVal;
                    });
                });
                if (!alreadyInList) {
                    result.push(gv);
                }
            });
            return { ...prev, variants: result };
        });
    };

    const handleVariantFieldChange = (index: number, field: string, value: any) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleRemoveVariant = (index: number) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    const handleRemoveVariantImage = (index: number) => {
        const newVariants = [...formData.variants];
        const updatedVariant = { ...newVariants[index] };
        delete updatedVariant.image;
        newVariants[index] = updatedVariant;
        setFormData(prev => ({ ...prev, variants: newVariants }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, variantIndex?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            const uploadFormData = new window.FormData();
            uploadFormData.append('file', file);

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: uploadFormData
            });
            const data = await res.json();

            if (data.success) {
                if (variantIndex !== undefined) {
                    // Update variant image
                    const newVariants = [...formData.variants];
                    newVariants[variantIndex] = {
                        ...newVariants[variantIndex],
                        image: { url: data.data.url, publicId: data.data.publicId }
                    };
                    setFormData(prev => ({ ...prev, variants: newVariants }));
                } else {
                    // Update main gallery
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, { url: data.data.url, publicId: data.data.publicId, isMain: prev.images.length === 0 }]
                    }));
                }
            } else {
                alert(data.error || 'Failed to upload image');
            }
        } catch (err) {
            console.error(err);
            alert('Upload error');
        } finally {
            setUploadingImage(false);
            if (e.target) e.target.value = '';
            setActiveVariantUploadIndex(null);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (formData.status === 'published' && formData.images.length === 0) {
            alert("A product must have at least one image in the gallery to be published.");
            return;
        }

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
        <>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-20">
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">Usage Guide (En)</label>
                                    <textarea
                                        value={formData.usageGuide.en}
                                        onChange={(e) => handleChange('usageGuide', e.target.value, 'en')}
                                        rows={4}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">Usage Guide (Vi)</label>
                                    <textarea
                                        value={formData.usageGuide.vi}
                                        onChange={(e) => handleChange('usageGuide', e.target.value, 'vi')}
                                        rows={4}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">Shipping & Returns (En)</label>
                                    <textarea
                                        value={formData.shippingReturns.en}
                                        onChange={(e) => handleChange('shippingReturns', e.target.value, 'en')}
                                        rows={4}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">Shipping & Returns (Vi)</label>
                                    <textarea
                                        value={formData.shippingReturns.vi}
                                        onChange={(e) => handleChange('shippingReturns', e.target.value, 'vi')}
                                        rows={4}
                                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Global Specifications */}
                        {globalSpecs.length > 0 && (
                            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                                <h2 className="text-lg font-medium text-[#C9A84C] mb-4">Technical Specifications</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {globalSpecs.map(spec => (
                                        <div key={spec.code}>
                                            <label className="block text-xs text-gray-400 mb-1.5">
                                                {spec.name.en} {spec.unit && `(${spec.unit})`}
                                                {spec.required && ' *'}
                                            </label>

                                            {spec.type === 'select' && (
                                                <select
                                                    value={formData.specifications[spec.code] || ''}
                                                    onChange={(e) => handleSpecChange(spec.code, e.target.value)}
                                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                                >
                                                    <option value="">-- Select --</option>
                                                    {spec.options?.map(opt => (
                                                        <option key={opt.en} value={opt.en}>{opt.en} / {opt.vi}</option>
                                                    ))}
                                                </select>
                                            )}

                                            {spec.type === 'boolean' && (
                                                <label className="flex items-center gap-2 mt-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!formData.specifications[spec.code]}
                                                        onChange={(e) => handleSpecChange(spec.code, e.target.checked)}
                                                        className="rounded border-gray-600 bg-gray-700 text-[#C9A84C]"
                                                    />
                                                    <span className="text-sm text-white">Yes / True</span>
                                                </label>
                                            )}

                                            {spec.type === 'text' && (
                                                <input
                                                    type="text"
                                                    value={formData.specifications[spec.code] || ''}
                                                    onChange={(e) => handleSpecChange(spec.code, e.target.value)}
                                                    placeholder={`Enter ${spec.name.en}`}
                                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                                />
                                            )}

                                            {spec.type === 'number' && (
                                                <input
                                                    type="number"
                                                    value={formData.specifications[spec.code] || ''}
                                                    onChange={(e) => handleSpecChange(spec.code, Number(e.target.value))}
                                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Variant Generator Matrix */}
                        {variantDefiningSpecs.length > 0 && (
                            <div className="bg-white/[0.03] border border-blue-500/30 rounded-xl p-6 space-y-4 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -z-10 rounded-full" />
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-blue-400">Variant Generator</h2>
                                    <button
                                        type="button"
                                        onClick={generateVariants}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg"
                                    >
                                        <Wand2 size={16} /> Generate Matrix
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400">Select the options available for this product. Click Generate to build all distinct combinations.</p>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                                    {variantDefiningSpecs.map(spec => (
                                        <div key={spec.code} className="bg-black/30 p-4 border border-white/[0.05] rounded-xl">
                                            <h3 className="text-sm font-semibold text-white mb-3">{spec.name.en}</h3>
                                            <div className="flex flex-col gap-2">
                                                {spec.options?.map(opt => {
                                                    const isActive = (matrixOptions[spec.code] || []).includes(opt.en);
                                                    return (
                                                        <label key={opt.en} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-all ${isActive ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/[0.02] border-transparent hover:bg-white/[0.05]'}`}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isActive}
                                                                onChange={() => toggleMatrixOption(spec.code, opt.en)}
                                                                className="rounded border-gray-600 text-blue-500"
                                                            />
                                                            <span className={`text-sm ${isActive ? 'text-blue-200' : 'text-gray-400'}`}>{opt.en} / {opt.vi}</span>
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Generated Variants Grid */}
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4 overflow-x-auto">
                            <div className="flex items-center justify-between min-w-[600px]">
                                <h2 className="text-lg font-medium text-white">Variant Database ({formData.variants.length})</h2>
                                <div className="text-xs text-gray-500">Auto-generated from matrix above.</div>
                            </div>

                            {formData.variants.length > 0 ? (
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="border-b border-white/[0.1] text-xs text-gray-400 uppercase tracking-wider">
                                            <th className="py-3 px-2 w-12 text-center">Img</th>
                                            <th className="py-3 px-2">SKU</th>
                                            {variantDefiningSpecs.map(spec => (
                                                <th key={spec.code} className="py-3 px-2 text-[#C9A84C]">{spec.name.en}</th>
                                            ))}
                                            {/* Backwards compatibility for old variant structures */}
                                            {variantDefiningSpecs.length === 0 && (
                                                <>
                                                    <th className="py-3 px-2">Size</th>
                                                    <th className="py-3 px-2">Color</th>
                                                </>
                                            )}
                                            <th className="py-3 px-2">Base Px</th>
                                            <th className="py-3 px-2">Sale Px</th>
                                            <th className="py-3 px-2">Stock</th>
                                            <th className="py-3 px-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.05]">
                                        {formData.variants.map((variant: any, index) => (
                                            <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="py-2 px-2 text-center">
                                                    <div className="relative group/img cursor-pointer w-10 h-10 rounded border border-white/[0.1] bg-white/[0.02] flex items-center justify-center overflow-hidden shrink-0"
                                                        onClick={() => setVariantImageModalIndex(index)}
                                                    >
                                                        {variant.image?.url ? (
                                                            <>
                                                                <img src={variant.image.url} className="w-full h-full object-cover" alt="" />
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                                                    <ImageIcon size={14} className="text-white" />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <ImageIcon size={14} className="text-gray-500 group-hover/img:text-white transition-colors" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-2 px-2">
                                                    <input
                                                        type="text"
                                                        value={variant.sku}
                                                        onChange={(e) => handleVariantFieldChange(index, 'sku', e.target.value)}
                                                        className="w-32 bg-black/40 border border-white/[0.1] rounded px-2 py-1.5 text-xs text-white"
                                                    />
                                                </td>
                                                {variantDefiningSpecs.map(spec => {
                                                    const val = variant.attributes?.[spec.code];
                                                    const displayVal = (val && typeof val === 'object') ? `${(val as any).en} / ${(val as any).vi}` : (val || '-');
                                                    return (
                                                        <td key={spec.code} className="py-2 px-2 text-xs text-gray-300 font-medium whitespace-nowrap">
                                                            {displayVal}
                                                        </td>
                                                    );
                                                })}
                                                {/* Legacy render */}
                                                {variantDefiningSpecs.length === 0 && (
                                                    <>
                                                        <td className="py-2 px-2 text-xs text-gray-300">{variant.size || '-'}</td>
                                                        <td className="py-2 px-2 text-xs text-gray-300">{variant.color || '-'}</td>
                                                    </>
                                                )}
                                                <td className="py-2 px-2">
                                                    <input
                                                        type="number"
                                                        value={variant.price}
                                                        onChange={(e) => handleVariantFieldChange(index, 'price', Number(e.target.value))}
                                                        className="w-24 bg-black/40 border border-white/[0.1] rounded px-2 py-1.5 text-xs text-[#C9A84C]"
                                                    />
                                                </td>
                                                <td className="py-2 px-2">
                                                    <input
                                                        type="number"
                                                        value={variant.salePrice}
                                                        onChange={(e) => handleVariantFieldChange(index, 'salePrice', Number(e.target.value))}
                                                        className="w-24 bg-black/40 border border-white/[0.1] rounded px-2 py-1.5 text-xs text-green-400"
                                                    />
                                                </td>
                                                <td className="py-2 px-2">
                                                    <input
                                                        type="number"
                                                        value={variant.stock}
                                                        onChange={(e) => handleVariantFieldChange(index, 'stock', Number(e.target.value))}
                                                        className="w-20 bg-black/40 border border-white/[0.1] rounded px-2 py-1.5 text-xs text-white text-right"
                                                    />
                                                </td>
                                                <td className="py-2 px-2 text-right">
                                                    <button type="button" onClick={() => handleRemoveVariant(index)} className="text-red-400 hover:text-red-300 p-1">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-8 text-sm text-gray-500 italic border border-dashed border-white/[0.1] rounded-lg bg-black/20">
                                    No variants configured. {variantDefiningSpecs.length === 0 ? "You must use classifications on categories to enable variations." : "Use the generator matrix above to build variants."}
                                </div>
                            )}


                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Organization Container */}
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                            <h2 className="text-lg font-medium text-white mb-4">Organization</h2>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Categories *</label>
                                <p className="text-[10px] text-gray-500 mb-2">Changing categories will reload technical specs and variant matrices.</p>
                                <div className="space-y-2 max-h-60 overflow-y-auto p-4 bg-black/30 rounded-lg border border-white/[0.05]">
                                    {categories.map(cat => (
                                        <label key={cat._id} className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer hover:bg-white/[0.02] p-1.5 rounded transition-colors">
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
                                            <span>{cat.name.en} / {cat.name.vi}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.05] space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs text-gray-400">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                                        className="w-full bg-black/40 border border-white/[0.1] rounded px-3 py-2 text-sm text-white focus:border-[#C9A84C]/50 outline-none"
                                    >
                                        <option value="draft">Draft (Hidden)</option>
                                        <option value="published">Published (Visible)</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))} id="isFeatured" className="rounded border-gray-600 bg-gray-700 text-[#C9A84C]" />
                                    <label htmlFor="isFeatured" className="text-sm font-medium text-[#C9A84C]">Featured Product</label>
                                </div>
                            </div>
                        </div>

                        {/* Basic Pricing Reference */}
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                            <h2 className="text-md font-medium text-white mb-2">Base Values</h2>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Base Price (VND)</label>
                                <input
                                    type="number"
                                    value={formData.basePrice}
                                    onChange={(e) => handleChange('basePrice', Number(e.target.value))}
                                    required
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#C9A84C] focus:border-[#C9A84C]/50 outline-none"
                                />
                            </div>
                        </div>

                        {/* Images */}
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-medium text-white">Image Gallery</h2>
                                    <p className="text-[10px] text-gray-500 mt-1">{formData.images.length}/5 Images Uploaded (1 required to publish)</p>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={(e) => handleImageUpload(e)}
                                />
                                {/* Hidden file input for variants */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={variantFileInputRef}
                                    onChange={(e) => handleImageUpload(e, activeVariantUploadIndex as number)}
                                />

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingImage || formData.images.length >= 5}
                                    className="text-xs text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                                >
                                    {uploadingImage && activeVariantUploadIndex === null ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <UploadCloud size={14} />
                                    )}
                                    Upload
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {formData.images.map((img, i) => (
                                    <div key={i} className="relative aspect-square bg-white/[0.06] rounded-lg overflow-hidden group border border-white/[0.1]">
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newImages = formData.images.filter((_, idx) => idx !== i);
                                                // Handle case where main image was removed
                                                if (img.isMain && newImages.length > 0) newImages[0].isMain = true;
                                                setFormData(prev => ({ ...prev, images: newImages }));
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                        >
                                            <X size={14} />
                                        </button>
                                        {img.isMain && (
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#C9A84C] text-[10px] text-black font-bold uppercase rounded-sm tracking-wider">
                                                Main
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {formData.images.length === 0 && (
                                <div className="text-center py-6 text-xs text-gray-500 border border-dashed border-white/[0.1] rounded-lg items-center flex flex-col gap-2">
                                    <ImageIcon size={24} className="opacity-20" />
                                    No images added
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            {/* Variant Image Modal */}
            {variantImageModalIndex !== null && formData.variants[variantImageModalIndex] && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6" onClick={() => setVariantImageModalIndex(null)}>
                    <div
                        className="bg-black border border-white/[0.1] rounded-xl w-full max-w-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.1] bg-white/[0.02] rounded-t-xl">
                            <h3 className="text-sm font-medium text-white">Variant Image</h3>
                            <button type="button" onClick={() => setVariantImageModalIndex(null)} className="text-gray-400 hover:text-white p-1">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6 flex flex-col items-center">
                            <div className="w-48 h-48 border border-white/[0.1] rounded-lg bg-white/[0.02] mb-6 overflow-hidden flex items-center justify-center relative bg-black/50">
                                {formData.variants[variantImageModalIndex].image?.url ? (
                                    <img src={formData.variants[variantImageModalIndex].image.url} alt="Variant" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center flex flex-col items-center text-gray-500">
                                        <ImageIcon size={32} className="opacity-50 mb-2" />
                                        <span className="text-xs">No Image Available</span>
                                    </div>
                                )}

                                {uploadingImage && activeVariantUploadIndex === variantImageModalIndex && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader2 size={24} className="animate-spin text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveVariantUploadIndex(variantImageModalIndex);
                                        variantFileInputRef.current?.click();
                                    }}
                                    disabled={uploadingImage}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <UploadCloud size={16} /> {formData.variants[variantImageModalIndex].image?.url ? 'Change Image' : 'Upload Image'}
                                </button>

                                {formData.variants[variantImageModalIndex].image?.url && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveVariantImage(variantImageModalIndex)}
                                        className="w-full flex items-center justify-center gap-2 p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Trash2 size={16} /> Remove Image
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
