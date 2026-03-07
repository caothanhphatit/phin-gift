import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Classification from '@/models/Classification';

// GET /api/admin/classifications
export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const activeOnly = searchParams.get('activeOnly') === 'true';

        const query = activeOnly ? { isActive: true } : {};

        const classifications = await Classification.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ success: true, data: classifications });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST /api/admin/classifications
export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();

        const classification = await Classification.create(body);

        return NextResponse.json({ success: true, data: classification }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
