import { Search } from 'lucide-react';

const statusStyles: Record<string, string> = {
    Pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    Processing: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    Shipped: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    Completed: 'bg-green-500/10 text-green-400 border border-green-500/20',
    Cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
};
const paymentStyles: Record<string, string> = { Paid: 'text-green-400', Pending: 'text-yellow-400', Failed: 'text-red-400' };
const statusTabs = ['All', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

async function getOrders() {
    try {
        const res = await fetch('http://localhost:3000/api/admin/orders?limit=20', { cache: 'no-store' });
        const json = await res.json();
        return json.data || [];
    } catch {
        return [];
    }
}

function formatVND(n: number) { return `₫${n.toLocaleString('vi-VN')}`; }
function formatDate(d: string) { return new Date(d).toLocaleDateString('vi-VN'); }

export default async function OrdersPage() {
    const orders = await getOrders();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-white">Orders</h1>
                <p className="text-gray-400 text-sm mt-1">{orders.length} orders total</p>
            </div>
            <div className="flex gap-1 flex-wrap">
                {statusTabs.map((tab) => (
                    <button key={tab} className={`px-4 py-2 rounded-lg text-sm transition-colors ${tab === 'All' ? 'bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}>{tab}</button>
                ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg max-w-sm">
                <Search size={15} className="text-gray-500" />
                <input type="text" placeholder="Search by order # or customer..." className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1" />
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                {orders.length === 0 ? (
                    <div className="px-6 py-16 text-center text-gray-500 text-sm">No orders yet</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {['Order #', 'Customer', 'Total', 'Status', 'Payment', 'Date'].map((h) => (
                                    <th key={h} className="text-left text-xs text-gray-500 font-medium px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o: any) => (
                                <tr key={o._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 text-sm text-[#C9A84C] font-mono">#{o.orderNumber}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-white">{o.customer?.name}</p>
                                        <p className="text-xs text-gray-500">{o.customer?.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white font-medium">{formatVND(o.total)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[o.status]}`}>{o.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <span className={paymentStyles[o.paymentStatus]}>{o.paymentStatus}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{formatDate(o.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
