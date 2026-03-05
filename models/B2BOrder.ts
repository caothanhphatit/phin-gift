import mongoose, { Schema, Document } from 'mongoose';

export interface IB2BOrder extends Document {
    companyName: string;
    contactName: string;
    email: string;
    phone: string;
    material: string;
    size: string;
    color: string;
    quantity: number;
    logoImagePublicId?: string;
    logoImageUrl?: string;
    logoDescription?: string;
    notes?: string;
    status: 'Pending' | 'Contacted' | 'In Progress' | 'Completed' | 'Cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const B2BOrderSchema: Schema = new Schema(
    {
        companyName: { type: String, required: true },
        contactName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        material: { type: String, required: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
        quantity: { type: Number, required: true },
        logoImagePublicId: { type: String },
        logoImageUrl: { type: String },
        logoDescription: { type: String },
        notes: { type: String },
        status: {
            type: String,
            enum: ['Pending', 'Contacted', 'In Progress', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.B2BOrder || mongoose.model<IB2BOrder>('B2BOrder', B2BOrderSchema);
