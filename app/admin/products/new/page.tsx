'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold text-white">Add New Product</h1>
                    <p className="text-gray-400 text-sm mt-1">Fill in the product details below</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="col-span-2 space-y-4">
                    {/* Basic Info */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <h2 className="text-sm font-semibold text-white mb-4">Basic Information</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Name (Vietnamese) *</label>
                                <input type="text" placeholder="Tên sản phẩm..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Name (English) *</label>
                                <input type="text" placeholder="Product name..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5">Slug *</label>
                            <input type="text" placeholder="product-slug-url" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors font-mono" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Short Description (VI)</label>
                                <textarea rows={3} placeholder="Mô tả ngắn..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Short Description (EN)</label>
                                <textarea rows={3} placeholder="Short description..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors resize-none" />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <h2 className="text-sm font-semibold text-white mb-4">Pricing</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Base Price (₫) *</label>
                                <input type="number" placeholder="450000" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Sale Price (₫)</label>
                                <input type="number" placeholder="Optional..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-white">Variants (Size / Color)</h2>
                            <button className="flex items-center gap-1.5 text-xs text-[#C9A84C] hover:underline">
                                <Plus size={13} />
                                Add Variant
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-3 text-xs text-gray-500 pb-1">
                            <span>SKU</span><span>Size</span><span>Color</span><span>Stock</span>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            <input type="text" placeholder="PHIN-IN-001-S" className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors font-mono" />
                            <input type="text" placeholder="Small" className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
                            <input type="text" placeholder="Silver" className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
                            <input type="number" placeholder="50" className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Status */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-3">
                        <h2 className="text-sm font-semibold text-white">Status</h2>
                        <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                            <input type="checkbox" className="accent-[#C9A84C]" />
                            Featured product
                        </label>
                    </div>

                    {/* Category */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-3">
                        <h2 className="text-sm font-semibold text-white">Category</h2>
                        <select className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50">
                            <option>Select category...</option>
                            <option>Phin Inox</option>
                            <option>Phin Nhôm</option>
                            <option>Gift Sets</option>
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-3">
                        <h2 className="text-sm font-semibold text-white">Product Images</h2>
                        <div className="border-2 border-dashed border-white/[0.10] rounded-lg p-6 text-center hover:border-[#C9A84C]/40 transition-colors cursor-pointer">
                            <Upload size={20} className="mx-auto text-gray-500 mb-2" />
                            <p className="text-xs text-gray-500">Drop images or click to upload</p>
                            <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                        <button className="w-full py-2.5 bg-[#C9A84C] hover:bg-[#b8973b] text-black rounded-lg text-sm font-semibold transition-colors">
                            Save Product
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
