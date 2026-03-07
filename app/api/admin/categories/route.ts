import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

import Classification from '@/models/Classification';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const includeClassifications = searchParams.get('includeClassifications') === 'true';

        let query = Category.find({}).sort({ createdAt: -1 });

        if (includeClassifications) {
            // Need to ensure the Classification model is registered before populating
            require('@/models/Classification');
            query = query.populate('classificationIds');
        }

        const categories = await query.lean();
        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const category = await Category.create(body);
        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
