import { Category, Listing, Seller as BaseSeller } from '@/types/marketplace';

// Extend the Seller type to include isOnline for this phase
interface Seller extends BaseSeller {
  isOnline: boolean;
}

// Import product images
import iphone14Pro from '@/assets/products/iphone-14-pro.jpg';
import macbookAir from '@/assets/products/macbook-air.jpg';
import sofa from '@/assets/products/sofa.jpg';
import samsungS23 from '@/assets/products/samsung-s23.jpg';
import royalEnfield from '@/assets/products/royal-enfield.jpg';
import lgRefrigerator from '@/assets/products/lg-refrigerator.jpg';
import sonyTv from '@/assets/products/sony-tv.jpg';
import woodenBed from '@/assets/products/wooden-bed.jpg';

export const categories: Category[] = [
  { id: '1', name: 'Mobile Phones', icon: 'Smartphone', slug: 'mobiles', count: 2453 },
  { id: '2', name: 'Electronics', icon: 'Laptop', slug: 'electronics', count: 1876 },
  { id: '3', name: 'Furniture', icon: 'Sofa', slug: 'furniture', count: 943 },
  { id: '4', name: 'Home Appliances', icon: 'Refrigerator', slug: 'appliances', count: 1234 },
  { id: '5', name: 'Vehicles', icon: 'Car', slug: 'vehicles', count: 567 },
  { id: '6', name: 'Properties & Spaces', icon: 'MapPin', slug: 'real-estate', count: 342 },
  { id: '7', name: 'Jobs & Careers', icon: 'Briefcase', slug: 'jobs', count: 890 },
];

const mockSellerStats = {
  itemsSold: 15,
  completionRate: 98,
  transactionCount: 15,
  disputeCount: 0,
  responseTime: 'Within 1 hour',
};

const sellers: Seller[] = [
  {
    id: 's1',
    name: 'Rahul Sharma',
    badges: ['verified', 'trusted'],
    memberSince: '2023',
    adsPosted: 24,
    responseRate: 98,
    isOnline: true,
    tier: 'Gold',
    stats: { ...mockSellerStats, itemsSold: 22 },
    followers: 45,
    rating: 4.8,
    reviews: [],
    isVerifiedMobile: true,
    isVerifiedEmail: true,
  },
  {
    id: 's2',
    name: 'Priya Patel',
    badges: ['verified', 'premium'],
    memberSince: '2022',
    adsPosted: 56,
    responseRate: 100,
    isOnline: false,
    tier: 'Diamond',
    stats: { ...mockSellerStats, itemsSold: 50 },
    followers: 120,
    rating: 4.9,
    reviews: [],
    isVerifiedMobile: true,
    isVerifiedEmail: true,
  },
  {
    id: 's3',
    name: 'Amit Kumar',
    badges: ['verified'],
    memberSince: '2024',
    adsPosted: 8,
    responseRate: 92,
    isOnline: true,
    tier: 'Bronze',
    stats: { ...mockSellerStats, itemsSold: 5 },
    followers: 12,
    rating: 4.5,
    reviews: [],
    isVerifiedMobile: true,
    isVerifiedEmail: false,
  },
  {
    id: 's4',
    name: 'Sneha Reddy',
    badges: ['verified', 'trusted', 'premium'],
    memberSince: '2021',
    adsPosted: 112,
    responseRate: 99,
    isOnline: false,
    tier: 'Diamond',
    stats: { ...mockSellerStats, itemsSold: 105 },
    followers: 340,
    rating: 5.0,
    reviews: [],
    isVerifiedMobile: true,
    isVerifiedEmail: true,
  },
];

export const listings: Listing[] = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max - 256GB Deep Purple',
    description: 'Excellent condition, 11 months old. With original box, charger, and unused earphones. Battery health 96%.',
    price: 89999,
    images: [iphone14Pro],
    category: 'mobiles',
    condition: 'like-new',
    location: 'Mumbai, Maharashtra',
    seller: sellers[0],
    createdAt: '2024-01-15',
    featured: true,
    status: 'active',
    expiresAt: '2024-02-15',
    marketPrice: 95000,
    views: 1240,
    includedItems: ['Original Box', 'Charger Cable', 'Documentation'],
    dynamicFields: {
      'RAM': '6GB',
      'Storage': '256GB',
      'Battery Health': '96%',
      'Brand': 'Apple',
      'Warranty': '1 Month Remaining'
    }
  },
  {
    id: '2',
    title: 'Apple MacBook Air M2 Laptop - 8GB/256GB Space Gray',
    description: 'Barely used, perfect condition laptop. Includes charger and protective case. AppleCare+ until Dec 2025.',
    price: 84999,
    images: [macbookAir],
    category: 'electronics',
    condition: 'like-new',
    location: 'Bangalore, Karnataka',
    seller: sellers[1],
    createdAt: '2024-01-14',
    featured: true,
    status: 'active',
    expiresAt: '2024-02-14',
    marketPrice: 90000,
    views: 890,
    includedItems: ['MagSafe Charger', 'Protective Case'],
    dynamicFields: {
      'RAM': '8GB',
      'Storage': '256GB',
      'Processor': 'M2 Chip',
      'Brand': 'Apple',
      'Warranty': 'Until Dec 2025'
    }
  },
  {
    id: '3',
    title: 'Premium L-Shape Sofa Set - Beige',
    description: '3-seater L-shape sofa with premium fabric. Only 1 year old. Moving out sale. Minor wear, great condition.',
    price: 35000,
    images: [sofa],
    category: 'furniture',
    condition: 'used',
    location: 'Delhi NCR',
    seller: sellers[2],
    createdAt: '2024-01-13',
    status: 'active',
    expiresAt: '2024-02-13',
  },
  {
    id: '4',
    title: 'Samsung Galaxy S23 Ultra - 512GB',
    description: 'Brand new sealed box. Purchased from Samsung India. Full warranty. Green color.',
    price: 109999,
    images: [samsungS23],
    category: 'mobiles',
    condition: 'new',
    location: 'Hyderabad, Telangana',
    seller: sellers[3],
    createdAt: '2024-01-12',
    featured: true,
    status: 'active',
    expiresAt: '2024-02-12',
  },
  {
    id: '5',
    title: 'LG Side-by-Side Refrigerator 687L',
    description: 'Smart inverter, door cooling+, multi air flow. 2 years old, excellent condition. Reason: Upgrading.',
    price: 55000,
    images: [lgRefrigerator],
    category: 'appliances',
    condition: 'used',
    location: 'Chennai, Tamil Nadu',
    seller: sellers[0],
    createdAt: '2024-01-11',
    status: 'active',
    expiresAt: '2024-02-11',
  },
  {
    id: '6',
    title: 'Royal Enfield Classic 350 - 2022',
    description: 'Chrome Black, 12000 km, first owner. All documents clear. Service history available.',
    price: 165000,
    images: [royalEnfield],
    category: 'vehicles',
    condition: 'used',
    location: 'Pune, Maharashtra',
    seller: sellers[1],
    createdAt: '2024-01-10',
    featured: true,
    status: 'active',
    expiresAt: '2024-02-10',
  },
  {
    id: '7',
    title: 'Sony 55" 4K Smart TV - X90J',
    description: 'Stunning picture quality, Dolby Vision, Google TV. 18 months old. Wall mount included.',
    price: 72000,
    images: [sonyTv],
    category: 'electronics',
    condition: 'like-new',
    location: 'Kolkata, West Bengal',
    seller: sellers[2],
    createdAt: '2024-01-09',
    status: 'active',
    expiresAt: '2024-02-09',
  },
  {
    id: '8',
    title: 'Wooden King Size Bed with Storage',
    description: 'Solid sheesham wood, hydraulic storage, mattress not included. Classic design. Moving sale.',
    price: 28000,
    images: [woodenBed],
    category: 'furniture',
    condition: 'used',
    location: 'Ahmedabad, Gujarat',
    seller: sellers[3],
    createdAt: '2024-01-08',
    status: 'active',
    expiresAt: '2024-02-08',
    views: 156,
    dynamicFields: {
      'Material': 'Sheesham Wood',
      'Assembly Required': 'Yes',
      'Age': '2 years'
    }
  },
  {
    id: '9',
    title: 'Premium Corner Plot - 1200 Sq.ft DTCP Approved',
    description: 'Well-located land in a developing area with good road access. Clear documents and ready for registration. Suitable for residential or investment purpose.',
    price: 3600000,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop'],
    category: 'real-estate',
    condition: 'new',
    location: 'Bangalore, Karnataka',
    seller: sellers[1],
    createdAt: '2024-01-16',
    featured: true,
    status: 'active',
    expiresAt: '2024-03-16',
    marketPrice: 4200000,
    views: 2450,
    dynamicFields: {
      'Plot Size (Sq.ft)': 1200,
      'Price per Sq.ft': 3000,
      'Approval Type': 'DTCP',
      'Facing Direction': 'East',
      'Corner Plot': 'Yes',
      'Gated Community': 'Yes',
      'Loan Available': 'Yes'
    }
  },
];

export const getFeaturedListings = () => listings.filter(l => l.featured);

export const getListingsByCategory = (slug: string) =>
  listings.filter(l => l.category === slug);


export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

export const locations = [
  'All Locations',
  'Mumbai, Maharashtra',
  'Bangalore, Karnataka',
  'Delhi NCR',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Pune, Maharashtra',
  'Kolkata, West Bengal',
  'Ahmedabad, Gujarat'
];
