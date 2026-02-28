const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    console.log('--- Database Data Search ---');
    try {
        await prisma.$connect();

        // Check Subcategories
        const subcategories = await prisma.subcategory.findMany();
        console.log(`Checking ${subcategories.length} subcategories...`);

        let found = false;
        subcategories.forEach(sub => {
            if (sub.formFields && sub.formFields.toLowerCase().includes('simulated')) {
                console.log(`[FOUND] Subcategory "${sub.name}" (ID: ${sub.id}) contains "simulated" in formFields!`);
                console.log(`Content: ${sub.formFields}`);
                found = true;
            }
        });

        // Check Categories
        const categories = await prisma.category.findMany();
        console.log(`Checking ${categories.length} categories...`);
        categories.forEach(cat => {
            if (cat.name.toLowerCase().includes('simulated')) {
                console.log(`[FOUND] Category "${cat.name}" (ID: ${cat.id}) contains "simulated" in name!`);
                found = true;
            }
        });

        if (!found) {
            console.log('✅ No "simulated" string found in Category or Subcategory data.');
        }

    } catch (error) {
        console.error('❌ Data search FAILED:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
