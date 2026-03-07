import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer, items, total, paymentMethod = 'COD' } = body;

        await dbConnect();

        // 1. Upsert customer info
        let customerDoc = null;
        if (customer.phone) {
            customerDoc = await Customer.findOneAndUpdate(
                { phoneNumber: customer.phone },
                {
                    $set: {
                        fullName: customer.fullName,
                        email: customer.email,
                        address: customer.address,
                    },
                    $inc: {
                        orderCount: 1,
                        totalSpent: total
                    }
                },
                { upsert: true, new: true }
            );
        }

        if (!customerDoc) {
            return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 400 });
        }

        // 2. Build order items & decrement variant stock
        const orderItems = [];
        for (const item of items) {
            orderItems.push({
                productId: item.productId,
                variantId: item.variantId || null,
                productNameSnapshot: item.productName,
                variantNameSnapshot: item.variantName || null,
                unitPrice: item.price,
                quantity: item.quantity,
                totalPrice: item.price * item.quantity,
            });

            // Decrement stock
            if (item.variantId && item.productId) {
                await Product.findOneAndUpdate(
                    { _id: item.productId, 'variants._id': item.variantId },
                    { $inc: { 'variants.$.stock': -item.quantity } }
                );
            } else if (item.productId) {
                // No variant — decrement basePrice product stock if it exists
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { stock: -item.quantity } }
                );
            }
        }

        // 3. Create order
        const orderNumber = `PG-${Date.now()}`;
        const subtotal = total - 35000; // subtract shipping
        const order = await Order.create({
            orderNumber,
            customerId: customerDoc._id,
            status: 'PENDING',
            pricing: {
                subtotal: subtotal > 0 ? subtotal : total,
                discount: 0,
                total,
                currency: 'VND',
            },
            payment: {
                method: paymentMethod,
                status: 'UNPAID',
            },
            shipping: {
                name: customer.fullName || customer.phone,
                phone: customer.phone,
                address: customer.address,
            },
            items: orderItems,
        });

        console.log(`[Checkout] New order created: ${orderNumber} for customer ${customer.phone}`);

        return NextResponse.json(
            {
                success: true,
                message: 'Order placed successfully',
                orderId: orderNumber,
                orderDbId: order._id,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
