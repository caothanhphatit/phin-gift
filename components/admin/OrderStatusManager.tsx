'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, Clock, Truck, CircleCheck, Ban, Edit3 } from 'lucide-react';

// Shared statuses with model
const OrderStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'];

const statusMeta: any = {
    PENDING: { label: 'Pending', icon: Clock, color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
    PROCESSING: { label: 'Processing', icon: Edit3, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
    SHIPPED: { label: 'Shipped', icon: Truck, color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
    COMPLETED: { label: 'Completed', icon: CircleCheck, color: 'text-green-400 bg-green-400/10 border-green-400/20' },
    CANCELLED: { label: 'Cancelled', icon: Ban, color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

export default function OrderStatusManager({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleStatusUpdate = async (newStatus: string) => {
        if (newStatus === status) return;

        setIsUpdating(true);
        setMessage('');

        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();
            if (data.success) {
                setStatus(newStatus);
                setMessage('Status updated!');
                setTimeout(() => setMessage(''), 3000);
                router.refresh();
            } else {
                setMessage(data.error || 'Failed to update');
            }
        } catch {
            setMessage('Network error');
        } finally {
            setIsUpdating(false);
        }
    };

    const Meta = statusMeta[status] || statusMeta['PENDING'];
    const Icon = Meta.icon;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${Meta.color}`}>
                    <Icon size={14} />
                    {status}
                </div>

                {isUpdating && <Loader2 size={16} className="animate-spin text-gray-400" />}
                {message && <span className={`text-[10px] font-bold ${message.includes('fail') ? 'text-red-400' : 'text-green-500'}`}>{message}</span>}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
                {OrderStatuses.map((s) => (
                    <button
                        key={s}
                        onClick={() => handleStatusUpdate(s)}
                        disabled={isUpdating || status === s}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all border ${status === s
                                ? 'bg-white/10 text-white border-white/20 opacity-50 cursor-default'
                                : 'bg-white/[0.03] text-gray-500 border-white/[0.05] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:border-[#C9A84C]/30'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}
