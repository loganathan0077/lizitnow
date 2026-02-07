export type Category = {
  id: string;
  name: string;
  icon: string;
  slug: string;
  count: number;
};

export type TrustBadge = 'verified' | 'trusted' | 'premium';

export type Condition = 'new' | 'like-new' | 'used';

export type Review = {
  id: string;
  authorId: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
};

export type Seller = {
  id: string;
  name: string;
  badges: TrustBadge[];
  memberSince: string;
  adsPosted: number;
  responseRate: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  stats: {
    itemsSold: number;
    completionRate: number; // percentage
    transactionCount: number;
    disputeCount: number;
    responseTime: string; // e.g. "Within 1 hour"
  };
  followers: number;
  rating: number;
  reviews: Review[];
  isVerifiedMobile: boolean;
  isVerifiedEmail: boolean;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: Condition;
  location: string;
  seller: Seller;
  createdAt: string;
  featured?: boolean;
  status: 'active' | 'pending' | 'sold' | 'expired' | 'rejected';
  expiresAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  walletBalance: number;
  badges: TrustBadge[];
  isVerified: boolean;
};
