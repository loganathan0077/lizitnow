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
  LogIn,
  CheckCircle2,
  MessageSquare,
  ShoppingBag,
  CreditCard,
  BellRing,
  LogOut,
  Heart,
  Settings,
  FileText,
  ChevronDown,
  UserPlus,
  LayoutDashboard
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocationContext } from '@/context/LocationContext';
import { locations } from '@/data/mockData';
import { LocationFilter } from '../shared/LocationFilter';
import SearchSuggestions from '../shared/SearchSuggestions';
import CategoryNav from './CategoryNav';
import { MobileCategoryAccordion } from './MobileCategoryAccordion';
import { toast } from 'sonner';

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
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('isVerified');
    toast.success('Logged out successfully');
    navigate('/');
    // Force re-render
    window.location.href = '/';
  };

  interface Notification {
    id: string;
    type: 'success' | 'message' | 'alert' | 'sale';
    title: string;
    message: string;
    time: string;
    read: boolean;
    link?: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Ad Approved',
      message: 'Your ad "iPhone 14 Pro" has been approved.',
      time: '2 mins ago',
      read: false,
      link: '/dashboard',
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      message: 'You received a new message from Rahul.',
      time: '1 hour ago',
      read: false,
      link: '/dashboard',
    },
    {
      id: '3',
      type: 'sale',
      title: 'Item Sold',
      message: 'Your ad has been marked as sold.',
      time: '1 day ago',
      read: true,
      link: '/dashboard',
    },
    {
      id: '4',
      type: 'alert',
      title: 'Wallet Update',
      message: 'Wallet recharge of ₹20 successful.',
      time: '2 days ago',
      read: true,
      link: '/dashboard/wallet',
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: string, link?: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    if (link) {
      navigate(link);
    }
  };

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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
            <div className="relative w-full flex items-center bg-background rounded-lg border-2 border-primary/30 shadow-sm overflow-hidden h-10 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
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

            {/* Notifications - Only show when logged in */}
            {isAuthenticated && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-secondary text-foreground group">
                    <Bell className="h-5 w-5 group-hover:text-primary transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white border-2 border-background">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 md:w-96 p-0" align="end" sideOffset={8}>
                  <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[65vh] overflow-y-auto bg-card">
                    {notifications.length > 0 ? (
                      <div className="flex flex-col">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif.id, notif.link)}
                            className={`flex items-start gap-4 p-4 border-b border-border transition-colors hover:bg-muted/50 cursor-pointer ${!notif.read ? 'bg-primary/5' : ''}`}
                          >
                            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                              notif.type === 'message' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                notif.type === 'sale' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                                  'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                              }`}>
                              {notif.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                              {notif.type === 'message' && <MessageSquare className="h-4 w-4" />}
                              {notif.type === 'sale' && <ShoppingBag className="h-4 w-4" />}
                              {notif.type === 'alert' && <CreditCard className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className={`text-sm ${!notif.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                                {notif.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notif.time}
                              </p>
                            </div>
                            {!notif.read && (
                              <div className="w-2 h-2 mt-2 rounded-full bg-trust-blue flex-shrink-0"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center flex flex-col items-center justify-center text-muted-foreground bg-card">
                        <BellRing className="h-8 w-8 mb-3 opacity-20" />
                        <p className="font-medium">No notifications yet</p>
                        <p className="text-sm mt-1">Start posting ads to receive updates.</p>
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-border bg-muted/20">
                    <Link to="/dashboard" onClick={() => document.body.click()}>
                      <Button variant="ghost" className="w-full text-xs font-medium justify-center h-8">
                        View All Notifications
                      </Button>
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>
            )}

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
                <div className="relative" onMouseEnter={() => setIsAccountOpen(true)} onMouseLeave={() => setIsAccountOpen(false)}>
                  <Button variant="ghost" className="hidden lg:flex items-center gap-2 hover:bg-secondary">
                    <User className="h-4 w-4" />
                    <span className="font-medium">My Account</span>
                    {isVerified && <BadgeCheck className="h-4 w-4 text-trust-blue ml-1" />}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isAccountOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {isAccountOpen && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="p-1.5">
                        <Link to="/dashboard" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                          <User className="h-4 w-4 text-muted-foreground" />
                          Dashboard
                        </Link>
                        <Link to="/dashboard/listings" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          My Listings
                        </Link>
                        <Link to="/dashboard/wallet" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                          Wallet
                        </Link>
                        <Link to="/dashboard/wishlist" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          Wishlist
                        </Link>
                        <Link to="/dashboard/settings" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors">
                          <Settings className="h-4 w-4 text-muted-foreground" />
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-border p-1.5">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Overlay Container */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute top-0 right-0 h-[100vh] w-[80%] max-w-[320px] bg-background shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out p-5 flex flex-col z-10 animate-slide-left">

            {/* Header & Close Button */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border text-foreground tracking-tight">
              <div className="font-display font-bold text-lg flex items-center gap-2">
                <Menu className="h-5 w-5 text-primary" /> Menu
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-3">
              {!isAuthenticated ? (
                <>
                  <Button variant="outline" className="w-full justify-start h-12 rounded-xl text-base text-foreground font-semibold" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/login">
                      <LogIn className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button variant="accent" className="w-full justify-start h-12 rounded-xl text-base shadow-sm font-semibold" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/register">
                      <UserPlus className="h-5 w-5 mr-3" />
                      <span>Register</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start h-12 rounded-xl text-base font-semibold hover:bg-secondary/80" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/dashboard">
                      <LayoutDashboard className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>Dashboard</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-12 rounded-xl text-base font-semibold hover:bg-secondary/80" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/dashboard/listings">
                      <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>My Listings</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-12 rounded-xl text-base font-semibold hover:bg-secondary/80" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/dashboard/wallet">
                      <Wallet className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>Wallet</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-12 rounded-xl text-base font-semibold hover:bg-secondary/80" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/dashboard/wishlist">
                      <Heart className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>Wishlist</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-12 rounded-xl text-base font-semibold hover:bg-secondary/80" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/dashboard/settings">
                      <Settings className="h-5 w-5 mr-3 text-muted-foreground" />
                      <span>Settings</span>
                    </Link>
                  </Button>

                  <div className="border-t border-border mt-4 pt-4">
                    <button
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="flex items-center px-4 py-4 rounded-xl text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                    >
                      <LogOut className="h-5 w-5 mr-3 shrink-0" />
                      <span className="font-semibold text-base">Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
