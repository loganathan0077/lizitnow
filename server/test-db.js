const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Executing prisma findMany categories...");
    const categories = await prisma.category.findMany({
        include: {
            subcategories: true,
            _count: {
                select: { ads: true }
            }
        }
    });
    console.log("Categories found:", categories.length);

    console.log("Fetching subcategories with counts...");
    const subcategoriesWithCount = await prisma.subcategory.findMany({
        include: {
            _count: {
                select: { ads: true }
            }
        }
    });
    console.log("Subcategories found:", subcategoriesWithCount.length);

    const categoryData = categories.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => {
            const matchedSub = subcategoriesWithCount.find(s => s.id === sub.id);
            return {
                ...sub,
                _count: matchedSub ? matchedSub._count : { ads: 0 }
            };
        })
    }));

    console.log("Category data mapped.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('Disconnected');
    });
