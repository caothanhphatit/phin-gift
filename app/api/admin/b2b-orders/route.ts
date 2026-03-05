import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import B2BOrder from '@/models/B2BOrder';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const query = status && status !== 'All' ? { status } : {};
        const b2bOrders = await B2BOrder.find(query).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: b2bOrders });
    } catch (error: any) {
        console.error('B2B Orders API error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to fetch B2B orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const order = await B2BOrder.create(body);
        return NextResponse.json({ success: true, data: order }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
