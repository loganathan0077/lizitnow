import { Seller } from '@/types/marketplace';

export type SellerTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond';

export const calculateSellerTier = (stats: Seller['stats'], rating: number): SellerTier => {
    const { itemsSold, completionRate } = stats;

    if (itemsSold > 100 && completionRate > 98 && rating > 4.8) {
        return 'Diamond';
    }
    if (itemsSold > 50 && completionRate > 95 && rating > 4.5) {
        return 'Gold';
    }
    if (itemsSold > 10 && completionRate > 90 && rating > 4.0) {
        return 'Silver';
    }
    return 'Bronze';
};
