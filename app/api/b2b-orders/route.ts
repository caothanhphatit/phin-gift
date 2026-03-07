import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import B2BOrder from '@/models/B2BOrder';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const contentType = request.headers.get('content-type') || '';

        // Handle multipart form with logo file
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();

            const fields: Record<string, string> = {};
            let logoImageUrl: string | undefined;
            let logoImagePublicId: string | undefined;

            for (const [key, value] of formData.entries()) {
                if (key === 'logoFile' && value instanceof Blob && value.size > 0) {
                    // Upload to Cloudinary
                    const arrayBuffer = await value.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const base64 = buffer.toString('base64');
                    const mimeType = value.type || 'image/png';
                    const dataUri = `data:${mimeType};base64,${base64}`;

                    const result = await cloudinary.uploader.upload(dataUri, {
                        folder: 'phingift/b2b-logos',
                        resource_type: 'auto',
                    });
                    logoImageUrl = result.secure_url;
                    logoImagePublicId = result.public_id;
                } else if (typeof value === 'string') {
                    fields[key] = value;
                }
            }

            const order = await B2BOrder.create({
                companyName: fields.companyName,
                contactName: fields.contactPerson,
                email: fields.email,
                phone: fields.phone,
                material: fields.material,
                size: fields.size,
                color: fields.color,
                quantity: Number(fields.quantity),
                logoDescription: fields.logoDescription,
                notes: fields.notes,
                logoImageUrl,
                logoImagePublicId,
            });

            return NextResponse.json({ success: true, data: order }, { status: 201 });
        }

        // Handle JSON body (no file)
        const body = await request.json();
        const order = await B2BOrder.create({
            ...body,
            contactName: body.contactPerson || body.contactName,
        });
        return NextResponse.json({ success: true, data: order }, { status: 201 });
    } catch (error: any) {
        console.error('B2B order submit error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
