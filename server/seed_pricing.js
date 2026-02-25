const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany();

    for (const cat of categories) {
        let price = 10;
        let validityDays = 30;

        // Exact slug mapping based on user request
        if (['services', 'events', 'event-services'].includes(cat.slug)) {
            price = 199;
            validityDays = 90;
        } else if (['real-estate', 'properties', 'jobs'].includes(cat.slug)) {
            price = 49;
            validityDays = 30;
        } else if (['books', 'education'].includes(cat.slug)) {
            price = 5;
            validityDays = 30;
        } else {
            price = 10;
            validityDays = 30;
        }

        await prisma.categoryPricing.upsert({
            where: { categoryId: cat.id },
            update: { price, validityDays },
            create: { categoryId: cat.id, price, validityDays, pricingType: 'standard' }
        });

        console.log(`Updated pricing for ${cat.name} (${cat.slug}) -> ₹${price} for ${validityDays} days`);
    }

    console.log("Pricing seed completed");
}

main().catch(console.error).finally(() => prisma.$disconnect());
