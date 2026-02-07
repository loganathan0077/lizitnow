import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getFeaturedListings } from '@/data/mockData';
import ListingCard from '@/components/listings/ListingCard';

const FeaturedListings = () => {
  const featuredListings = getFeaturedListings();

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} featured />
          ))}
        </div>

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
