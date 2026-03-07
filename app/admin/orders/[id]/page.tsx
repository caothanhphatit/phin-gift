import { ArrowLeft, User, Phone, MapPin, Package, Clock, CreditCard, ChevronRight, CheckCircle2, ShoppingBag, Info, ExternalLink, Truck } from 'lucide-react';
import { getBaseUrl } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import OrderStatusManager from '@/components/admin/OrderStatusManager';

export const dynamic = 'force-dynamic';

async function getOrderDetail(id: string) {
    try {
        const baseUrl = await getBaseUrl();
        const res = await fetch(`${baseUrl}/api/admin/orders/${id}`, { cache: 'no-store' });
        const json = await res.json();
        if (!json.success) return null;
        return json.data;
    } catch {
        return null;
    }
}

function formatVND(n: number | undefined | null) { return `₫${(n ?? 0).toLocaleString('vi-VN')}`; }
function formatDate(d: string) { return new Date(d).toLocaleString('vi-VN'); }

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await getOrderDetail(id);

    if (!order) {
        notFound();
    }

    return (
        <div className="space-y-8 text-white max-w-6xl mx-auto py-10">
            {/* ── Top Header Section ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.06] pb-8">
                <div className="space-y-4">
                    <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#C9A84C] transition-colors mb-2 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium tracking-tight">Order Management</span>
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-mono font-bold text-white tracking-[0.2em] uppercase">Order #{order.orderNumber}</h1>
                        <p className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                            <Clock size={14} className="text-amber-500/60" />
                            Placed on {formatDate(order.createdAt)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[300px]">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-[-10px]">Update Order Progress</p>
                    <OrderStatusManager orderId={order._id} currentStatus={order.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* ── Left Side: Items & Logistics (8 cols) ── */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Order Details Table */}
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-[24px] p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#C9A84C]/10 transition-colors" />

                        <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center">
                                <ShoppingBag size={20} className="text-[#C9A84C]" />
                            </div>
                            Line Items Ordered
                        </h2>

                        <div className="space-y-4">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="grid grid-cols-12 gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all">
                                    <div className="col-span-2 md:col-span-1">
                                        <div className="aspect-square rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-gray-600 overflow-hidden">
                                            <Package size={24} />
                                        </div>
                                    </div>
                                    <div className="col-span-10 md:col-span-7 flex flex-col justify-center">
                                        <h3 className="text-sm font-bold text-white group-hover:text-[#C9A84C] transition-colors truncate">{item.productNameSnapshot}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-white/[0.08] px-2 py-0.5 rounded text-gray-400 font-mono uppercase tracking-widest">{item.variantNameSnapshot || 'Classic'}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-4 flex items-center justify-between md:justify-end gap-10">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-0.5 uppercase tracking-wider font-bold">Qty x Price</p>
                                            <p className="text-sm font-medium text-gray-300">{item.quantity} × {formatVND(item.unitPrice)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-0.5 uppercase tracking-wider font-bold">Subtotal</p>
                                            <p className="text-sm font-black text-white">{formatVND(item.totalPrice)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Logistics Card */}
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-[24px] p-8">
                        <h2 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Truck size={20} className="text-blue-400" />
                            </div>
                            Fulfillment Journey
                        </h2>

                        <div className="relative space-y-12">
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-green-500 via-green-500/30 to-white/5" />

                            {/* Step 1 */}
                            <div className="relative flex items-start gap-6 pl-1">
                                <div className="z-10 w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white ring-8 ring-green-500/10 animate-pulse">
                                    <CheckCircle2 size={18} />
                                </div>
                                <div className="flex-1 pt-1">
                                    <p className="text-sm font-black uppercase tracking-wider text-green-400">Received & Confirmed</p>
                                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.createdAt)} • System generated automatically</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex items-start gap-6 pl-1">
                                <div className={`z-10 w-9 h-9 rounded-full flex items-center justify-center ring-8 ${['PROCESSING', 'SHIPPED', 'COMPLETED'].includes(order.status) ? 'bg-green-500 text-white ring-green-500/10' : 'bg-white/[0.05] border border-white/[0.1] text-gray-700 ring-transparent'}`}>
                                    <Package size={18} />
                                </div>
                                <div className="flex-1 pt-1">
                                    <p className={`text-sm font-black uppercase tracking-wider ${['PROCESSING', 'SHIPPED', 'COMPLETED'].includes(order.status) ? 'text-green-400' : 'text-gray-600'}`}>Preparing for Gift</p>
                                    <p className="text-xs text-gray-500 mt-1">Order marked as {order.status}</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex items-start gap-6 pl-1">
                                <div className={`z-10 w-9 h-9 rounded-full flex items-center justify-center ring-8 ${['SHIPPED', 'COMPLETED'].includes(order.status) ? 'bg-green-500 text-white ring-green-500/10' : 'bg-white/[0.05] border border-white/[0.1] text-gray-700 ring-transparent'}`}>
                                    <Truck size={18} />
                                </div>
                                <div className="flex-1 pt-1">
                                    <p className={`text-sm font-black uppercase tracking-wider ${['SHIPPED', 'COMPLETED'].includes(order.status) ? 'text-green-400' : 'text-gray-600'}`}>Out for Delivery</p>
                                    <p className="text-xs text-gray-500 mt-1">Pending carrier pick-up info</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right Side: Shipping & Cost (4 cols) ── */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Customer Info Card */}
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-[24px] p-8 overflow-hidden relative">
                        <div className="absolute top-[-40px] left-[-40px] w-64 h-64 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-8 border-b border-white/[0.05] pb-4">Consignee Information</h2>

                        <div className="space-y-8 relative">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                    <User size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Reciever</p>
                                    <p className="text-sm font-bold text-white truncate">{order.shipping?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                                <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Contact</p>
                                    <p className="text-sm font-mono text-white font-black tracking-tighter">{order.shipping?.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Address</p>
                                    <p className="text-sm text-gray-300 leading-relaxed font-italic italic">{order.shipping?.address}</p>
                                </div>
                            </div>

                            <Link href={`/admin/customers/${order.customerId}`} className="flex items-center justify-between group p-4 border border-dashed border-white/[0.15] rounded-2xl hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-gray-500 group-hover:text-[#C9A84C]">
                                        <User size={14} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-white uppercase tracking-widest">Customer Profile</span>
                                </div>
                                <ChevronRight size={14} className="text-gray-700 group-hover:text-[#C9A84C] group-hover:translate-x-1 transition-all" />
                            </Link>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-[#C9A84C] text-[#3D2F17] rounded-[24px] p-8 shadow-2xl shadow-[#C9A84C]/10">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#3D2F17]/10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] font-bold">Total Bill</h2>
                            <CreditCard size={18} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter opacity-60">
                                <span>Order Value</span>
                                <span>{formatVND(order.pricing?.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter opacity-60">
                                <span>Delivery Fee</span>
                                <span>₫0</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter opacity-60">
                                <span>Voucher Applied</span>
                                <span>-{formatVND(order.pricing?.discount)}</span>
                            </div>

                            <div className="pt-6 mt-6 border-t border-[#3D2F17]/10 flex flex-col gap-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Grand Total</span>
                                    <span className="text-3xl font-black tracking-tighter">{formatVND(order.pricing?.total)}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-[#3D2F17]/5 rounded-xl border border-[#3D2F17]/10">
                                    <div className={`w-2 h-2 rounded-full ${order.payment?.status === 'PAID' ? 'bg-green-700' : 'bg-amber-700 animate-pulse'}`} />
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                                        {order.payment?.method} • {order.payment?.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Panel */}
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-[24px] p-6 space-y-3">
                        <button className="w-full py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/[0.1] transition-all flex items-center justify-center gap-2">
                            Download Invoice <ExternalLink size={14} />
                        </button>
                        <button className="w-full py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/[0.1] transition-all flex items-center justify-center gap-2">
                            Print Label <Info size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
