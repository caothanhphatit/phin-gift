import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const category = await Category.findByIdAndUpdate(id, body, { new: true });
        if (!category) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: category });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
