const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runAutoRenewal() {
    console.log(`[${new Date().toISOString()}] Starting Auto-Renewal Job...`);
    try {
        const now = new Date();

        // Find all ads that have expired or are expiring very soon (e.g. today)
        const expiringAds = await prisma.ad.findMany({
            where: {
                status: 'active',
                expiresAt: { lte: now } // Expired ads
            }
        });

        console.log(`Found ${expiringAds.length} ads to process for renewal.`);

        for (const ad of expiringAds) {
            console.log(`Processing Ad ${ad.id} (User: ${ad.userId}, Plan: ${ad.adPlanType}, Price: ₹${ad.pricePaid})`);

            const user = await prisma.user.findUnique({ where: { id: ad.userId } });
            if (!user) {
                console.log(`User ${ad.userId} not found for ad ${ad.id}. Skipping...`);
                continue;
            }

            // Note: If ad was on a launch offer, it renews at standard price. 
            // Fetch category pricing to know the current standard price.
            const catPricing = await prisma.categoryPricing.findUnique({
                where: { categoryId: ad.categoryId }
            });

            // Fallback to previous price if no pricing found (rare)
            let renewalFee = catPricing ? catPricing.price : 10;
            let validityDays = catPricing ? catPricing.validityDays : 30;

            if (user.walletBalance >= renewalFee) {
                // Renew the ad
                await prisma.$transaction(async (tx) => {
                    // Deduct wallet
                    if (renewalFee > 0) {
                        await tx.user.update({
                            where: { id: ad.userId },
                            data: { walletBalance: { decrement: renewalFee } }
                        });

                        // Log Transaction
                        await tx.walletTransaction.create({
                            data: {
                                userId: ad.userId,
                                amount: renewalFee,
                                type: 'renewal',
                                description: `Auto-renewal fee for "${ad.title}"`,
                                adId: ad.id
                            }
                        });
                    }

                    // Update Ad expiry and change plan out of launch offer
                    const newExpiry = new Date(now);
                    newExpiry.setDate(newExpiry.getDate() + validityDays);

                    await tx.ad.update({
                        where: { id: ad.id },
                        data: {
                            expiresAt: newExpiry,
                            pricePaid: renewalFee,
                            adPlanType: 'standard', // Force standard plan on renewal
                            validityDays: validityDays
                        }
                    });
                });
                console.log(`✅ Ad ${ad.id} successfully renewed for ₹${renewalFee}. New Expiry: ${newExpiry}`);
            } else {
                // Expire the ad
                await prisma.ad.update({
                    where: { id: ad.id },
                    data: { status: 'expired' }
                });
                console.log(`❌ Ad ${ad.id} expired due to insufficient balance (Needs ₹${renewalFee}, Has ₹${user.walletBalance}).`);
            }
        }
    } catch (error) {
        console.error("Auto-Renewal Job Failed:", error);
    } finally {
        await prisma.$disconnect();
        console.log(`[${new Date().toISOString()}] Auto-Renewal Job Finished.`);
    }
}

// Execute logic directly. In a real environment, this script would be called by crontab or a scheduler package.
runAutoRenewal();
