import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, ShieldCheck, Tag, Users } from 'lucide-react';
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
  const [count, setCount] = useState(4);

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
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
    <section className="relative w-full overflow-hidden bg-background">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full relative"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
          align: "start",
        }}
      >
        {/* Carousel Content Container */}
        <CarouselContent className="m-0 flex">

          {/* SLIDE 1: Trust & Marketplace */}
          <CarouselItem className="p-0">
            <div className="relative w-full h-[550px] md:h-[600px] flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop" alt="Marketplace" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

              <div className="relative z-10 w-full px-6 md:px-12 flex flex-col justify-center h-full pb-12 pt-8 text-left md:text-center max-w-7xl mx-auto">
                <div className="max-w-3xl mx-auto md:mx-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs md:text-sm font-medium mb-4 md:mb-6 animate-fade-in border border-white/20">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>India's Most Trusted Marketplace</span>
                  </div>

                  <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 animate-slide-up leading-tight drop-shadow-lg">
                    Smart Deals <br className="md:hidden" />
                    <span className="text-primary italic">Start Here</span>
                  </h1>

                  <p className="text-lg md:text-2xl text-white/90 mb-6 md:mb-10 max-w-2xl mx-auto md:mx-auto animate-slide-up drop-shadow-md font-light">
                    Simple, safe, and smooth deals every time.
                  </p>

                  <div className="max-w-xl mx-auto md:mx-auto mb-6 md:mb-10 animate-slide-up relative">
                    <div className="relative flex items-center bg-white p-1 rounded-full shadow-2xl">
                      <Search className="absolute left-6 text-muted-foreground w-5 h-5 hidden sm:block" />
                      <input
                        type="text"
                        placeholder={`Search ${selectedLocation === 'All Locations' ? 'All India' : selectedLocation}...`}
                        className="w-full h-12 md:h-14 pl-5 sm:pl-14 pr-24 sm:pr-40 rounded-full bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 text-sm sm:text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      />
                      <Button
                        variant="default"
                        size="default"
                        className="absolute right-1 h-10 md:h-12 rounded-full px-5 sm:px-8 text-xs sm:text-base font-bold"
                        onClick={handleSearch}
                      >
                        Search
                      </Button>
                    </div>
                    {showSuggestions && (
                      <SearchSuggestions query={searchQuery} onClose={() => setShowSuggestions(false)} className="text-left absolute top-full left-0 mt-2 w-full z-50 rounded-2xl overflow-hidden shadow-xl" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* SLIDE 2: B2B / Wholesale */}
          <CarouselItem className="p-0">
            <div className="relative w-full h-[550px] md:h-[600px] flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop" alt="B2B Wholesale" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40" />

              <div className="relative z-10 w-full px-6 md:px-12 flex flex-col justify-center h-full pb-12 pt-8 text-left max-w-7xl mx-auto">
                <div className="max-w-2xl mx-auto md:mx-0">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 text-xs md:text-sm font-medium mb-4 md:mb-6 backdrop-blur-md shadow-lg">
                    🏢 B2B / Wholesale
                  </div>

                  <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
                    India’s Smart <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200">B2B Marketplace</span>
                  </h2>

                  <p className="text-lg md:text-2xl font-light text-white/90 mb-6 md:mb-10 drop-shadow-md pr-4">
                    Buy in Bulk. Sell in Volume. <br className="hidden sm:block" /> Grow Your Business Faster.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Button variant="default" size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 h-12 md:h-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-white" asChild>
                      <Link to="/listings?category=b2b" className="w-full justify-center">
                        Explore B2B Deals
                        <ArrowRight className="h-5 w-5 ml-2 hidden sm:block" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 h-12 md:h-14 rounded-full bg-transparent border-2 border-white text-white hover:bg-white/10" asChild>
                      <Link to="/post-ad" className="w-full justify-center">
                        Post Wholesale Ad
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* SLIDE 3: Promotional Offer */}
          <CarouselItem className="p-0">
            <div className="relative w-full h-[550px] md:h-[600px] flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1974&auto=format&fit=crop" alt="Offer" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

              <div className="relative z-10 w-full px-6 md:px-12 flex flex-col justify-center h-full pb-12 pt-8 text-left max-w-7xl mx-auto">
                <div className="max-w-2xl mx-auto md:mx-0">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs md:text-sm font-bold mb-4 md:mb-6 uppercase tracking-wider shadow-lg">
                    🎉 Launch Special Offer
                  </div>

                  <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
                    Post Ads For <br /> Just <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">₹1</span>
                  </h2>

                  <p className="text-lg md:text-2xl font-light text-white/90 mb-6 md:mb-10 drop-shadow-md pr-4">
                    Get <strong className="font-bold text-white">2 Ads FREE</strong>. <br className="hidden sm:block" />Then post your first 30 ads at ₹1 each.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Button variant="default" size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 h-12 md:h-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-white" asChild>
                      <Link to="/post-ad" className="w-full justify-center">
                        Start Posting Now
                        <ArrowRight className="h-5 w-5 ml-2 hidden sm:block" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 h-12 md:h-14 rounded-full bg-transparent border-2 border-white text-white hover:bg-white/10" asChild>
                      <Link to="/membership" className="w-full justify-center">
                        View Pricing
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* SLIDE 4: Earn With Us */}
          <CarouselItem className="p-0">
            <div className="relative w-full h-[550px] md:h-[600px] flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop" alt="Earn" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/40" />

              <div className="relative z-10 w-full px-6 md:px-12 flex flex-col justify-center h-full pb-12 pt-8 text-left max-w-7xl mx-auto">
                <div className="max-w-2xl mx-auto md:mx-0">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs md:text-sm font-bold mb-4 md:mb-6 uppercase tracking-wider">
                    💰 Earn With Us
                  </div>

                  <h2 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg">
                    Turn Your Unused <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">Items Into Cash</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-10 pr-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-xl flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded-lg text-primary">
                        <Tag className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <h4 className="text-white font-bold text-sm md:text-lg">Sell Anything</h4>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-xl flex items-center gap-3">
                      <div className="bg-primary/20 p-2 rounded-lg text-primary">
                        <Users className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <h4 className="text-white font-bold text-sm md:text-lg">Reach Buyers</h4>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Button variant="default" size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 h-12 md:h-14 rounded-full shadow-xl bg-white text-black hover:bg-gray-100" asChild>
                      <Link to="/post-ad" className="w-full justify-center">
                        Start Selling Now
                        <ArrowRight className="h-5 w-5 ml-2 hidden sm:block" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

        </CarouselContent>

        {/* Carousel Dots / Pagination - Absolutely centered AT THE BOTTOM of the slider container */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-30">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`h-2 transition-all duration-300 rounded-full shadow-sm ${current === index
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/90"
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
