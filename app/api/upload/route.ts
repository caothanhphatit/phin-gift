import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);

        // Get the signature using the Node.js SDK method api_sign_request
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                folder: 'phingift', // Optional: organized folder in Cloudinary
            },
            process.env.CLOUDINARY_API_SECRET as string
        );

        return NextResponse.json({
            timestamp,
            signature,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
        });
    } catch (error) {
        console.error('Error generating Cloudinary signature:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
