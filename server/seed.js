const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding categories and subcategories...');

    // 1. Mobile Phones (Electronics/Mobiles)
    const electronics = await prisma.category.upsert({
        where: { slug: 'electronics' },
        update: {},
        create: { name: 'Electronics', slug: 'electronics' }
    });

    const electronicsSubcats = [
        { name: 'Mobile Phones', slug: 'electronics-mobile-phones', formFields: JSON.stringify([{ name: 'Brand', type: 'text', placeholder: 'e.g. Apple, Samsung' }, { name: 'RAM', type: 'select', options: ['4GB', '6GB', '8GB', '12GB', '16GB'] }, { name: 'Storage', type: 'select', options: ['64GB', '128GB', '256GB', '512GB', '1TB'] }, { name: 'Battery Health', type: 'text', placeholder: 'e.g. 96%' }, { name: 'Warranty', type: 'text', placeholder: 'e.g. 6 Months Remaining' }]) },
        { name: 'Televisions', slug: 'electronics-televisions', formFields: JSON.stringify([{ name: 'Brand', type: 'text', placeholder: 'e.g. Sony, LG' }, { name: 'Screen Size', type: 'text', placeholder: 'e.g. 55 inch' }, { name: 'Resolution', type: 'select', options: ['HD', 'Full HD', '4K', '8K'] }, { name: 'Smart TV', type: 'select', options: ['Yes', 'No'] }]) },
        { name: 'Laptops', slug: 'electronics-laptops', formFields: JSON.stringify([{ name: 'Brand', type: 'text', placeholder: 'e.g. HP, Dell, Apple' }, { name: 'Processor', type: 'text', placeholder: 'e.g. Intel i5, M2' }, { name: 'RAM', type: 'select', options: ['8GB', '16GB', '32GB', '64GB'] }, { name: 'Storage', type: 'text', placeholder: 'e.g. 512GB SSD' }]) },
        { name: 'Tablets', slug: 'electronics-tablets', formFields: JSON.stringify([{ name: 'Brand', type: 'text', placeholder: 'e.g. Apple, Samsung' }, { name: 'Storage', type: 'select', options: ['64GB', '128GB', '256GB', '512GB', '1TB'] }, { name: 'Connectivity', type: 'select', options: ['Wi-Fi Only', 'Wi-Fi + Cellular'] }]) },
        { name: 'Cameras', slug: 'electronics-cameras', formFields: JSON.stringify([{ name: 'Brand', type: 'text', placeholder: 'e.g. Canon, Nikon' }, { name: 'Type', type: 'select', options: ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action Camera'] }, { name: 'Megapixels', type: 'text', placeholder: 'e.g. 24MP' }]) },
        { name: 'Accessories', slug: 'electronics-accessories', formFields: JSON.stringify([{ name: 'Type', type: 'text', placeholder: 'e.g. Charger, Case, Cable' }, { name: 'Brand/Compatibility', type: 'text', placeholder: 'e.g. Apple, Universal' }]) }
    ];

    for (const sub of electronicsSubcats) {
        await prisma.subcategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: { ...sub, categoryId: electronics.id }
        });
    }

    // 2. Vehicles
    const vehicles = await prisma.category.upsert({
        where: { slug: 'vehicles' },
        update: {},
        create: { name: 'Vehicles', slug: 'vehicles' }
    });

    const vehiclesSubcats = [
        { name: 'Cars', slug: 'vehicles-cars', formFields: JSON.stringify([{ name: 'Brand', type: 'text', placeholder: 'e.g. Maruti, Hyundai' }, { name: 'Year', type: 'number', placeholder: 'e.g. 2022' }, { name: 'KM Driven', type: 'number', placeholder: 'e.g. 15000' }, { name: 'Fuel Type', type: 'select', options: ['Petrol', 'Diesel', 'Electric', 'CNG'] }, { name: 'Owner Count', type: 'select', options: ['1st', '2nd', '3rd', '4th+'] }]) },
        { name: 'Bikes', slug: 'vehicles-bikes', formFields: JSON.stringify([{ name: 'Brand', type: 'text', placeholder: 'e.g. Honda, Royal Enfield' }, { name: 'Year', type: 'number', placeholder: 'e.g. 2021' }, { name: 'KM Driven', type: 'number', placeholder: 'e.g. 20000' }, { name: 'Engine Displacement (cc)', type: 'number', placeholder: 'e.g. 350' }]) },
        { name: 'Scooters', slug: 'vehicles-scooters', formFields: JSON.stringify([{ name: 'Brand', type: 'text', placeholder: 'e.g. Honda, TVS' }, { name: 'Year', type: 'number', placeholder: 'e.g. 2023' }, { name: 'KM Driven', type: 'number', placeholder: 'e.g. 5000' }]) },
        { name: 'Commercial Vehicles', slug: 'vehicles-commercial', formFields: JSON.stringify([{ name: 'Type', type: 'select', options: ['Truck', 'Bus', 'Tempo', 'Tractor', 'Other'] }, { name: 'Brand', type: 'text' }, { name: 'Year', type: 'number' }, { name: 'KM Driven', type: 'number' }]) },
        { name: 'Spare Parts', slug: 'vehicles-spare-parts', formFields: JSON.stringify([{ name: 'Part Name', type: 'text' }, { name: 'Vehicle Compatibility', type: 'text' }, { name: 'Condition', type: 'select', options: ['New', 'Used', 'Refurbished'] }]) }
    ];

    for (const sub of vehiclesSubcats) {
        await prisma.subcategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: { ...sub, categoryId: vehicles.id }
        });
    }

    // 3. Furniture
    const furniture = await prisma.category.upsert({
        where: { slug: 'furniture' },
        update: {},
        create: { name: 'Furniture', slug: 'furniture' }
    });

    const furnitureSubcats = [
        { name: 'Sofa', slug: 'furniture-sofa', formFields: JSON.stringify([{ name: 'Material', type: 'select', options: ['Wood', 'Plastic', 'Metal', 'Leather', 'Sheesham Wood', 'Fabric'] }, { name: 'Seating Capacity', type: 'select', options: ['1 Seater', '2 Seater', '3 Seater', 'L-Shape', 'Set'] }, { name: 'Age', type: 'text', placeholder: 'e.g. 2 Years' }]) },
        { name: 'Beds', slug: 'furniture-beds', formFields: JSON.stringify([{ name: 'Size', type: 'select', options: ['Single', 'Double', 'Queen', 'King'] }, { name: 'Material', type: 'select', options: ['Wood', 'Metal', 'Engineered Wood'] }, { name: 'Storage Included', type: 'select', options: ['Yes', 'No'] }]) },
        { name: 'Dining Table', slug: 'furniture-dining', formFields: JSON.stringify([{ name: 'Seating Capacity', type: 'select', options: ['2 Seater', '4 Seater', '6 Seater', '8+ Seater'] }, { name: 'Material', type: 'text' }]) },
        { name: 'Office Furniture', slug: 'furniture-office', formFields: JSON.stringify([{ name: 'Type', type: 'select', options: ['Office Desk', 'Office Chair', 'Conference Table', 'Cabinet', 'Other'] }, { name: 'Condition', type: 'select', options: ['Excellent', 'Good', 'Fair'] }]) },
        { name: 'Chairs', slug: 'furniture-chairs', formFields: JSON.stringify([{ name: 'Type', type: 'select', options: ['Armchair', 'Rocking Chair', 'Plastic Chair', 'Gaming Chair', 'Other'] }, { name: 'Material', type: 'text' }]) }
    ];

    for (const sub of furnitureSubcats) {
        await prisma.subcategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: { ...sub, categoryId: furniture.id }
        });
    }

    // 4. Real Estate
    const realEstate = await prisma.category.upsert({
        where: { slug: 'real-estate' },
        update: {},
        create: { name: 'Real Estate', slug: 'real-estate' }
    });

    const realEstateSubcats = [
        { name: 'Land', slug: 'real-estate-land', formFields: JSON.stringify([{ name: 'Plot Size (Sq.ft)', type: 'number', placeholder: 'e.g. 1200' }, { name: 'Price per Sq.ft', type: 'number', placeholder: 'e.g. 3000' }, { name: 'Approval Type', type: 'select', options: ['DTCP', 'CMDA', 'Panchayat', 'NA', 'Unapproved'] }, { name: 'Facing Direction', type: 'select', options: ['East', 'West', 'North', 'South'] }, { name: 'Corner Plot', type: 'select', options: ['Yes', 'No'] }, { name: 'Gated Community', type: 'select', options: ['Yes', 'No'] }, { name: 'Loan Available', type: 'select', options: ['Yes', 'No'] }]) },
        { name: 'Apartments', slug: 'real-estate-apartments', formFields: JSON.stringify([{ name: 'BHK', type: 'select', options: ['1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Studio'] }, { name: 'Furnishing', type: 'select', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] }, { name: 'Built-up Area (Sq.ft)', type: 'number' }, { name: 'Floor No', type: 'number' }, { name: 'Total Floors', type: 'number' }]) },
        { name: 'Houses', slug: 'real-estate-houses', formFields: JSON.stringify([{ name: 'BHK', type: 'select', options: ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'] }, { name: 'Furnishing', type: 'select', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] }, { name: 'Plot Area (Sq.ft)', type: 'number' }, { name: 'Built-up Area (Sq.ft)', type: 'number' }]) },
        { name: 'Commercial Property', slug: 'real-estate-commercial', formFields: JSON.stringify([{ name: 'Type', type: 'select', options: ['Office Space', 'Shop', 'Warehouse', 'Industrial Building', 'Other'] }, { name: 'Carpet Area (Sq.ft)', type: 'number' }, { name: 'Furnishing', type: 'select', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] }]) }
    ];

    for (const sub of realEstateSubcats) {
        await prisma.subcategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: { ...sub, categoryId: realEstate.id }
        });
    }

    // 5. Home Appliances
    const appliances = await prisma.category.upsert({
        where: { slug: 'home-appliances' },
        update: {},
        create: { name: 'Home Appliances', slug: 'home-appliances' }
    });

    const appliancesSubcats = [
        { name: 'Air Conditioners', slug: 'appliances-ac', formFields: JSON.stringify([{ name: 'Brand', type: 'text' }, { name: 'Capacity (Tons)', type: 'select', options: ['1.0 Ton', '1.5 Ton', '2.0 Ton', 'Other'] }, { name: 'Energy Rating', type: 'select', options: ['3 Star', '4 Star', '5 Star'] }, { name: 'Type', type: 'select', options: ['Split', 'Window', 'Inverter'] }]) },
        { name: 'Refrigerators', slug: 'appliances-fridge', formFields: JSON.stringify([{ name: 'Brand', type: 'text' }, { name: 'Capacity (Liters)', type: 'number' }, { name: 'Door Type', type: 'select', options: ['Single Door', 'Double Door', 'Side-by-Side', 'Multi-Door'] }]) },
        { name: 'Washing Machines', slug: 'appliances-washing', formFields: JSON.stringify([{ name: 'Brand', type: 'text' }, { name: 'Load Type', type: 'select', options: ['Top Load', 'Front Load', 'Semi-Automatic'] }, { name: 'Capacity (Kg)', type: 'number' }]) },
        { name: 'Other Appliances', slug: 'appliances-other', formFields: JSON.stringify([{ name: 'Type', type: 'text', placeholder: 'e.g. Microwave, Mixer Grinder' }, { name: 'Brand', type: 'text' }]) }
    ];

    for (const sub of appliancesSubcats) {
        await prisma.subcategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: { ...sub, categoryId: appliances.id }
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
