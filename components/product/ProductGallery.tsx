'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

interface ProductImage {
    url: string;
    publicId: string;
    isMain: boolean;
}

interface ProductGalleryProps {
    images: ProductImage[];
    activeImageUrl?: string;
    onImageChange?: (url: string) => void;
}

export default function ProductGallery({ images, activeImageUrl, onImageChange }: ProductGalleryProps) {
    const defaultImages = images && images.length > 0 ? images : [{ url: '/images/products/phin-collection.jpg', publicId: 'fallback', isMain: true }];
    const mainImageFallback = defaultImages.find(i => i.isMain)?.url || defaultImages[0].url;

    // Maintain a local state if the parent doesn't provide an active image, but prefer parent state if available.
    const [localActiveImage, setLocalActiveImage] = useState<string>(activeImageUrl || mainImageFallback);

    // Sync with parent when the explicit activeImage changes (e.g., from variant selection)
    useEffect(() => {
        if (activeImageUrl && activeImageUrl !== localActiveImage) {
            setLocalActiveImage(activeImageUrl);
        }
    }, [activeImageUrl]);

    const handleThumbnailClick = (url: string) => {
        setLocalActiveImage(url);
        if (onImageChange) {
            onImageChange(url);
        }
    };

    const containerRef = useRef<HTMLDivElement>(null);

    // Filter to ensure thumbnails only show if we actually have multiple *real* images, 
    // or if we have at least 1 image we want to show it.
    const hasThumbnails = images && images.length > 0;

    return (
        <div className="flex flex-col gap-4 sticky top-24">
            {/* Main Image Container */}
            <div
                ref={containerRef}
                className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F8F9FB] border border-[#E5E7EB] group"
            >
                <img
                    src={localActiveImage}
                    alt="Product Main"
                    className="w-full h-full object-cover transition-transform duration-300 ease-out"
                />

                {/* Mobile indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 sm:hidden pointer-events-none">
                    {defaultImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${img.url === localActiveImage ? 'bg-[#111111]' : 'bg-[#111111]/30'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Thumbnail Strip */}
            {hasThumbnails && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x flex-nowrap sm:flex-wrap">
                    {defaultImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleThumbnailClick(img.url)}
                            className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden snap-center transition-all border-2 
                                ${img.url === localActiveImage ? 'border-[#111111] scale-100 opacity-100' : 'border-transparent opacity-70 hover:opacity-100 scale-95 hover:scale-100'}`}
                        >
                            <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
