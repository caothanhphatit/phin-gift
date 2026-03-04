import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer, items, total } = body;

        // Log order to console (replace with email/CRM integration later)
        console.log('=== NEW ORDER ===');
        console.log('Customer:', JSON.stringify(customer, null, 2));
        console.log('Items:', JSON.stringify(items, null, 2));
        console.log('Total:', total);
        console.log('=================');

        // TODO: Integrate with email service (Nodemailer, Resend, etc.)
        // or send to CRM/backend API
        // Example: await sendOrderEmail(customer, items, total);

        return NextResponse.json(
            {
                success: true,
                message: 'Order received successfully',
                orderId: `PG-${Date.now()}`,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
