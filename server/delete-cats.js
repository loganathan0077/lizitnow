const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const slugsToDelete = [
        'pets-animals', 'sports-fitness', 'books-education', 'services',
        'tools-hardware', 'business-franchise', 'events-tickets', 'agriculture-farming'
    ];

    console.log('Deleting new categories...');
    const categories = await prisma.category.findMany({
        where: { slug: { in: slugsToDelete } }
    });

    const categoryIds = categories.map(c => c.id);

    if (categoryIds.length > 0) {
        await prisma.subcategory.deleteMany({
            where: { categoryId: { in: categoryIds } }
        });

        await prisma.category.deleteMany({
            where: { id: { in: categoryIds } }
        });
        console.log('Deleted successfully.');
    } else {
        console.log('Categories not found or already deleted.');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
