import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const product = await Product.findById(id).populate('categories', 'name slug').lean();
        if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!product) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: product });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        await Product.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
    }
}
