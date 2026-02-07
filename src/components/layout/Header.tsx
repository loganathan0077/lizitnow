import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
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

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container-tight">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">T</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground hidden sm:block">
              TrustMart
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for products, brands, or categories..."
                className="w-full h-11 pl-12 pr-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Post Ad Button */}
            <Button variant="accent" size="lg" className="hidden sm:flex" asChild>
              <Link to="/post-ad">
                <Plus className="h-5 w-5" />
                <span>Post Ad</span>
              </Link>
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
                </Button>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-border relative">
                    <User className="h-5 w-5 text-primary" />
                    {isVerified && (
                      <BadgeCheck className="absolute -bottom-1 -right-1 h-4 w-4 text-blue-500 bg-card rounded-full" />
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-secondary hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </button>
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
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
