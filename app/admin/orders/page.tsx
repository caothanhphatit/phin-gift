import { Search } from 'lucide-react';
import { getBaseUrl } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const statusStyles: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    PROCESSING: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    SHIPPED: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    COMPLETED: 'bg-green-500/10 text-green-400 border border-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const statusTabs = ['All', 'PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'];

async function getOrders(status?: string) {
    try {
        const baseUrl = await getBaseUrl();
        const url = new URL(`${baseUrl}/api/admin/orders`);
        url.searchParams.set('limit', '50');
        if (status && status !== 'All') {
            url.searchParams.set('status', status);
        }

        const res = await fetch(url.toString(), { cache: 'no-store' });
        const json = await res.json();
        return json.data || [];
    } catch {
        return [];
    }
}

function formatVND(n: number | undefined | null) { return `₫${(n ?? 0).toLocaleString('vi-VN')}`; }
function formatDate(d: string) { return new Date(d).toLocaleDateString('vi-VN'); }

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
    const { status } = await searchParams;
    const currentStatus = status || 'All';
    const orders = await getOrders(currentStatus);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Orders</h1>
                    <p className="text-gray-400 text-sm mt-1">{orders.length} orders total</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg max-w-sm">
                    <Search size={15} className="text-gray-500" />
                    <input type="text" placeholder="Search by order #..." className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1" />
                </div>
            </div>

            <div className="flex gap-2 flex-wrap">
                {statusTabs.map((tab) => (
                    <Link
                        key={tab}
                        href={`/admin/orders${tab === 'All' ? '' : `?status=${tab}`}`}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${currentStatus === tab
                                ? 'bg-[#C9A84C] text-white border-[#C9A84C]'
                                : 'bg-white/[0.03] text-gray-400 border-white/[0.06] hover:bg-white/[0.08] hover:text-white'
                            }`}
                    >
                        {tab}
                    </Link>
                ))}
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                {orders.length === 0 ? (
                    <div className="px-6 py-16 text-center text-gray-500 text-sm italic">No orders found for this status</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                    {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date'].map((h) => (
                                        <th key={h} className="text-left text-[10px] text-gray-500 font-bold px-6 py-4 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o: any) => (
                                    <tr key={o._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/orders/${o._id}`} className="text-sm font-mono text-[#C9A84C] hover:underline font-bold tracking-tighter">
                                                #{o.orderNumber}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-white font-medium">{o.shipping?.name}</p>
                                            <p className="text-[10px] text-gray-500">{o.shipping?.phone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {o.items?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white font-bold">{formatVND(o.pricing?.total)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-300 font-medium uppercase tracking-tighter">{o.payment?.method}</span>
                                                <span className={`text-[10px] font-bold ${o.payment?.status === 'PAID' ? 'text-green-500' : 'text-yellow-500/70'}`}>{o.payment?.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border ${statusStyles[o.status] || 'bg-gray-500/10 text-gray-400 border-white/5'}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
