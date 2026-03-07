import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OTP from '@/models/OTP';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { phoneNumber, channel } = await request.json();

        if (!phoneNumber || !channel) {
            return NextResponse.json({ success: false, error: 'Missing phoneNumber or channel' }, { status: 400 });
        }

        // 1. Mark existing PENDING OTPs for this phone as EXPIRED to prevent multiple valid OTPs
        await OTP.updateMany(
            { phoneNumber, status: 'PENDING', purpose: 'CHECKOUT' },
            { $set: { status: 'EXPIRED' } }
        );

        // 2. Generate static Dev-Mode OTP
        const otpCode = "666666"; // STATIC FOR DEV
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // 3. Save to Database
        const newOTP = await OTP.create({
            phoneNumber,
            otpCode,
            channel,
            purpose: 'CHECKOUT',
            status: 'PENDING',
            attemptCount: 0,
            expiresAt,
        });

        // Normally here we would send an SMS via external provider. For dev mode we skip it.

        return NextResponse.json({
            success: true,
            expiresAt,
            message: 'OTP generated successfully'
        });

    } catch (error: any) {
        console.error("OTP Generate Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
