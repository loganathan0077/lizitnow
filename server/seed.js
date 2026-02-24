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

    // 4. Properties & Spaces
    const realEstate = await prisma.category.upsert({
        where: { slug: 'real-estate' },
        update: { name: 'Properties & Spaces' },
        create: { name: 'Properties & Spaces', slug: 'real-estate' }
    });

    const realEstateSubcats = [
        { name: 'Premium Villa Plots', slug: 'real-estate-premium-villa-plots', formFields: JSON.stringify([{ name: 'Approval Type', type: 'select', options: ['DTCP', 'CMDA', 'Both', 'Other'] }, { name: 'Plot Area (Sq.ft)', type: 'number' }, { name: 'Facing Direction', type: 'select', options: ['East', 'West', 'North', 'South'] }, { name: 'Gated Community', type: 'select', options: ['Yes', 'No'] }]) },
        { name: 'Farmland Investment', slug: 'real-estate-farmland', formFields: JSON.stringify([{ name: 'Area (Acres/Cents)', type: 'text' }, { name: 'Fencing', type: 'select', options: ['Yes', 'No'] }, { name: 'Water Source', type: 'text' }, { name: 'Suitable For', type: 'text', placeholder: 'e.g. Weekend Home, Agriculture' }]) },
        { name: 'Individual Houses / Independent Villas', slug: 'real-estate-houses-villas', formFields: JSON.stringify([{ name: 'BHK', type: 'select', options: ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'] }, { name: 'Status', type: 'select', options: ['Ready to Move', 'Under Construction', 'Resale'] }, { name: 'Built-up Area (Sq.ft)', type: 'number' }, { name: 'Furnishing', type: 'select', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] }]) },
        { name: 'Apartments / Flats', slug: 'real-estate-apartments', formFields: JSON.stringify([{ name: 'BHK', type: 'select', options: ['1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Studio'] }, { name: 'Status', type: 'select', options: ['Ready to Move', 'Under Construction', 'Resale'] }, { name: 'Built-up Area (Sq.ft)', type: 'number' }, { name: 'Floor No', type: 'number' }, { name: 'Total Floors', type: 'number' }]) },
        { name: 'Budget Plots', slug: 'real-estate-budget-plots', formFields: JSON.stringify([{ name: 'Plot Area (Sq.ft)', type: 'number' }, { name: 'Approval Level', type: 'select', options: ['Panchayat', 'Unapproved', 'Processing'] }, { name: 'EMI Available', type: 'select', options: ['Yes', 'No'] }]) },
        { name: 'Rental & PG Investment', slug: 'real-estate-rental', formFields: JSON.stringify([{ name: 'Property Type', type: 'select', options: ['Rental House', 'PG Building', 'Commercial Rental'] }, { name: 'Monthly Rental Income (₹)', type: 'number' }, { name: 'Total Area (Sq.ft)', type: 'number' }]) },
        { name: 'Commercial Shops', slug: 'real-estate-commercial-shops', formFields: JSON.stringify([{ name: 'Type', type: 'select', options: ['Shop', 'Showroom', 'Other'] }, { name: 'Carpet Area (Sq.ft)', type: 'number' }, { name: 'Furnishing', type: 'select', options: ['Furnished', 'Semi-Furnished', 'Unfurnished', 'Bare Shell'] }]) },
        { name: 'Office Spaces', slug: 'real-estate-office-spaces', formFields: JSON.stringify([{ name: 'Property Type', type: 'select', options: ['Private Office', 'Co-working', 'IT Park', 'Corporate Office'] }, { name: 'Total Area (sqft)', type: 'number' }, { name: 'Built-up Area', type: 'number' }, { name: 'Floor Number', type: 'number' }, { name: 'Furnishing', type: 'select', options: ['Fully Furnished', 'Semi-Furnished', 'Bare Shell'] }, { name: 'Cabin Count', type: 'number' }, { name: 'Meeting Rooms', type: 'number' }, { name: 'Washrooms', type: 'number' }, { name: 'Parking Slots', type: 'number' }, { name: 'Lift Available', type: 'select', options: ['Yes', 'No'] }, { name: 'Power Backup', type: 'select', options: ['Yes', 'No'] }, { name: 'Fire Safety Available', type: 'select', options: ['Yes', 'No'] }, { name: 'Rental / Sale', type: 'select', options: ['Rent', 'Sale'] }, { name: 'Monthly Rent', type: 'number' }, { name: 'Security Deposit', type: 'number' }, { name: 'Price Negotiable', type: 'select', options: ['Yes', 'No'] }]) },
        { name: 'Warehouse / Industrial Spaces', slug: 'real-estate-warehouse-industrial', formFields: JSON.stringify([{ name: 'Property Type', type: 'select', options: ['Warehouse', 'Industrial Shed', 'Factory', 'Industrial Land'] }, { name: 'Total Land Area', type: 'number' }, { name: 'Built-up Area', type: 'number' }, { name: 'Ceiling Height', type: 'text' }, { name: 'Dock Level', type: 'select', options: ['Yes', 'No'] }, { name: 'Loading Bay', type: 'number' }, { name: 'Power Capacity (in kVA)', type: 'number' }, { name: 'Water Supply', type: 'text' }, { name: 'Office Space Inside', type: 'select', options: ['Yes', 'No'] }, { name: 'Fire Safety Compliance', type: 'select', options: ['Yes', 'No', 'Processing'] }, { name: 'Truck Access', type: 'select', options: ['Yes - Container Accessible', 'No'] }, { name: 'Zoning Type', type: 'select', options: ['Industrial', 'Commercial'] }, { name: 'Rent / Sale', type: 'select', options: ['Rent', 'Sale'] }, { name: 'Monthly Rent', type: 'number' }, { name: 'Security Deposit', type: 'number' }, { name: 'Price Negotiable', type: 'select', options: ['Yes', 'No'] }]) },
        { name: 'Gated Community Plots', slug: 'real-estate-gated-plots', formFields: JSON.stringify([{ name: 'Approval Type', type: 'select', options: ['DTCP', 'CMDA', 'RERA', 'Multiple'] }, { name: 'Plot Area (Sq.ft)', type: 'number' }, { name: 'Security Features', type: 'text', placeholder: 'e.g. 24/7 Security, CCTV' }, { name: 'Amenities included', type: 'text', placeholder: 'e.g. Park, Clubhouse, Water' }]) }
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

    // 6. Jobs & Careers
    const jobs = await prisma.category.upsert({
        where: { slug: 'jobs' },
        update: {},
        create: { name: 'Jobs & Careers', slug: 'jobs' }
    });

    const commonJobFields = [
        { name: 'Job Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract'] },
        { name: 'Salary Range', type: 'text', placeholder: 'e.g. ₹20,000 - ₹30,000 / month' },
        { name: 'Experience Required', type: 'select', options: ['Fresher', '1-3 Years', '3-5 Years', '5+ Years'] },
        { name: 'Qualification', type: 'select', options: ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Diploma', 'Any'] },
        { name: 'Gender Preference', type: 'select', options: ['Any', 'Male', 'Female'] },
        { name: 'Work Mode', type: 'select', options: ['Office', 'Remote', 'Hybrid'] },
        { name: 'Immediate Joining', type: 'select', options: ['Yes', 'No'] }
    ];

    const jobsSubcats = [
        { name: 'IT & Software', slug: 'jobs-it', formFields: JSON.stringify([{ name: 'Job Role', type: 'select', options: ['Developer', 'Web Developer', 'App Developer', 'Data Analyst', 'UI/UX Designer', 'Cyber Security', 'IT Support', 'Other'] }, ...commonJobFields]) },
        { name: 'Office / Corporate Jobs', slug: 'jobs-office', formFields: JSON.stringify([{ name: 'Job Role', type: 'select', options: ['Accountant', 'HR', 'Sales Executive', 'Marketing Executive', 'Admin', 'Telecaller', 'Other'] }, ...commonJobFields]) },
        { name: 'Manufacturing & Industrial', slug: 'jobs-manufacturing', formFields: JSON.stringify([{ name: 'Job Role', type: 'select', options: ['Machine Operator', 'Factory Worker', 'Supervisor', 'Warehouse Staff', 'Electrician', 'Welder', 'Other'] }, ...commonJobFields]) },
        { name: 'Driver & Delivery', slug: 'jobs-driver', formFields: JSON.stringify([{ name: 'Job Role', type: 'select', options: ['Car Driver', 'Truck Driver', 'Delivery Executive', 'Bike Rider', 'Heavy Vehicle Driver', 'Other'] }, ...commonJobFields]) },
        { name: 'Healthcare', slug: 'jobs-healthcare', formFields: JSON.stringify([{ name: 'Job Role', type: 'select', options: ['Nurse', 'Lab Technician', 'Medical Representative', 'Pharmacist', 'Doctor Assistant', 'Other'] }, ...commonJobFields]) },
        { name: 'Retail & Hospitality', slug: 'jobs-retail', formFields: JSON.stringify([{ name: 'Job Role', type: 'select', options: ['Shop Staff', 'Hotel Staff', 'Receptionist', 'Chef', 'Waiter', 'Housekeeping', 'Other'] }, ...commonJobFields]) },
        { name: 'Education', slug: 'jobs-education', formFields: JSON.stringify([{ name: 'Job Role', type: 'select', options: ['Teacher', 'Tutor', 'Trainer', 'School Staff', 'Other'] }, ...commonJobFields]) },
        { name: 'Construction & Site Work', slug: 'jobs-construction', formFields: JSON.stringify([{ name: 'Job Role', type: 'select', options: ['Civil Engineer', 'Site Supervisor', 'Mason', 'Carpenter', 'Plumber', 'Other'] }, ...commonJobFields]) },
        { name: 'Work From Home', slug: 'jobs-wfh', formFields: JSON.stringify([{ name: 'Job Role', type: 'select', options: ['Online Sales', 'Telecalling', 'Data Entry', 'Freelancing', 'Social Media Manager', 'Other'] }, ...commonJobFields]) }
    ];

    for (const sub of jobsSubcats) {
        await prisma.subcategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: { ...sub, categoryId: jobs.id }
        });
    }

    // 7. Industrial Products
    const industrial = await prisma.category.upsert({
        where: { slug: 'industrial-products' },
        update: {},
        create: { name: 'Industrial Products', slug: 'industrial-products' }
    });

    const industrialSubcats = [
        { name: 'Machinery & Equipment', slug: 'industrial-machinery', formFields: JSON.stringify([{ name: 'Type', type: 'text' }, { name: 'Condition', type: 'select', options: ['New', 'Used', 'Refurbished'] }, { name: 'Brand', type: 'text' }]) },
        { name: 'Tools & Hardware', slug: 'industrial-tools', formFields: JSON.stringify([{ name: 'Type', type: 'text' }, { name: 'Condition', type: 'select', options: ['New', 'Used'] }, { name: 'Brand', type: 'text' }]) },
        { name: 'Electrical Materials', slug: 'industrial-electrical', formFields: JSON.stringify([{ name: 'Type', type: 'text' }, { name: 'Condition', type: 'select', options: ['New', 'Used'] }]) },
        { name: 'Safety Equipment', slug: 'industrial-safety', formFields: JSON.stringify([{ name: 'Type', type: 'text' }, { name: 'Condition', type: 'select', options: ['New', 'Used'] }]) },
        { name: 'Construction Materials', slug: 'industrial-construction', formFields: JSON.stringify([{ name: 'Type', type: 'text' }, { name: 'Quantity Available', type: 'text' }]) },
        { name: 'Generators & Motors', slug: 'industrial-generators', formFields: JSON.stringify([{ name: 'Type', type: 'select', options: ['Generator', 'Motor', 'Other'] }, { name: 'Capacity/Power', type: 'text' }, { name: 'Condition', type: 'select', options: ['New', 'Used', 'Refurbished'] }]) },
        { name: 'Spare Parts', slug: 'industrial-spare-parts', formFields: JSON.stringify([{ name: 'Part Name', type: 'text' }, { name: 'Machine Compatibility', type: 'text' }, { name: 'Condition', type: 'select', options: ['New', 'Used', 'Refurbished'] }]) },
        { name: 'Other Industrial Products', slug: 'industrial-other', formFields: JSON.stringify([{ name: 'Type', type: 'text' }, { name: 'Condition', type: 'select', options: ['New', 'Used'] }]) }
    ];

    for (const sub of industrialSubcats) {
        await prisma.subcategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: { ...sub, categoryId: industrial.id }
        });
    }

    // 8. Pets & Animals
    const pets = await prisma.category.upsert({
        where: { slug: 'pets-animals' },
        update: {},
        create: { name: '🐶 Pets & Animals', slug: 'pets-animals' }
    });

    const petsSubcats = [
        { name: 'Pets for Sale', slug: 'pets-animals-sale', formFields: JSON.stringify([{ name: 'Type of Pet', type: 'select', options: ['Dog', 'Cat', 'Bird', 'Fish', 'Other'] }, { name: 'Breed', type: 'text' }, { name: 'Age', type: 'text' }]) },
        { name: 'Pet Accessories', slug: 'pets-animals-accessories', formFields: JSON.stringify([{ name: 'Type', type: 'text' }, { name: 'Condition', type: 'select', options: ['New', 'Used'] }]) },
        { name: 'Pet Food', slug: 'pets-animals-food', formFields: JSON.stringify([{ name: 'Type', type: 'text' }, { name: 'Brand', type: 'text' }]) },
        { name: 'Pet Services', slug: 'pets-animals-services', formFields: JSON.stringify([{ name: 'Service Type', type: 'select', options: ['Grooming', 'Training', 'Boarding', 'Vet', 'Other'] }]) }
    ];

    for (const sub of petsSubcats) {
        await prisma.subcategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: { ...sub, categoryId: pets.id }
        });
    }

    // 9. Event Services & Organizers
    const events = await prisma.category.upsert({
        where: { slug: 'event-services' },
        update: {},
        create: { name: 'Event Services & Organizers', slug: 'event-services' }
    });

    const eventsSubcats = [
        { name: 'Wedding Services', slug: 'events-wedding', formFields: JSON.stringify([{ name: 'Type of Service', type: 'select', options: ['Wedding Planners', 'Marriage Hall / Mandapam Booking', 'Wedding Decorators (Stage & Background)', 'Flower Decoration Services', 'Catering Services', 'Photography & Videography', 'Bridal Makeup Artists', 'Mehendi Artists', 'DJ & Sound System', 'Light & Stage Setup', 'Generator & Power Backup', 'Water Supply Services', 'Priest / Pandit Services', 'Invitation Card Designers', 'Wedding Car Rental', 'Event Security', 'Other'] }, { name: 'Experience (Years)', type: 'number' }]) },
        { name: 'Birthday & Party Services', slug: 'events-birthday', formFields: JSON.stringify([{ name: 'Type of Service', type: 'select', options: ['Birthday Party Organizers', 'Balloon Decoration', 'Theme Decoration', 'Cake Suppliers', 'Party Catering', 'Magic Show / Kids Entertainment', 'DJ & Music', 'Photography', 'Other'] }]) },
        { name: 'Corporate Events', slug: 'events-corporate', formFields: JSON.stringify([{ name: 'Type of Service', type: 'select', options: ['Corporate Event Planners', 'Conference Setup', 'Exhibition Stall Setup', 'Stage & LED Wall Setup', 'Sound & Lighting Services', 'Event Staff Supply', 'Other'] }]) },
        { name: 'Funeral & Memorial Services', slug: 'events-funeral', formFields: JSON.stringify([{ name: 'Type of Service', type: 'select', options: ['Funeral Service Organizers', 'Cremation / Burial Arrangement', 'Priest Services', 'Floral Arrangements', 'Tent & Seating Setup', 'Water & Catering Services', 'Obituary Printing', 'Other'] }]) },
        { name: 'Concerts & Tickets', slug: 'events-concerts', formFields: JSON.stringify([{ name: 'Event Type', type: 'select', options: ['Concert Tickets', 'Show Tickets', 'Cultural Event Tickets', 'Sports Event Tickets', 'Other'] }, { name: 'Date', type: 'text' }, { name: 'Venue', type: 'text' }]) },
        { name: 'Party Equipment Rental', slug: 'events-rental', formFields: JSON.stringify([{ name: 'Equipment Type', type: 'select', options: ['Chairs & Tables Rental', 'Tent & Shamiana Rental', 'Stage Setup', 'Sound System Rental', 'Lighting Equipment', 'Generator Rental', 'Other'] }, { name: 'Rental Period', type: 'text' }]) }
    ];

    for (const sub of eventsSubcats) {
        await prisma.subcategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: { ...sub, categoryId: events.id }
        });
    }

    // 10. Services
    const services = await prisma.category.upsert({
        where: { slug: 'services' },
        update: {},
        create: { name: '🛠 Services', slug: 'services' }
    });

    const servicesSubcats = [
        { name: 'Plumbing', slug: 'services-plumbing', formFields: JSON.stringify([{ name: 'Service Needed', type: 'text' }, { name: 'Urgency', type: 'select', options: ['Immediate', 'Within a few days', 'Flexible'] }]) },
        { name: 'Electrical Work', slug: 'services-electrical', formFields: JSON.stringify([{ name: 'Service Needed', type: 'text' }, { name: 'Urgency', type: 'select', options: ['Immediate', 'Within a few days', 'Flexible'] }]) },
        { name: 'AC Repair & Installation', slug: 'services-ac', formFields: JSON.stringify([{ name: 'Service Needed', type: 'select', options: ['Repair', 'Installation', 'Routine Service', 'Other'] }, { name: 'AC Type', type: 'select', options: ['Split AC', 'Window AC', 'Central AC', 'Other'] }]) },
        { name: 'Painting Services', slug: 'services-painting', formFields: JSON.stringify([{ name: 'Type of Property', type: 'select', options: ['Residential', 'Commercial'] }, { name: 'Approx Area (sqft)', type: 'text' }]) },
        { name: 'Cleaning Services', slug: 'services-cleaning', formFields: JSON.stringify([{ name: 'Service Type', type: 'select', options: ['Deep Cleaning', 'Regular Cleaning', 'Sofa/Carpet Cleaning', 'Other'] }]) },
        { name: 'Carpenter Services', slug: 'services-carpenter', formFields: JSON.stringify([{ name: 'Service Needed', type: 'text' }, { name: 'Material Provided', type: 'select', options: ['Yes', 'No'] }]) },
        { name: 'Pest Control', slug: 'services-pest', formFields: JSON.stringify([{ name: 'Target Pest', type: 'select', options: ['Termites', 'Cockroaches', 'Bed Bugs', 'Mosquitoes', 'General', 'Other'] }]) },
        { name: 'CCTV Installation', slug: 'services-cctv', formFields: JSON.stringify([{ name: 'Service Needed', type: 'select', options: ['New Installation', 'Repair/Maintenance', 'Upgrades'] }, { name: 'Number of Cameras', type: 'number' }]) },
        { name: 'Other Service', slug: 'services-other', formFields: JSON.stringify([{ name: 'Service Description', type: 'text' }]) }
    ];

    for (const sub of servicesSubcats) {
        await prisma.subcategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: { ...sub, categoryId: services.id }
        });
    }

    // 11. Books & Education
    const booksAndEducation = await prisma.category.upsert({
        where: { slug: 'books-education' },
        update: {},
        create: { name: '📚 Books & Education', slug: 'books-education' }
    });

    const booksSubcats = [
        { name: 'School Materials', slug: 'education-school', formFields: JSON.stringify([{ name: 'Type', type: 'select', options: ['Textbooks', 'Notebooks', 'Stationery', 'Uniforms', 'Other'] }, { name: 'Class/Grade', type: 'text' }, { name: 'Condition', type: 'select', options: ['New', 'Used'] }]) },
        { name: 'Competitive Exam Books', slug: 'education-competitive', formFields: JSON.stringify([{ name: 'Exam Type', type: 'text', placeholder: 'e.g. UPSC, JEE, NEET, Bank PO' }, { name: 'Condition', type: 'select', options: ['New', 'Used'] }]) },
        { name: 'Guides & Workbooks', slug: 'education-guides', formFields: JSON.stringify([{ name: 'Subject/Topic', type: 'text' }, { name: 'Condition', type: 'select', options: ['New', 'Used'] }]) },
        { name: 'College Materials', slug: 'education-college', formFields: JSON.stringify([{ name: 'Degree/Course', type: 'text', placeholder: 'e.g. B.Tech, B.Com, Medical' }, { name: 'Material Type', type: 'select', options: ['Books', 'Notes', 'Projects/Records', 'Other'] }, { name: 'Condition', type: 'select', options: ['New', 'Used'] }]) },
        { name: 'Online Courses', slug: 'education-online', formFields: JSON.stringify([{ name: 'Course Topic', type: 'text', placeholder: 'e.g. Coding, Digital Marketing' }, { name: 'Platform/Provider', type: 'text' }, { name: 'Duration', type: 'text' }]) },
        { name: 'Skill Development Training', slug: 'education-skills', formFields: JSON.stringify([{ name: 'Skill Category', type: 'text', placeholder: 'e.g. Language, Music, Dance, IT' }, { name: 'Mode of Training', type: 'select', options: ['Online', 'Offline', 'Hybrid'] }]) }
    ];

    for (const sub of booksSubcats) {
        await prisma.subcategory.upsert({
            where: { slug: sub.slug },
            update: {},
            create: { ...sub, categoryId: booksAndEducation.id }
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
