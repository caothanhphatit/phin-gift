import { TrendingUp, ShoppingBag, Package, ArrowUpRight } from 'lucide-react';

interface DashboardData {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    recentOrders: any[];
}

async function getDashboardData(): Promise<DashboardData> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/dashboard`, {
            cache: 'no-store',
        });
        const json = await res.json();
        return json.data;
    } catch {
        return { totalRevenue: 0, totalOrders: 0, totalProducts: 0, recentOrders: [] };
    }
}

const statusStyles: Record<string, string> = {
    Pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    Processing: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    Shipped: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    Completed: 'bg-green-500/10 text-green-400 border border-green-500/20',
    Cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

function formatVND(amount: number) {
    return `₫${amount.toLocaleString('vi-VN')}`;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('vi-VN');
}

export default async function AdminDashboard() {
    const { totalRevenue, totalOrders, totalProducts, recentOrders } = await getDashboardData();

    const stats = [
        { title: 'Total Revenue', value: formatVND(totalRevenue), icon: TrendingUp, color: 'from-amber-500/20 to-yellow-600/10', iconColor: 'text-amber-400' },
        { title: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, color: 'from-blue-500/20 to-blue-600/10', iconColor: 'text-blue-400' },
        { title: 'Products', value: totalProducts.toString(), icon: Package, color: 'from-green-500/20 to-green-600/10', iconColor: 'text-green-400' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
                <p className="text-gray-400 text-sm mt-1">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.05] transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon size={18} className={stat.iconColor} />
                            </div>
                            <span className="flex items-center gap-1 text-xs font-medium text-green-400">
                                <ArrowUpRight size={12} /> Live
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-gray-500 text-sm mt-1">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white">Recent Orders</h2>
                    <a href="/admin/orders" className="text-xs text-[#C9A84C] hover:underline">View all</a>
                </div>
                {recentOrders.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-500 text-sm">No orders yet</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    {['Order #', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                                        <th key={h} className="text-left text-xs text-gray-500 font-medium px-6 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order: any) => (
                                    <tr key={order._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 text-sm text-[#C9A84C] font-mono">#{order.orderNumber}</td>
                                        <td className="px-6 py-4 text-sm text-white">{order.customer?.name}</td>
                                        <td className="px-6 py-4 text-sm text-white font-medium">{formatVND(order.total)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[order.status]}`}>{order.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{formatDate(order.createdAt)}</td>
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
