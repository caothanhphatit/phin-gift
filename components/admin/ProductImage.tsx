'use client';

import { useState } from 'react';

interface ProductImageProps {
    src?: string;
    alt?: string;
}

export default function ProductImage({ src, alt }: ProductImageProps) {
    const [errored, setErrored] = useState(false);

    if (!src || errored) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-stone-800/20">
                <span className="text-[10px] text-amber-700/60 font-medium">IMG</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setErrored(true)}
        />
    );
}
