import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    variantId?: string;
    name: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    orderNumber: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        country: string;
    };
    items: IOrderItem[];
    subtotal: number;
    shippingFee: number;
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
    paymentMethod: string;
    paymentStatus: 'Pending' | 'Paid' | 'Failed';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema(
    {
        orderNumber: { type: String, required: true, unique: true },
        customer: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            country: { type: String, default: 'Vietnam' },
        },
        items: [OrderItemSchema],
        subtotal: { type: Number, required: true },
        shippingFee: { type: Number, required: true, default: 0 },
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
        paymentMethod: { type: String, required: true, default: 'COD' },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid', 'Failed'],
            default: 'Pending',
        },
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
