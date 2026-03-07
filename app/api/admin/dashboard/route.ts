import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import B2BOrder from '@/models/B2BOrder';

export async function GET() {
    try {
        await dbConnect();

        const revenueAgg = await Order.aggregate([
            { $match: { status: 'COMPLETED' } },
            { $group: { _id: null, total: { $sum: '$pricing.total' } } },
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        const [totalOrders, totalProducts, recentOrders] = await Promise.all([
            Order.countDocuments(),
            Product.countDocuments({ status: 'published' }),
            Order.find({}).sort({ createdAt: -1 }).limit(5).lean(),
        ]);

        return NextResponse.json({
            success: true,
            data: { totalRevenue, totalOrders, totalProducts, recentOrders },
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}
