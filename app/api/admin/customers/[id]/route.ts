import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Order from '@/models/Order';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;

        const customer = await Customer.findById(id).lean();
        if (!customer) {
            return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
        }

        const orders = await Order.find({ customerId: id }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, data: { ...customer, history: orders } });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
