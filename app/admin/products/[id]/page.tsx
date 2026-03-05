'use client';

import { useState, useEffect } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    async function fetchProduct(productId: string) {
        try {
            const res = await fetch(`/api/admin/products/${productId}`);
            const json = await res.json();
            if (json.success) {
                setProduct(json.data);
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-[#C9A84C]" size={32} />
            </div>
        );
    }

    if (!product) {
        return <div className="text-white">Product not found</div>;
    }

    return (
        <div className="space-y-6">
            <ProductForm initialData={product} isEdit={true} />
        </div>
    );
}
