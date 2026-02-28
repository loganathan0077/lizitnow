const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
    console.log('--- Database Diagnostic ---');
    try {
        // 1. Check connection
        await prisma.$connect();
        console.log('✅ Database connection: SUCCESS');

        // 2. Check User table
        const userCount = await prisma.user.count();
        console.log(`✅ User table accessible: ${userCount} users found`);

        // 3. Check Category table
        const catCount = await prisma.category.count();
        console.log(`✅ Category table accessible: ${catCount} categories found`);

        // 4. Check Ad schema by trying to find a record and inspect its structure
        // We'll use $queryRaw to check columns in the 'Ad' table specifically
        const adColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Ad'
    `;

        console.log('--- Ad Table Columns ---');
        const cols = adColumns.map(c => c.column_name);
        console.log(cols.join(', '));

        const requiredNewCols = ['videoUrl', 'mapUrl', 'isB2B', 'b2bMoq', 'b2bPricePerUnit', 'b2bStock', 'b2bBusinessName', 'b2bGstNumber', 'b2bDelivery'];
        const missing = requiredNewCols.filter(c => !cols.includes(c));

        if (missing.length === 0) {
            console.log('✅ All new B2B and media columns are present in the database.');
        } else {
            console.log('❌ MISSING columns:', missing.join(', '));
            console.log('Suggestion: Run "npx prisma migrate dev" or "npx prisma db push"');
        }

    } catch (error) {
        console.error('❌ Database check FAILED:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
