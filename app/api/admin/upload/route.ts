import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as Blob | null;

        if (!file || file.size === 0) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const mimeType = file.type || 'image/png';
        const dataUri = `data:${mimeType};base64,${base64}`;

        // Upload to Cloudinary with WebP conversion and 1:1 auto-crop
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: `phingift/products`,
            format: 'webp',
            transformation: [
                { aspect_ratio: "1:1", crop: "fill" },
                { quality: "auto" },
                { fetch_format: "auto" }
            ],
            resource_type: 'image',
        });

        return NextResponse.json({
            success: true,
            data: {
                url: result.secure_url,
                publicId: result.public_id,
            }
        });

    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
