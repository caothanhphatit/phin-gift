import { Search, Eye } from 'lucide-react';

const customers = [
    { id: 1, name: 'Nguyễn Văn Anh', email: 'nguyenvananh@gmail.com', phone: '0901234567', orders: 5, spent: '₫3,450,000', joined: '2025-11-12', status: 'Active' },
    { id: 2, name: 'Trần Thị Bích', email: 'tranbich@gmail.com', phone: '0912345678', orders: 2, spent: '₫1,250,000', joined: '2025-12-01', status: 'Active' },
    { id: 3, name: 'Lê Hoàng Nam', email: 'nam.le@gmail.com', phone: '0923456789', orders: 1, spent: '₫450,000', joined: '2026-01-15', status: 'Active' },
    { id: 4, name: 'Phạm Thị Lan', email: 'phamlan@gmail.com', phone: '0934567890', orders: 8, spent: '₫7,800,000', joined: '2025-08-30', status: 'Active' },
    { id: 5, name: 'Đỗ Minh Tuấn', email: 'tuan.do@gmail.com', phone: '0945678901', orders: 3, spent: '₫2,100,000', joined: '2025-10-22', status: 'Active' },
];

export default function CustomersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-white">Customers</h1>
                <p className="text-gray-400 text-sm mt-1">View and manage registered customers</p>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg max-w-sm">
                <Search size={15} className="text-gray-500" />
                <input type="text" placeholder="Search customers..." className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1" />
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            {['Customer', 'Phone', 'Orders', 'Total Spent', 'Joined', 'Status', 'Actions'].map((h) => (
                                <th key={h} className="text-left text-xs text-gray-500 font-medium px-6 py-3">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((c) => (
                            <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C]/30 to-[#8B6914]/20 flex items-center justify-center text-xs font-semibold text-[#C9A84C]">
                                            {c.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm text-white font-medium">{c.name}</p>
                                            <p className="text-xs text-gray-500">{c.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-300">{c.phone}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{c.orders}</td>
                                <td className="px-6 py-4 text-sm text-white font-medium">{c.spent}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">{c.joined}</td>
                                <td className="px-6 py-4">
                                    <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{c.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="p-1.5 text-gray-500 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"><Eye size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
