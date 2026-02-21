import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, ShieldCheck } from 'lucide-react';
import { useLocationContext } from '@/context/LocationContext';

import SearchSuggestions from '../shared/SearchSuggestions';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { location: selectedLocation } = useLocationContext();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    if (selectedLocation !== 'All Locations') {
      params.set('location', selectedLocation);
    }

    if (params.toString()) {
      navigate(`/listings?${params.toString()}`);
    } else {
      navigate('/listings');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-primary/5 py-16 md:py-24 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber rounded-full blur-3xl" />
      </div>

      <div className="container-tight relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <ShieldCheck className="h-4 w-4" />
            <span>India's Most Trusted Marketplace</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
            Smart Deals{' '}
            <span className="text-gradient-olive">Start Here</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
            Simple, safe, and smooth deals every time.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-8 animate-slide-up relative" style={{ animationDelay: '200ms' }}>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search in ${selectedLocation === 'All Locations' ? 'All India' : selectedLocation}...`}
                className="w-full h-14 pl-14 pr-36 rounded-2xl bg-card border border-border shadow-soft text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <Button
                variant="accent"
                size="lg"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
            {showSuggestions && (
              <SearchSuggestions
                query={searchQuery}
                onClose={() => setShowSuggestions(false)}
                className="text-left"
              />
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <Button variant="default" size="xl" asChild>
              <Link to="/listings">
                Browse All Ads
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="accent-outline" size="xl" asChild>
              <Link to="/post-ad">
                Post Your Ad
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 md:gap-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div>
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Active Listings</div>
            </div>
            <div>
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">5K+</div>
              <div className="text-sm text-muted-foreground">Verified Sellers</div>
            </div>
            <div>
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
