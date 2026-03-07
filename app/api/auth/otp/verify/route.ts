import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OTP from '@/models/OTP';
import Customer from '@/models/Customer';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { phoneNumber, otpCode } = await request.json();

        if (!phoneNumber || !otpCode) {
            return NextResponse.json({ success: false, error: 'Missing phoneNumber or otpCode' }, { status: 400 });
        }

        // 1. Find the latest PENDING OTP for this phone
        const otpRecord = await OTP.findOne({
            phoneNumber,
            purpose: 'CHECKOUT',
            status: 'PENDING'
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return NextResponse.json({ success: false, error: 'No pending OTP found. Please request a new one.' }, { status: 404 });
        }

        // 2. Check Expiration
        if (new Date() > otpRecord.expiresAt) {
            otpRecord.status = 'EXPIRED';
            await otpRecord.save();
            return NextResponse.json({ success: false, error: 'OTP has expired. Please request a new one.' }, { status: 400 });
        }

        // 3. Check Attempts
        if (otpRecord.attemptCount >= 5) {
            otpRecord.status = 'FAILED';
            await otpRecord.save();
            return NextResponse.json({ success: false, error: 'Maximum attempts exceeded. Please request a new OTP.' }, { status: 429 });
        }

        // 4. Validate OTP Code
        if (otpRecord.otpCode !== otpCode) {
            otpRecord.attemptCount += 1;
            if (otpRecord.attemptCount >= 5) {
                otpRecord.status = 'FAILED';
            }
            await otpRecord.save();
            return NextResponse.json({ success: false, error: 'Invalid OTP code.' }, { status: 400 });
        }

        // 5. Verification Successful -> Mark OTP as VERIFIED (single-use constraint)
        otpRecord.status = 'VERIFIED';
        otpRecord.verifiedAt = new Date();
        await otpRecord.save();

        // 6. Handle Customer Record
        let customer = await Customer.findOne({ phoneNumber });
        if (!customer) {
            customer = await Customer.create({
                phoneNumber,
                isVerified: true,
                lastLoginAt: new Date(),
            });
        } else {
            customer.isVerified = true;
            customer.lastLoginAt = new Date();
            await customer.save();
        }

        // Return success with customer ID and saved information
        return NextResponse.json({
            success: true,
            message: 'OTP verified successfully',
            customerId: customer._id,
            customerData: {
                fullName: customer.fullName || '',
                email: customer.email || '',
                address: customer.address || '',
                phone: customer.phoneNumber || ''
            }
        });

    } catch (error: any) {
        console.error("OTP Verify Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
