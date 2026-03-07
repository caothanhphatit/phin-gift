import { Search, Eye, User, Phone, Mail, Package } from 'lucide-react';
import { getBaseUrl } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getCustomers() {
    try {
        const baseUrl = await getBaseUrl();
        const res = await fetch(`${baseUrl}/api/admin/customers`, { cache: 'no-store' });
        const json = await res.json();
        return json.data || [];
    } catch {
        return [];
    }
}

function formatVND(n: number | undefined | null) { return `₫${(n ?? 0).toLocaleString('vi-VN')}`; }
function formatDate(d: string) { return new Date(d).toLocaleDateString('vi-VN'); }

export default async function CustomersPage() {
    const customers = await getCustomers();

    return (
        <div className="space-y-6 text-white">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Customers</h1>
                    <p className="text-gray-400 text-sm mt-1">Total: {customers.length} registered customers</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg w-full md:max-w-sm">
                    <Search size={15} className="text-gray-500" />
                    <input type="text" placeholder="Search by phone, name or email..." className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1" />
                </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                {customers.length === 0 ? (
                    <div className="px-6 py-16 text-center text-gray-500 text-sm">No customers found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                    {['Phone # (Key)', 'Name', 'Email', 'Orders', 'Spent', 'Joined', 'Actions'].map((h) => (
                                        <th key={h} className="text-left text-xs text-gray-500 font-medium px-6 py-4 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((c: any) => (
                                    <tr key={c._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
                                                    <Phone size={14} className="text-[#C9A84C]" />
                                                </div>
                                                <span className="text-sm font-mono text-[#C9A84C] font-semibold tracking-tighter">{c.phoneNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-xs font-semibold text-gray-400 group-hover:bg-[#C9A84C]/20 group-hover:text-[#C9A84C] transition-colors uppercase">
                                                    {(c.fullName || 'U').charAt(0)}
                                                </div>
                                                <span className="text-sm text-white font-medium">{c.fullName || 'Unnamed'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{c.email || '—'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <Package size={14} className="text-gray-500" />
                                                <span className="text-sm text-white font-medium">{c.orderCount}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[#C9A84C] font-bold">{formatVND(c.totalSpent)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{formatDate(c.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/customers/${c._id}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] border border-white/[0.1] rounded text-xs text-gray-300 hover:text-white hover:bg-white/[0.1] transition-all">
                                                <Eye size={12} /> View Details
                                            </Link>
                                        </td>
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
