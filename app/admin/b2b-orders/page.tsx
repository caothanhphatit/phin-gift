import { PhoneCall, Eye } from 'lucide-react';

async function getB2BOrders() {
    try {
        const res = await fetch('/api/admin/b2b-orders', { cache: 'no-store' });
        const json = await res.json();
        return json.data || [];
    } catch {
        return [];
    }
}

const statusStyles: Record<string, string> = {
    Pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    Contacted: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    'In Progress': 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    Completed: 'bg-green-500/10 text-green-400 border border-green-500/20',
    Cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

export default async function B2BOrdersPage() {
    const b2bOrders = await getB2BOrders();

    const pending = b2bOrders.filter((o: any) => o.status === 'Pending').length;
    const inProgress = b2bOrders.filter((o: any) => o.status === 'In Progress').length;
    const completed = b2bOrders.filter((o: any) => o.status === 'Completed').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">B2B Custom Orders</h1>
                    <p className="text-gray-400 text-sm mt-1">Logo engraving and bulk custom gift requests</p>
                </div>
                {pending > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                        {pending} Pending
                    </div>
                )}
            </div>

            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total Requests', value: b2bOrders.length, color: 'text-white' },
                    { label: 'Pending', value: pending, color: 'text-yellow-400' },
                    { label: 'In Progress', value: inProgress, color: 'text-purple-400' },
                    { label: 'Completed', value: completed, color: 'text-green-400' },
                ].map((s) => (
                    <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                        <p className="text-xs text-gray-500">{s.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                {b2bOrders.length === 0 ? (
                    <div className="px-6 py-16 text-center text-gray-500 text-sm">No B2B orders yet.</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {['Company', 'Contact', 'Material', 'Qty', 'Status', 'Date', 'Actions'].map((h) => (
                                    <th key={h} className="text-left text-xs text-gray-500 font-medium px-6 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {b2bOrders.map((o: any) => (
                                <tr key={o._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-white font-medium">{o.companyName}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-300">{o.contactName}</p>
                                        <p className="text-xs text-gray-500">{o.email}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{o.material}</td>
                                    <td className="px-6 py-4 text-sm text-white font-medium">{(o.quantity || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[o.status]}`}>{o.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"><Eye size={14} /></button>
                                            <a href={`tel:${o.phone}`} className="p-1.5 text-gray-500 hover:text-green-400 hover:bg-green-500/[0.06] rounded-md transition-colors"><PhoneCall size={14} /></a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
