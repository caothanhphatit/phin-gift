import mongoose, { Schema, Document } from 'mongoose';

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    variantId?: mongoose.Types.ObjectId | null;
    productNameSnapshot: string;
    variantNameSnapshot?: string | null;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}

export interface IOrder extends Document {
    orderNumber: string;
    customerId: mongoose.Types.ObjectId;
    status: OrderStatus;
    pricing: {
        subtotal: number;
        discount: number;
        total: number;
        currency: string;
    };
    payment: {
        method: string;
        status: PaymentStatus;
        paidAt?: Date | null;
    };
    shipping: {
        name: string;
        phone: string;
        address: string;
    };
    items: IOrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: Schema.Types.ObjectId, default: null },
    productNameSnapshot: { type: String, required: true },
    variantNameSnapshot: { type: String, default: null },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema(
    {
        orderNumber: { type: String, required: true, unique: true },
        customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
        pricing: {
            subtotal: { type: Number, required: true },
            discount: { type: Number, default: 0 },
            total: { type: Number, required: true },
            currency: { type: String, default: 'VND' },
        },
        payment: {
            method: { type: String, required: true, default: 'COD' },
            status: {
                type: String,
                enum: Object.values(PaymentStatus),
                default: PaymentStatus.UNPAID,
            },
            paidAt: { type: Date, default: null },
        },
        shipping: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
        },
        items: [OrderItemSchema],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
