'use client';

import { useState, useMemo, useEffect } from 'react';
import { Minus, Plus, ShoppingCart, CreditCard } from 'lucide-react';
import ProductGallery from './ProductGallery';
import ProductTabs from './ProductTabs';

interface ProductDetailClientProps {
    product: any;
    locale: string;
}

export default function ProductDetailClient({ product, locale }: ProductDetailClientProps) {
    const l = locale as 'en' | 'vi';

    // Core data mapping
    const basicInfo = {
        name: product.name?.[l] || '',
        shortDesc: product.shortDescription?.[l] || '',
        desc: product.description?.[l] || '',
        usage: product.usageGuide?.[l] || '',
        shipping: product.shippingReturns?.[l] || '',
        specs: product.specifications || {},
        originalPrice: product.basePrice,
        salePrice: product.salePrice,
    };

    // Images
    const [images, setImages] = useState(product.images || []);

    // Selection State
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);

    // 1. Auto-select first available variant on load
    useEffect(() => {
        if (product.variants && product.variants.length > 0 && Object.keys(selectedAttributes).length === 0) {
            // Prefer first variant that is in stock, otherwise just the first one
            const firstAvailable = product.variants.find((v: any) => v.stock > 0) || product.variants[0];
            if (firstAvailable.attributes) {
                const initialAttrs: Record<string, string> = {};
                Object.entries(firstAvailable.attributes).forEach(([k, v]) => {
                    initialAttrs[k] = (v && typeof v === 'object') ? (v as any).en : String(v);
                });
                setSelectedAttributes(initialAttrs);
            }
        }
    }, [product.variants]);

    // Find matching variant based on selections
    const activeVariant = useMemo(() => {
        if (!product.variants || product.variants.length === 0) return null;
        if (Object.keys(selectedAttributes).length === 0) return null;

        return product.variants.find((v: any) => {
            if (!v.attributes) return false;
            return Object.entries(selectedAttributes).every(([k, val]) => {
                const attrVal = v.attributes[k];
                const enVal = (attrVal && typeof attrVal === 'object') ? (attrVal as any).en : String(attrVal);
                return enVal === val;
            });
        });
    }, [selectedAttributes, product.variants]);

    // Helper to check if an option is available given CURRENT selections for OTHER attributes
    const isOptionAvailable = (attrCode: string, value: string) => {
        if (!product.variants) return false;

        return product.variants.some((v: any) => {
            if (!v.attributes) return false;
            const attrVal = v.attributes[attrCode];
            const enVal = (attrVal && typeof attrVal === 'object') ? (attrVal as any).en : String(attrVal);
            if (enVal !== value) return false;

            // It must match all OTHER currently selected attributes
            return Object.entries(selectedAttributes).every(([k, val]) => {
                if (k === attrCode) return true; // skip current
                const otherAttrVal = v.attributes[k];
                const otherEnVal = (otherAttrVal && typeof otherAttrVal === 'object') ? (otherAttrVal as any).en : String(otherAttrVal);
                return otherEnVal === val;
            });
        });
    };

    // More aggressive version: Is this combo even buildable and IN STOCK?
    const isOptionInStock = (attrCode: string, value: string) => {
        if (!product.variants) return false;
        return product.variants.some((v: any) => {
            if (!v.attributes) return false;
            const attrVal = v.attributes[attrCode];
            const enVal = (attrVal && typeof attrVal === 'object') ? (attrVal as any).en : String(attrVal);
            if (enVal !== value) return false;

            const matchesOthers = Object.entries(selectedAttributes).every(([k, val]) => {
                if (k === attrCode) return true;
                const otherAttrVal = v.attributes[k];
                const otherEnVal = (otherAttrVal && typeof otherAttrVal === 'object') ? (otherAttrVal as any).en : String(otherAttrVal);
                return otherEnVal === val;
            });
            return matchesOthers && v.stock > 0;
        });
    };

    // Active Display Logic
    const displayPrice = activeVariant ? activeVariant.price : (basicInfo.salePrice || basicInfo.originalPrice);
    const displayOriginalPrice = activeVariant?.salePrice ? activeVariant.price : (basicInfo.salePrice ? basicInfo.originalPrice : null);
    const stockStatus = activeVariant ? activeVariant.stock : (product.variants?.length ? 0 : 999); // Fallback for no variants
    const activeImageUrl = activeVariant?.image?.url;

    // Attribute mapping for UI options
    const availableAttributes = useMemo(() => {
        const specs: Record<string, { en: string; vi: string }[]> = {};
        if (product.variants) {
            product.variants.forEach((v: any) => {
                if (v.attributes) {
                    Object.entries(v.attributes).forEach(([k, val]) => {
                        if (!specs[k]) specs[k] = [];
                        const obj = (val && typeof val === 'object') ? (val as any) : { en: String(val), vi: String(val) };
                        if (!specs[k].find(o => o.en === obj.en)) {
                            specs[k].push(obj);
                        }
                    });
                }
            });
        }
        return specs;
    }, [product.variants]);

    // Format Currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleAddToCart = () => {
        alert(`Added ${quantity} of ${basicInfo.name} to cart. SKU: ${activeVariant?.sku || 'Default'}`);
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 lg:pt-40 relative pb-32 lg:pb-16 text-[#111111]">
                {/* 60/40 Split using Grid 12 cols: 7 Left, 5 Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-start">

                    {/* Left Column: Gallery */}
                    <div className="w-full lg:col-span-7">
                        <ProductGallery
                            images={images}
                            activeImageUrl={activeImageUrl}
                        />
                    </div>

                    {/* Right Column: Info & Actions */}
                    <div className="flex flex-col bg-[#F8F9FB] rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-8 xl:p-10 border border-[#E5E7EB] lg:col-span-5 gap-6 sm:gap-8">
                        {/* Header */}
                        <div className="flex flex-col gap-3">
                            <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#111111] tracking-tight leading-tight">{basicInfo.name}</h1>
                            <p className="text-base text-[#555555] opacity-90 leading-relaxed">{basicInfo.shortDesc}</p>
                        </div>

                        <div className="h-px w-full bg-[#E5E7EB]"></div>

                        {/* Pricing & Stock Wrap */}
                        <div className="flex flex-col gap-5">
                            <div className="flex items-baseline gap-4 flex-wrap">
                                <span className="text-[24px] sm:text-[28px] font-bold text-[#DC2626] tracking-tight">
                                    {formatCurrency(activeVariant?.salePrice || displayPrice)}
                                </span>
                                {(displayOriginalPrice !== null || activeVariant?.salePrice) && (
                                    <span className="text-lg text-[#9CA3AF] line-through decoration-[#9CA3AF]">
                                        {formatCurrency(activeVariant?.salePrice ? activeVariant.price : displayOriginalPrice as number)}
                                    </span>
                                )}

                                {(displayOriginalPrice !== null || activeVariant?.salePrice) && (
                                    <span className="px-2.5 py-1 bg-[#FEE2E2] text-[#DC2626] text-xs font-bold uppercase tracking-wider rounded">
                                        Sale
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <div className={`w-2 h-2 rounded-full ${stockStatus > 10 ? 'bg-[#16A34A]' : stockStatus > 0 ? 'bg-orange-500' : 'bg-[#DC2626]'}`} />
                                    <span className={stockStatus > 10 ? 'text-[#16A34A]' : stockStatus > 0 ? 'text-orange-600' : 'text-[#DC2626]'}>
                                        {stockStatus > 10 ? 'In Stock' : stockStatus > 0 ? `Low Stock (${stockStatus} left)` : 'Out of Stock'}
                                    </span>
                                </div>
                                {activeVariant && (
                                    <p className="text-xs text-[#888888] mt-1.5 uppercase font-mono tracking-wider">SKU: {activeVariant.sku}</p>
                                )}
                            </div>
                        </div>

                        {/* Variant Selection */}
                        {Object.keys(availableAttributes).length > 0 && (
                            <div className="space-y-6 mb-8 border-t border-[#E5E7EB] pt-8">
                                {Object.entries(availableAttributes).map(([code, optionsList]) => (
                                    <div key={code}>
                                        <h3 className="text-[16px] font-semibold text-[#111111] mb-3 capitalize">{code.replace(/_/g, ' ')}</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {optionsList.map((optObj: any) => {
                                                const optEn = optObj.en;
                                                const optLabel = optObj[l] || optObj.en;
                                                const isInStock = isOptionInStock(code, optEn);
                                                const isSelected = selectedAttributes[code] === optEn;

                                                return (
                                                    <button
                                                        key={optEn}
                                                        onClick={() => isInStock && setSelectedAttributes(prev => ({ ...prev, [code]: optEn }))}
                                                        disabled={!isInStock}
                                                        className={`px-5 py-2.5 border rounded-lg text-sm transition-all sm:flex-1 lg:flex-none font-medium
                                                        ${isSelected
                                                                ? 'border-[#111111] bg-[#111111] text-white shadow w-full sm:w-auto'
                                                                : 'border-[#E5E7EB] text-[#555555] hover:border-[#111111] hover:text-[#111111] bg-white'
                                                            }
                                                        ${!isInStock ? 'opacity-30 cursor-not-allowed border-dashed grayscale-[0.5]' : 'cursor-pointer'}
                                                        `}
                                                    >
                                                        {optLabel}
                                                        {!isInStock && isOptionAvailable(code, optEn) && (
                                                            <span className="block text-[10px] opacity-70 mt-0.5">Out of stock</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="h-px w-full bg-[#E5E7EB] hidden lg:block"></div>

                        {/* Purchase Actions (Desktop inline, Mobile Sticky) */}
                        <div className="flex flex-col gap-4 lg:pt-2">
                            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 
                                          lg:relative lg:p-0 lg:bg-transparent lg:border-t-0 lg:shadow-none flex items-center gap-4">

                                <div className="flex items-center border border-[#E5E7EB] rounded-lg bg-white h-[52px]">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-full flex items-center justify-center text-[#555555] hover:text-[#111111] transition-colors"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-12 text-center text-[#111111] font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(stockStatus, quantity + 1))}
                                        disabled={quantity >= stockStatus}
                                        className="w-12 h-full flex items-center justify-center text-[#555555] hover:text-[#111111] transition-colors disabled:opacity-30"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={stockStatus === 0 || (product.variants?.length > 0 && Object.keys(selectedAttributes).length !== Object.keys(availableAttributes).length)}
                                    className="flex-1 flex items-center justify-center gap-2 h-[52px] bg-white text-[#111111] border border-[#111111] font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-[#E5E7EB]"
                                >
                                    <ShoppingCart size={18} />
                                    <span>Add to Cart</span>
                                </button>
                            </div>

                            {/* Buy Now (Desktop only block) */}
                            <div className="hidden lg:block">
                                <button
                                    disabled={stockStatus === 0 || (product.variants?.length > 0 && Object.keys(selectedAttributes).length !== Object.keys(availableAttributes).length)}
                                    className="w-full h-[52px] flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#333333] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CreditCard size={18} />
                                    <span>Buy it Now</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Tabs */}
                <div className="mt-16 lg:mt-20">
                    <ProductTabs
                        description={basicInfo.desc}
                        specifications={basicInfo.specs as Record<string, string>}
                        usageGuide={basicInfo.usage}
                        shippingReturns={basicInfo.shipping}
                    />
                </div>
            </div>
        </div>
    );
}
