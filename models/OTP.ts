import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
    phoneNumber: string;
    otpCode: string;
    channel: 'SMS' | 'ZALO';
    purpose: 'CHECKOUT';
    status: 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'FAILED';
    attemptCount: number;
    expiresAt: Date;
    verifiedAt?: Date;
    createdAt: Date;
}

const OTPSchema: Schema = new Schema(
    {
        phoneNumber: { type: String, required: true, index: true },
        otpCode: { type: String, required: true },
        channel: { type: String, enum: ['SMS', 'ZALO'], required: true },
        purpose: { type: String, enum: ['CHECKOUT'], required: true, default: 'CHECKOUT' },
        status: {
            type: String,
            enum: ['PENDING', 'VERIFIED', 'EXPIRED', 'FAILED'],
            default: 'PENDING',
        },
        attemptCount: { type: Number, default: 0 },
        expiresAt: { type: Date, required: true, index: { expires: '30d' } }, // Keep logs for 30 days
        verifiedAt: { type: Date },
    },
    {
        timestamps: { createdAt: true, updatedAt: false }, // Only createdAt is needed
    }
);

export default mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);
