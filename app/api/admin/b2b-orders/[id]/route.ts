import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import B2BOrder from '@/models/B2BOrder';
import cloudinary from '@/lib/cloudinary';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        const order = await B2BOrder.findById(id).lean();
        if (!order) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(order)) });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('multipart/form-data')) {
            // Handle design image upload
            const formData = await request.formData();
            const field = formData.get('field') as string; // 'requestDesign' | 'finalDesign'
            const file = formData.get('file') as Blob | null;

            if (!file || file.size === 0) {
                return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
            }
            if (!['requestDesign', 'finalDesign'].includes(field)) {
                return NextResponse.json({ success: false, error: 'Invalid field' }, { status: 400 });
            }

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString('base64');
            const mimeType = file.type || 'image/png';
            const dataUri = `data:${mimeType};base64,${base64}`;

            const result = await cloudinary.uploader.upload(dataUri, {
                folder: `phingift/b2b-designs/${field}`,
                resource_type: 'auto',
            });

            const update = {
                [`${field}Url`]: result.secure_url,
                [`${field}PublicId`]: result.public_id,
            };

            const updated = await B2BOrder.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
            if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
            return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(updated)) });
        }

        // Plain JSON update (status, notes, etc.)
        const body = await request.json();
        const updated = await B2BOrder.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
        if (!updated) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(updated)) });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();
        await B2BOrder.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
