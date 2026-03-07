'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import B2BOrderDetailClient from '@/components/admin/B2BOrderDetailClient';

export default function B2BOrderDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (id) fetchOrder(id);
    }, [id]);

    async function fetchOrder(orderId: string) {
        try {
            const res = await fetch(`/api/admin/b2b-orders/${orderId}`);
            const json = await res.json();
            if (json.success) {
                setOrder(json.data);
            } else {
                setError(true);
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32">
                <Loader2 className="animate-spin text-[#C9A84C]" size={32} />
            </div>
        );
    }

    if (error || !order) {
        return <div className="text-red-400 py-12 text-center">Order not found.</div>;
    }

    return <B2BOrderDetailClient order={order} />;
}
