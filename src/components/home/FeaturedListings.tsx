import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import ListingCard from '@/components/listings/ListingCard';
import API_BASE from '@/lib/api';
import { useState, useEffect } from 'react';

const FeaturedListings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/ads/search?sort=newest`)
      .then(res => res.json())
      .then(data => {
        const ads = (data.ads || []).slice(0, 8).map((ad: any) => {
          let imgs: string[] = [];
          try { imgs = typeof ad.images === 'string' ? JSON.parse(ad.images) : (ad.images || []); } catch { imgs = []; }
          let dynFields: Record<string, any> = {};
          try { dynFields = ad.dynamicData ? (typeof ad.dynamicData === 'string' ? JSON.parse(ad.dynamicData) : ad.dynamicData) : {}; } catch { }

          return {
            ...ad,
            images: imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'],
            dynamicFields: dynFields,
            category: ad.category?.slug || '',
            condition: ad.condition || 'used',
            seller: {
              id: ad.user?.id || ad.userId,
              name: ad.user?.name || 'Seller',
              badges: ad.user?.isGstVerified ? ['verified'] : [],
              memberSince: '',
              adsPosted: 0,
              responseRate: 0,
              tier: 'Bronze',
              stats: { itemsSold: 0, completionRate: 0, transactionCount: 0, disputeCount: 0, responseTime: '' },
              followers: 0,
              rating: 0,
              reviews: [],
              isVerifiedMobile: false,
              isVerifiedEmail: false,
            },
          };
        });
        setListings(ads);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Don't render the section if no ads
  if (!loading && listings.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container-tight">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Listings
            </h2>
            <p className="text-muted-foreground">
              Hand-picked deals from verified sellers
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex" asChild>
            <Link to="/listings">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} featured />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link to="/listings">
              View All Listings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
