import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';

export async function GET() {
    try {
        await dbConnect();

        const customers = await Customer.find({})
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, data: customers });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
