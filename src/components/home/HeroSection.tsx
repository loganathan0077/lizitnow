import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, ShieldCheck, Tag, Users, PlusCircle, Zap } from 'lucide-react';
import { useLocationContext } from '@/context/LocationContext';
import SearchSuggestions from '../shared/SearchSuggestions';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { location: selectedLocation } = useLocationContext();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(3);

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

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
    <section className="relative overflow-hidden bg-background">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {/* SLIDE 1: Trust & Marketplace (Original) */}
          <CarouselItem>
            <div className="relative overflow-hidden w-full h-[500px] md:h-[600px] flex items-center justify-center">
              {/* Background Image */}
              <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop" alt="Marketplace" className="absolute inset-0 w-full h-full object-cover" />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

              <div className="container-tight relative z-10 w-full py-16 md:py-24">
                <div className="max-w-3xl mx-auto text-center">
                  {/* Trust Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium mb-6 animate-fade-in border border-white/20">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>India's Most Trusted Marketplace</span>
                  </div>

                  {/* Headline */}
                  <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight drop-shadow-lg">
                    Smart Deals <br />
                    <span className="text-primary italic">Start Here</span>
                  </h1>

                  {/* Subheadline */}
                  <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto animate-slide-up drop-shadow-md font-light" style={{ animationDelay: '100ms' }}>
                    Simple, safe, and smooth deals every time.
                  </p>

                  {/* Search Bar */}
                  <div className="max-w-xl mx-auto mb-10 animate-slide-up relative" style={{ animationDelay: '200ms' }}>
                    <div className="relative flex items-center bg-white p-1 rounded-full shadow-2xl">
                      <Search className="absolute left-6 text-muted-foreground w-5 h-5 hidden sm:block" />
                      <input
                        type="text"
                        placeholder={`Search in ${selectedLocation === 'All Locations' ? 'All India' : selectedLocation}...`}
                        className="w-full h-12 sm:h-14 pl-6 sm:pl-14 pr-32 sm:pr-40 rounded-full bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-base sm:text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      />
                      <Button
                        variant="default"
                        size="lg"
                        className="absolute right-1 h-10 sm:h-12 rounded-full px-6 sm:px-8 text-sm sm:text-base font-bold"
                        onClick={handleSearch}
                      >
                        Search
                      </Button>
                    </div>
                    {showSuggestions && (
                      <SearchSuggestions
                        query={searchQuery}
                        onClose={() => setShowSuggestions(false)}
                        className="text-left absolute top-full left-0 mt-2 w-full z-50 rounded-2xl overflow-hidden shadow-xl"
                      />
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-8 flex items-center justify-center gap-8 md:gap-16 animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <div className="text-center">
                      <div className="font-display text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">10K+</div>
                      <div className="text-sm md:text-base text-white/80 font-medium mt-1">Active Listings</div>
                    </div>
                    <div className="w-px h-12 bg-white/20"></div>
                    <div className="text-center">
                      <div className="font-display text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">5K+</div>
                      <div className="text-sm md:text-base text-white/80 font-medium mt-1">Verified Sellers</div>
                    </div>
                    <div className="w-px h-12 bg-white/20"></div>
                    <div className="text-center">
                      <div className="font-display text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">98%</div>
                      <div className="text-sm md:text-base text-white/80 font-medium mt-1">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* SLIDE 2: Promotional Offer Banner (₹1 Ad) */}
          <CarouselItem>
            <div className="relative overflow-hidden w-full h-[500px] md:h-[600px] flex items-center">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1974&auto=format&fit=crop" alt="Promotional Offer" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

              <div className="container-tight relative z-10 w-full py-16 md:py-24">
                <div className="max-w-2xl text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold mb-6 uppercase tracking-wider shadow-lg">
                    🎉 Launch Special Offer
                  </div>

                  <h2 className="font-display text-5xl md:text-7xl font-black text-white mb-4 leading-none drop-shadow-lg">
                    Post Ads For <br /> Just <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">₹1</span>
                  </h2>

                  <p className="text-xl md:text-3xl font-light text-white/90 mb-10 drop-shadow-md">
                    Get <strong className="font-bold text-white">2 Ads FREE</strong>. <br className="hidden sm:block" />Then post your first 30 ads at ₹1 each.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button variant="default" size="xl" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-white" asChild>
                      <Link to="/post-ad">
                        Start Posting Now
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="xl" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full bg-transparent border-2 border-white text-white hover:bg-white/10 hover:text-white" asChild>
                      <Link to="/membership">
                        View Pricing
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* SLIDE 3: Earn With Us (Seller-Focused Slide) */}
          <CarouselItem>
            <div className="relative overflow-hidden w-full h-[500px] md:h-[600px] flex items-center">
              <img src="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop" alt="Sell your items" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/40" />

              <div className="container-tight relative z-10 w-full py-16 md:py-24 text-left">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-sm font-bold mb-6 uppercase tracking-wider">
                    💰 Earn With Us
                  </div>

                  <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                    Turn Your Unused <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">Items Into Cash</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-8 mb-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-colors">
                      <div className="bg-primary/20 p-3 rounded-lg text-primary">
                        <Tag className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg leading-tight">Sell Anything</h4>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-colors">
                      <div className="bg-primary/20 p-3 rounded-lg text-primary">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg leading-tight">Reach Thousands <br />of Buyers</h4>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-colors">
                      <div className="bg-primary/20 p-3 rounded-lg text-primary">
                        <PlusCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg leading-tight">Easy Ad Posting</h4>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 hover:bg-white/20 transition-colors">
                      <div className="bg-primary/20 p-3 rounded-lg text-primary">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg leading-tight">Fast Response</h4>
                      </div>
                    </div>
                  </div>

                  <Button variant="default" size="xl" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full shadow-xl bg-white text-black hover:bg-gray-100" asChild>
                    <Link to="/post-ad">
                      Start Selling Now
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* SLIDE 4: B2B / Wholesale Promotion */}
          <CarouselItem>
            <div className="relative overflow-hidden w-full h-[500px] md:h-[600px] flex items-center">
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop" alt="B2B Wholesale Operations" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-indigo-950/80 to-black/40" />

              <div className="container-tight relative z-10 w-full py-16 md:py-24 text-left">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm font-bold mb-6 uppercase tracking-wider backdrop-blur-md shadow-lg">
                    🏢 B2B / Wholesale
                  </div>

                  <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                    India’s Smart <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200">B2B Marketplace</span>
                  </h2>

                  <p className="text-xl md:text-2xl font-light text-white/90 mb-8 drop-shadow-md">
                    Buy in Bulk. Sell in Volume. <br className="hidden sm:block" /> Grow Your Business Faster.
                  </p>

                  <ul className="space-y-3 mb-10 text-white/80">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      <span className="font-medium text-white/95">Dedicated B2B / Wholesale Listings</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      <span className="font-medium text-white/95">Minimum Order Quantity (MOQ) Support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      <span className="font-medium text-white/95">Direct Business-to-Business Deals</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      <span className="font-medium text-white/95">Higher Profit. Larger Orders.</span>
                    </li>
                  </ul>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button variant="default" size="xl" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 text-white border-0" asChild>
                      <Link to="/listings?category=b2b">
                        Explore B2B Deals
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="xl" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full bg-transparent border-2 border-blue-400/50 text-white hover:bg-blue-500/10 hover:border-blue-300" asChild>
                      <Link to="/post-ad">
                        Post Wholesale Ad
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

        </CarouselContent>
        {/* Carousel Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`h-2.5 transition-all duration-300 rounded-full shadow-sm ${current === index
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/90"
                }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default HeroSection;
