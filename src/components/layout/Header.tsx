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
      <div className="bg-background text-foreground border-b border-border/40 relative z-20">
        <div className="container-tight h-16 md:h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="Liztitnow.com Logo"
              className="h-9 md:h-11 object-contain hover:opacity-90 transition-opacity drop-shadow-sm"
            />
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

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3 ml-4">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-secondary text-foreground"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-secondary text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
            </Button>

            {/* Post Ad Button */}
            <Link to="/post-ad" className="shrink-0">
              <Button className="font-medium shadow-sm hover:shadow-md transition-all gap-2 rounded-full px-5 bg-gradient-to-r from-primary to-olive hover:from-primary/90 hover:to-olive/90 text-white border-0">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Post Ad</span>
              </Button>
            </Link>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3 ml-1">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="ghost" className="hidden lg:flex items-center gap-2 hover:bg-secondary">
                    <User className="h-4 w-4" />
                    <span className="font-medium">My Account</span>
                    {isVerified && <BadgeCheck className="h-4 w-4 text-trust-blue ml-1" />}
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" className="font-medium hover:bg-secondary group hidden sm:flex">
                    <LogIn className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

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
