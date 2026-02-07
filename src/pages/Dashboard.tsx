
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { TrustBadges } from '@/components/shared/TrustBadges';
import {
  Wallet,
  FileText,
  User,
  Settings,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Coins,
  ArrowRight,
  ShieldAlert,
  BadgeCheck,
  Heart,
  Bell,
  LogOut,
  Lock,
  Save,
  Trash2,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock user data
const mockUser = {
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '+91 98765 43210',
  bio: 'Avid collector of vintage electronics and gadgets.',
  socials: {
    facebook: '',
    instagram: '',
    twitter: ''
  },
  walletBalance: 15,
  badges: [] as string[],
  totalAds: 8,
  activeAds: 5,
  pendingAds: 2,
  rejectedAds: 1,
};

export const mockAds = [
  { id: '1', title: 'iPhone 14 Pro Max - 256GB', status: 'active', views: 234, price: 89999 },
  { id: '2', title: 'MacBook Air M2', status: 'active', views: 156, price: 84999 },
  { id: '3', title: 'Samsung Galaxy Watch', status: 'pending', views: 0, price: 15000 },
  { id: '4', title: 'Sony Headphones WH-1000XM4', status: 'pending', views: 0, price: 18000 },
  { id: '5', title: 'Old Laptop (Rejected)', status: 'rejected', views: 0, price: 5000 },
];

const mockWishlistItems = [
  { id: 'w1', title: 'Nintendo Switch OLED', price: 28000, category: 'Gaming', image: 'bg-red-100' },
  { id: 'w2', title: 'Canon EOS R50 Camera', price: 55000, category: 'Cameras', image: 'bg-blue-100' },
  { id: 'w3', title: 'Vintage Leather Jacket', price: 4500, category: 'Fashion', image: 'bg-amber-100' },
];

const sidebarLinks = [
  { icon: FileText, label: 'My Ads', href: '/dashboard', count: 8 },
  { icon: Wallet, label: 'Wallet', href: '/dashboard/wallet' },
  { icon: Heart, label: 'Wishlist', href: '/dashboard/wishlist' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const Dashboard = () => {
  const location = useLocation();
  const [user, setUser] = useState(mockUser);
  const [ads, setAds] = useState(mockAds);
  const [wishlist, setWishlist] = useState(mockWishlistItems);

  // Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    phone: user.phone,
    bio: user.bio,
    facebook: user.socials?.facebook || '',
    instagram: user.socials?.instagram || '',
    twitter: user.socials?.twitter || '',
  });

  // Determine active view based on path
  const currentPath = location.pathname;
  const isWalletView = currentPath.includes('/wallet');
  const isProfileView = currentPath.includes('/profile');
  const isSettingsView = currentPath.includes('/settings');
  const isWishlistView = currentPath.includes('/wishlist');
  const isAdsView = !isWalletView && !isProfileView && !isSettingsView && !isWishlistView;

  useEffect(() => {
    const isVerified = localStorage.getItem('isVerified') === 'true';
    if (isVerified) {
      setUser(prev => ({
        ...prev,
        badges: ['verified', 'trusted']
      }));
    }
  }, []);

  const handleMarkAsSold = (e: React.MouseEvent, adId: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    setAds(prevAds => prevAds.map(ad =>
      ad.id === adId ? { ...ad, status: 'sold' } : ad
    ));

    toast.success("Listing marked as Sold", {
      description: "Congratulations on your sale!",
    });
  };

  const handleRecharge = () => {
    setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + 50 }));
    toast.success("Wallet Recharged", {
      description: "50 Tokens added to your account.",
    });
  };

  const handleRemoveFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
    toast.info("Item removed from wishlist");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: profileForm.name,
      phone: profileForm.phone,
      bio: profileForm.bio,
      socials: {
        facebook: profileForm.facebook,
        instagram: profileForm.instagram,
        twitter: profileForm.twitter
      }
    }));
    toast.success("Profile Updated", {
      description: "Your changes have been saved successfully.",
    });
  };

  const handleChangePassword = () => {
    toast.success("Password Changed", {
      description: "You have successfully updated your password.",
    });
  };

  const handleLogoutAll = () => {
    toast.success("Logged out from all devices", {
      description: "You have been securely logged out from all other sessions.",
    });
  };

  const statusColors = {
    active: 'text-trust-green bg-trust-green/10',
    pending: 'text-amber bg-amber/10',
    rejected: 'text-destructive bg-destructive/10',
    sold: 'text-blue-600 bg-blue-100',
  };

  const statusIcons = {
    active: CheckCircle,
    pending: Clock,
    rejected: XCircle,
    sold: BadgeCheck,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container-tight py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              {/* User Card */}
              <div className="card-premium p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-foreground">
                      {user.name}
                    </div>
                    {user.badges.length > 0 ? (
                      <TrustBadges badges={user.badges as any} size="sm" />
                    ) : (
                      <div className="flex flex-col gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">Unverified User</span>
                        <Button variant="outline" size="sm" className="h-7 text-xs border-dashed border-destructive text-destructive hover:bg-destructive/5" asChild>
                          <Link to="/verification">
                            <ShieldAlert className="h-3 w-3 mr-1" />
                            Get Verified
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Wallet Balance */}
                <div className="p-4 rounded-xl bg-amber/10 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Wallet Balance</span>
                    <Coins className="h-5 w-5 text-amber" />
                  </div>
                  <div className="text-2xl font-display font-bold text-foreground">
                    {user.walletBalance} Tokens
                  </div>
                  {user.walletBalance < 5 && (
                    <p className="text-xs text-amber-dark mt-1">
                      Low balance! Recharge to post more ads.
                    </p>
                  )}
                </div>

                <Button variant="accent" className="w-full" asChild>
                  <Link to="/dashboard/wallet">
                    Recharge Wallet
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Navigation */}
              <nav className="card-premium p-2">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  // Exact match for root, startsWith for subs
                  const isActive = link.href === '/dashboard'
                    ? location.pathname === '/dashboard'
                    : location.pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{link.label}</span>
                      </div>
                      {link.count && link.href === '/dashboard' && (
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          isActive ? "bg-primary-foreground/20" : "bg-muted"
                        )}>
                          {ads.filter(a => a.status === 'active').length}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">

              {/* ADS VIEW */}
              {isAdsView && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h1 className="font-display text-2xl font-bold text-foreground">My Ads</h1>
                      <p className="text-muted-foreground">Manage your listings</p>
                    </div>
                    <Button variant="accent" asChild>
                      <Link to="/post-ad">
                        <Plus className="h-5 w-5" />
                        Post New Ad
                      </Link>
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="card-premium p-4">
                      <div className="text-2xl font-display font-bold text-foreground">{user.totalAds}</div>
                      <div className="text-sm text-muted-foreground">Total Ads</div>
                    </div>
                    <div className="card-premium p-4">
                      <div className="text-2xl font-display font-bold text-trust-green">{user.activeAds}</div>
                      <div className="text-sm text-muted-foreground">Active</div>
                    </div>
                    <div className="card-premium p-4">
                      <div className="text-2xl font-display font-bold text-amber">{user.pendingAds}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                    <div className="card-premium p-4">
                      <div className="text-2xl font-display font-bold text-destructive">{user.rejectedAds}</div>
                      <div className="text-sm text-muted-foreground">Rejected</div>
                    </div>
                  </div>

                  {/* Ads List */}
                  <div className="card-premium overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-display font-semibold">Your Listings</h3>
                    </div>
                    <div className="divide-y divide-border">
                      {ads.map((ad) => {
                        const StatusIcon = statusIcons[ad.status as keyof typeof statusIcons] || CheckCircle;
                        return (
                          <Link
                            to={`/listing/${ad.id}`}
                            key={ad.id}
                            className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-muted/50 transition-colors gap-4 block"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-12 rounded-lg bg-secondary shrink-0" />
                              <div>
                                <div className="font-medium text-foreground hover:underline">{ad.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  ₹{ad.price.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 self-end md:self-auto">
                              {ad.status === 'active' && (
                                <>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <TrendingUp className="h-4 w-4" />
                                    {ad.views} views
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="hidden md:flex h-8 gap-1"
                                    onClick={(e) => handleMarkAsSold(e, ad.id)}
                                  >
                                    <BadgeCheck className="h-3.5 w-3.5" />
                                    Mark Sold
                                  </Button>
                                </>
                              )}
                              <span className={cn(
                                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium capitalize whitespace-nowrap",
                                statusColors[ad.status as keyof typeof statusColors]
                              )}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                {ad.status}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* WALLET VIEW */}
              {isWalletView && (
                <div className="space-y-6">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">Wallet</h1>
                    <p className="text-muted-foreground">Manage your tokens and transactions</p>
                  </div>

                  <div className="card-premium p-8 flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-amber/10 flex items-center justify-center">
                      <Coins className="h-10 w-10 text-amber" />
                    </div>
                    <div>
                      <div className="text-4xl font-display font-bold text-foreground">{user.walletBalance}</div>
                      <div className="text-muted-foreground">Available Tokens</div>
                    </div>
                    <Button size="lg" className="w-full max-w-sm gap-2" onClick={handleRecharge}>
                      <Plus className="h-5 w-5" />
                      Add 50 Tokens (Mock)
                    </Button>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                      In a real application, this would redirect to a payment gateway. For this demo, clicking the button instantly adds tokens.
                    </p>
                  </div>

                  <div className="card-premium">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-display font-semibold">Transaction History</h3>
                    </div>
                    <div className="p-8 text-center text-muted-foreground">
                      No recent transactions found.
                    </div>
                  </div>
                </div>
              )}

              {/* WISHLIST VIEW */}
              {isWishlistView && (
                <div className="space-y-6">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">My Wishlist</h1>
                    <p className="text-muted-foreground">Saved items you are interested in</p>
                  </div>

                  {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlist.map(item => (
                        <div key={item.id} className="card-premium flex gap-4 overflow-hidden group">
                          <div className={`w-32 bg-secondary ${item.image}`} />
                          <div className="flex-1 p-4 pl-0 flex flex-col justify-between">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">{item.category}</div>
                              <h3 className="font-semibold text-lg leading-tight mb-1">{item.title}</h3>
                              <div className="font-bold text-primary">₹{item.price.toLocaleString()}</div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" className="flex-1">View Details</Button>
                              <Button size="icon" variant="ghost" onClick={() => handleRemoveFromWishlist(item.id)} className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="card-premium p-12 text-center">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                      <h3 className="text-lg font-semibold">Your wishlist is empty</h3>
                      <p className="text-muted-foreground mb-6">Start exploring and save items you like!</p>
                      <Button asChild>
                        <Link to="/">Explore Listings</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE VIEW */}
              {isProfileView && (
                <div className="max-w-2xl">
                  <div className="mb-6">
                    <h1 className="font-display text-2xl font-bold text-foreground">Edit Profile</h1>
                    <p className="text-muted-foreground">Update your personal information</p>
                  </div>

                  <div className="card-premium p-6">
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="flex items-center gap-6 mb-6">
                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-3xl font-display text-muted-foreground">
                          {user.name.charAt(0)}
                        </div>
                        <Button variant="outline" type="button">Change Avatar</Button>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" value={user.email} disabled className="bg-muted" />
                          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          rows={4}
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell buyers a bit about yourself..."
                        />
                      </div>

                      {/* Social Links */}
                      <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          Social Links
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="facebook" className="flex items-center gap-2">
                              <Facebook className="h-4 w-4 text-blue-600" />
                              Facebook
                            </Label>
                            <Input
                              id="facebook"
                              placeholder="https://facebook.com/username"
                              value={profileForm.facebook}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, facebook: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="instagram" className="flex items-center gap-2">
                              <Instagram className="h-4 w-4 text-pink-600" />
                              Instagram
                            </Label>
                            <Input
                              id="instagram"
                              placeholder="https://instagram.com/username"
                              value={profileForm.instagram}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, instagram: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twitter" className="flex items-center gap-2">
                              <Twitter className="h-4 w-4 text-sky-500" />
                              Twitter
                            </Label>
                            <Input
                              id="twitter"
                              placeholder="https://twitter.com/username"
                              value={profileForm.twitter}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, twitter: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button type="submit" className="gap-2">
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* SETTINGS VIEW */}
              {isSettingsView && (
                <div className="max-w-2xl space-y-8">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground">Manage your account preferences</p>
                  </div>

                  {/* Account Security */}
                  <div className="card-premium p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Lock className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Security</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Current Password</Label>
                          <Input type="password" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>New Password</Label>
                          <Input type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label>Confirm Password</Label>
                          <Input type="password" />
                        </div>
                      </div>
                      <Button onClick={handleChangePassword} variant="outline" className="mt-2">Update Password</Button>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="card-premium p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Bell className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Notifications</h2>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive updates about your listings and account.</p>
                        </div>
                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive real-time alerts on your device.</p>
                        </div>
                        <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                      </div>
                    </div>
                  </div>

                  {/* Session Management */}
                  <div className="card-premium p-6 border-destructive/20">
                    <div className="flex items-center gap-3 mb-6">
                      <LogOut className="h-5 w-5 text-destructive" />
                      <h2 className="text-lg font-semibold text-destructive">Session Management</h2>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        If you believe your account has been compromised, you can log out from all devices.
                      </p>
                      <Button variant="destructive" onClick={handleLogoutAll}>Log out from all devices</Button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
