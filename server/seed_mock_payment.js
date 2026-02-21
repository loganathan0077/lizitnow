const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    if (!user) {
        console.log("No users in db.");
        return;
    }

    console.log(`Creating mock payment for: ${user.email}`);

    const totalAmount = 100;
    const baseAmount = totalAmount / 1.18;
    const gstAmount = totalAmount - baseAmount;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    const count = await prisma.payment.count({ where: { status: 'success' } });
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const payment = await prisma.payment.create({
        data: {
            userId: user.id,
            amount: totalAmount,
            status: 'success',
            razorpayOrderId: 'order_' + Math.random().toString(36).substring(7),
            razorpayPaymentId: 'pay_' + Math.random().toString(36).substring(7),
            invoiceNumber: invoiceNumber,
            planName: 'Premium Membership',
            gstAmount: gstAmount,
            cgst: cgst,
            sgst: sgst,
            igst: 0,
            gstinUsed: user.gstin || null,
            paymentDate: new Date(),
            expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 6))
        }
    });

    console.log("Successfully created mock payment: " + payment.invoiceNumber);
}

main().catch(console.error).finally(() => prisma.$disconnect());
