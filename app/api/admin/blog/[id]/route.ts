import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const post = await BlogPost.findById(id).lean();
        if (!post) return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch post' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        const post = await BlogPost.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!post) return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: post });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const post = await BlogPost.findByIdAndDelete(id);
        if (!post) return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
