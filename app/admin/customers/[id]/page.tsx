import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Package, TrendingUp, ShoppingBag, Eye, ExternalLink } from 'lucide-react';
import { getBaseUrl } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getCustomerDetail(id: string) {
    try {
        const baseUrl = await getBaseUrl();
        const res = await fetch(`${baseUrl}/api/admin/customers/${id}`, { cache: 'no-store' });
        const json = await res.json();
        if (!json.success) return null;
        return json.data;
    } catch {
        return null;
    }
}

function formatVND(n: number | undefined | null) { return `₫${(n ?? 0).toLocaleString('vi-VN')}`; }
function formatDate(d: string) { return new Date(d).toLocaleDateString('vi-VN'); }

const statusStyles: Record<string, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    PAID: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    SHIPPED: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    COMPLETED: 'bg-green-500/10 text-green-400 border border-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const customer = await getCustomerDetail(id);

    if (!customer) {
        notFound();
    }

    const totalSpent = customer.history.reduce((acc: number, o: any) => acc + (o.pricing?.total || 0), 0);
    const avgOrderValue = customer.history.length > 0 ? totalSpent / customer.history.length : 0;

    return (
        <div className="space-y-8 text-white max-w-6xl mx-auto py-6">
            <div className="flex items-center justify-between">
                <Link href="/admin/customers" className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#C9A84C] transition-colors">
                    <ArrowLeft size={16} /> Back to Customers
                </Link>
                <div className="flex items-center gap-3">
                    <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full font-medium">Verified Customer</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-3xl -mr-16 -mt-16" />

                        <div className="relative flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C9A84C]/30 to-[#8B6914]/20 flex items-center justify-center text-2xl font-bold text-[#C9A84C] border border-[#C9A84C]/20 uppercase">
                                {(customer.fullName || 'U').charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white mb-1">{customer.fullName || 'Unnamed Customer'}</h1>
                                <p className="text-gray-400 text-sm font-mono text-[#C9A84C]">{customer.phoneNumber}</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4 pt-6 border-t border-white/[0.06]">
                            <div className="flex items-start gap-3">
                                <Mail size={16} className="text-gray-500 mt-1 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                                    <p className="text-sm text-gray-200 break-all">{customer.email || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone size={16} className="text-gray-500 mt-1 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium">Contact Number</p>
                                    <p className="text-sm text-gray-200">{customer.phoneNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="text-gray-500 mt-1 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium">Default Address</p>
                                    <p className="text-sm text-gray-200 leading-relaxed italic">{customer.address || '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar size={16} className="text-gray-500 mt-1 shrink-0" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium">Member Since</p>
                                    <p className="text-sm text-gray-200">{formatDate(customer.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats inside sidebar */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={16} className="text-[#C9A84C]" /> Customer Value
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-3xl font-bold text-[#C9A84C] tracking-tight">{formatVND(totalSpent)}</p>
                                <p className="text-xs text-gray-500 mt-1 uppercase font-medium tracking-wider">Life-time Value</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
                                <div>
                                    <p className="text-lg font-semibold text-white">{customer.history.length}</p>
                                    <p className="text-[10px] text-gray-500 uppercase">Orders</p>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-white">{formatVND(avgOrderValue)}</p>
                                    <p className="text-[10px] text-gray-500 uppercase">AVG Order</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header bar / Search something? */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <ShoppingBag size={18} className="text-[#C9A84C]" /> Order History
                        </h2>

                        {customer.history.length === 0 ? (
                            <div className="text-center py-12 bg-white/[0.02] border border-dashed border-white/[0.1] rounded-xl">
                                <Package size={32} className="text-gray-700 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">This customer hasn't placed any orders yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {customer.history.map((order: any) => (
                                    <div key={order._id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:bg-white/[0.05] hover:border-[#C9A84C]/20 transition-all gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center text-gray-400 group-hover:text-[#C9A84C] transition-colors">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-mono text-[#C9A84C] font-semibold">#{order.orderNumber}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase ${statusStyles[order.status] || 'bg-gray-500/10 text-gray-400'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)} • {order.items?.length || 0} items</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 border-white/[0.04] pt-4 md:pt-0">
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-white mb-0.5">{formatVND(order.pricing?.total)}</p>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{order.payment?.method || 'N/A'}</p>
                                            </div>
                                            <Link href={`/admin/orders/${order._id}`} className="p-2 text-gray-500 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors" title="View Order">
                                                <Eye size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes or other meta info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                            <h3 className="text-sm font-semibold text-white mb-3">Customer Segments</h3>
                            <div className="flex flex-wrap gap-2">
                                {customer.history.length > 5 && <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase">Loyal Customer</span>}
                                {totalSpent > 10000000 && <span className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 px-2 py-1 rounded text-[10px] font-bold uppercase">High Value</span>}
                                <span className="bg-white/[0.05] text-gray-400 border border-white/[0.1] px-2 py-1 rounded text-[10px] font-bold uppercase">Direct Sale</span>
                            </div>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between">
                            <h3 className="text-sm font-semibold text-white mb-3">System Actions</h3>
                            <div className="flex items-center gap-3">
                                <button className="text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded hover:bg-red-500/20 transition-colors">Restrict Customer</button>
                                <button className="text-xs bg-white/[0.05] text-gray-300 border border-white/[0.1] px-3 py-1.5 rounded hover:bg-white/[0.1] transition-colors">Export Data</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
