import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Search,
  Menu,
  X,
  Bell,
  User,
  Plus,
  BadgeCheck,
  Wallet,
  LogIn
} from 'lucide-react';
import { useLocationContext } from '@/context/LocationContext';
import { locations } from '@/data/mockData';
import { LocationFilter } from '../shared/LocationFilter';
import SearchSuggestions from '../shared/SearchSuggestions';
import CategoryNav from './CategoryNav';
import { MobileCategoryAccordion } from './MobileCategoryAccordion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { location: selectedLocation, setLocation: setSelectedLocation } = useLocationContext();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isVerified = localStorage.getItem('isVerified') === 'true';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const loc = params.get('location');
    if (loc && loc !== selectedLocation) {
      setSelectedLocation(loc);
    }
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);

  const handleSearch = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;

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
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col w-full shadow-md">
      {/* Top Main Header */}
      <div className="bg-primary text-primary-foreground relative z-20">
        <div className="container-tight h-16 md:h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center group-hover:bg-primary-foreground/30 transition-colors">
              <span className="text-primary-foreground font-display font-bold text-xl">L</span>
            </div>
            <span className="font-display text-xl font-bold text-primary-foreground hidden sm:block tracking-wide">
              Liztitnow.com
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-12 relative">
            <div className="relative w-full flex items-center bg-background rounded-sm shadow-sm overflow-hidden h-10 focus-within:ring-2 focus-within:ring-primary-foreground/50 transition-all">
              <div className="w-[150px] border-r border-border/40 bg-muted/30 flex-shrink-0">
                <LocationFilter
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  className="h-full w-full border-0 px-3 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 focus:ring-0 text-[13px] font-medium transition-colors text-foreground"
                  placeholder="Location"
                />
              </div>
              <div className="relative flex-1 h-full flex items-center bg-background">
                <Search
                  className="absolute left-3.5 h-4 w-4 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full h-full pl-10 pr-12 bg-transparent border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                <Button
                  size="sm"
                  className="absolute right-0 h-full px-5 rounded-none bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold text-[13px]"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
            {showSuggestions && (
              <SearchSuggestions
                query={searchQuery}
                onClose={() => setShowSuggestions(false)}
              />
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Post Ad Button */}
            <Button variant="outline" size="sm" className="hidden sm:flex bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground hover:text-primary transition-colors h-9" asChild>
              <Link to="/post-ad">
                <Plus className="h-4 w-4 mr-1" />
                <span className="font-semibold">Post Ad</span>
              </Link>
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-5">
                <button className="relative text-primary-foreground/90 hover:text-primary-foreground transition-colors group">
                  <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-destructive rounded-full border border-primary" />
                </button>
                <Link to="/dashboard" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center relative group-hover:bg-primary-foreground/30 transition-colors">
                    <User className="h-4 w-4 text-primary-foreground" />
                    {isVerified && (
                      <BadgeCheck className="absolute -bottom-1 -right-1 h-[14px] w-[14px] text-blue-500 bg-card rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-primary-foreground hidden lg:block group-hover:text-primary-foreground/80">Account</span>
                </Link>
              </div>
            ) : (
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground hidden sm:flex font-semibold" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Category Nav - Separated Bottom Tier */}
      <div className="hidden md:block bg-card border-b border-border shadow-sm relative z-10">
        <div className="container-tight">
          <CategoryNav />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden pb-4 animate-slide-up">
          {/* Mobile Search */}
          <div className="relative mb-4">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={handleSearch}
            />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full h-11 pl-12 pr-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-2">
            {!isAuthenticated && (
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/login">
                  <LogIn className="h-5 w-5" />
                  <span>Login / Sign Up</span>
                </Link>
              </Button>
            )}

            <Button variant="accent" className="w-full justify-start" asChild>
              <Link to={isAuthenticated ? "/post-ad" : "/login"}>
                <Plus className="h-5 w-5" />
                <span>Post Ad</span>
              </Link>
            </Button>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard/wallet"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary"
                >
                  <Wallet className="h-5 w-5 text-amber" />
                  <span className="font-semibold">0 Tokens</span>
                </Link>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/dashboard">
                    <User className="h-5 w-5" />
                    <span>My Dashboard</span>
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Dynamic Mobile Categories Accordion */}
          <div className="max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            <MobileCategoryAccordion onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
