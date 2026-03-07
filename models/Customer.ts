import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    phoneNumber: string;
    fullName?: string;
    email?: string;
    address?: string;
    isVerified: boolean;
    orderCount: number;
    totalSpent: number;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
    {
        phoneNumber: { type: String, required: true, unique: true, index: true },
        fullName: { type: String },
        email: { type: String },
        address: { type: String },
        isVerified: { type: Boolean, default: false },
        orderCount: { type: Number, default: 0 },
        totalSpent: { type: Number, default: 0 },
        lastLoginAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
