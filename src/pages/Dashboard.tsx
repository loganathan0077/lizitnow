
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
  Twitter,
  Copy,
  Star,
  CreditCard,
  Download,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

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
  { icon: FileText, label: 'Billing History', href: '/dashboard/billing' },
  { icon: Heart, label: 'Wishlist', href: '/dashboard/wishlist' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [ads, setAds] = useState(mockAds);
  const [wishlist, setWishlist] = useState(mockWishlistItems);

  // Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
    bio: '',
    facebook: '',
    instagram: '',
    twitter: '',
    isGstRegistered: false,
    gstin: '',
  });

  // Determine active view based on path
  const currentPath = location.pathname;
  const isWalletView = currentPath.includes('/wallet');
  const isBillingView = currentPath.includes('/billing');
  const isProfileView = currentPath.includes('/profile');
  const isSettingsView = currentPath.includes('/settings');
  const isWishlistView = currentPath.includes('/wishlist');
  const isAdsView = !isWalletView && !isBillingView && !isProfileView && !isSettingsView && !isWishlistView;

  const [billingHistory, setBillingHistory] = useState<any[]>([]);

  // Recharge Modal State
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState<number | ''>(50);

  useEffect(() => {
    if (isBillingView && user) {
      const fetchBilling = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('http://localhost:5001/api/user/billing-history', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) setBillingHistory(data.payments);
        } catch (e) {
          console.error(e);
        }
      };
      fetchBilling();
    }
  }, [isBillingView, user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        const res = await fetch('http://localhost:5001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          const fetchedUser = data.user;
          // Add mock values required by existing UI temporarily
          fetchedUser.badges = ['verified'];
          fetchedUser.totalAds = 0; fetchedUser.activeAds = 0; fetchedUser.pendingAds = 0; fetchedUser.rejectedAds = 0;
          fetchedUser.bio = ''; fetchedUser.socials = { facebook: '', instagram: '', twitter: '' };

          setUser(fetchedUser);
          setProfileForm({
            name: fetchedUser.name,
            phone: fetchedUser.phone || '',
            address: fetchedUser.address || '',
            bio: '',
            facebook: fetchedUser.facebookUrl || '',
            instagram: fetchedUser.instagramUrl || '',
            twitter: fetchedUser.twitterUrl || '',
            isGstRegistered: !!fetchedUser.gstin,
            gstin: fetchedUser.gstin || ''
          });
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          navigate('/login');
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, [navigate]);

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

  const handleRechargeSubmit = async () => {
    if (!rechargeAmount || rechargeAmount < 20) {
      toast.error('Minimum recharge amount is ₹20');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: Number(rechargeAmount) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      const options = {
        key: 'rzp_test_mock_key',
        amount: data.amount,
        currency: data.currency,
        name: 'Liztitnow.com',
        description: 'Wallet Recharge',
        order_id: data.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch('http://localhost:5001/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id || 'mock_pay_id',
              razorpay_signature: response.razorpay_signature || 'mock_signature'
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            toast.success('Wallet Recharged Successfully!');
            setIsRechargeModalOpen(false);
            setUser((prev: any) => ({ ...prev, walletBalance: verifyData.walletBalance }));
          } else {
            toast.error('Payment verification failed');
          }
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Failed to initiate payment');
    }
  };

  const handleRemoveFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
    toast.info("Item removed from wishlist");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: profileForm.name,
          phone: profileForm.phone,
          address: profileForm.address,
          gstin: profileForm.gstin,
          facebookUrl: profileForm.facebook,
          instagramUrl: profileForm.instagram,
          twitterUrl: profileForm.twitter
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setUser(prev => ({
        ...prev,
        ...data.user,
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
    } catch (err: any) {
      toast.error(err.message);
    }
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

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const isMember = user.membershipExpiry && new Date(user.membershipExpiry) > new Date();

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

                {/* Wallet Section */}
                <div className="p-4 rounded-xl bg-amber/10 mb-4 border border-amber/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-amber-dark">Wallet Balance</span>
                    <Coins className="h-5 w-5 text-amber" />
                  </div>
                  <div className="text-3xl font-display font-bold text-foreground mb-1">
                    ₹{user.walletBalance}
                  </div>
                  <div className="text-xs text-muted-foreground mb-4 font-medium">
                    Minimum recharge ₹20
                  </div>
                  <Button variant="outline" className="w-full bg-background hover:bg-amber text-amber-dark hover:text-amber-950 transition-colors" onClick={() => setIsRechargeModalOpen(true)}>
                    Recharge Wallet
                  </Button>
                </div>

                {/* Posting Info Section */}
                <div className="p-4 rounded-xl border border-border bg-card mb-4 shadow-sm">
                  <h4 className="font-semibold text-sm mb-4 text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Posting Status
                  </h4>

                  {/* Free Ads */}
                  <div className="mb-5">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground font-medium">Free Ads Remaining</span>
                      <span className="font-bold text-trust-green">2 / 2</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div className="bg-trust-green h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>

                  {/* Paid Ads */}
                  <div>
                    <div className="flex justify-between text-sm mb-1.5 gap-2">
                      <span className="text-muted-foreground font-medium truncate">Paid Ads Used <span className="text-xs">(₹1 offer)</span></span>
                      <span className="font-bold text-primary shrink-0">0 / 30</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
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
                      <div className="text-4xl font-display font-bold text-foreground">₹{user.walletBalance}</div>
                      <div className="text-muted-foreground">Available Balance</div>
                    </div>

                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Recharge your wallet to take advantage of our Launch Offer.
                      Post up to 30 ads at just ₹1 per ad! Minimum recharge is ₹20.
                    </p>
                    <Button variant="accent" size="lg" className="min-w-[200px]" onClick={() => setIsRechargeModalOpen(true)}>
                      Recharge Wallet
                    </Button>
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

              {/* BILLING HISTORY VIEW */}
              {isBillingView && (
                <div className="space-y-6">
                  <div>
                    <h1 className="font-display text-2xl font-bold text-foreground">Billing History</h1>
                    <p className="text-muted-foreground">View and download your past invoices</p>
                  </div>

                  <div className="card-premium overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-display font-semibold">Your Invoices</h3>
                    </div>
                    {billingHistory.length > 0 ? (
                      <div className="divide-y divide-border">
                        {billingHistory.map((invoice: any) => (
                          <div key={invoice.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-muted/50 transition-colors gap-4">
                            <div>
                              <div className="font-medium text-foreground">{invoice.planName}</div>
                              <div className="text-sm text-muted-foreground">
                                {invoice.invoiceNumber || 'Processing'} • {new Date(invoice.paymentDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="font-bold">₹{invoice.amount.toLocaleString()}</div>
                              <span className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize bg-trust-green/10 text-trust-green whitespace-nowrap">
                                {invoice.status}
                              </span>
                              <Button size="sm" variant="outline" className="gap-2" asChild>
                                <a href={`http://localhost:5001/api/invoices/${invoice.id}/download?token=${localStorage.getItem('token')}&action=view`} target="_blank" rel="noreferrer">
                                  <Eye className="h-4 w-4" /> View
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" className="gap-2" asChild>
                                <a href={`http://localhost:5001/api/invoices/${invoice.id}/download?token=${localStorage.getItem('token')}&action=download`} target="_blank" rel="noreferrer">
                                  <Download className="h-4 w-4" /> Download
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-semibold">No billing history found</h3>
                        <p className="text-muted-foreground mb-6">You haven't made any purchases yet.</p>
                      </div>
                    )}
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                          />
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

                      <div className="space-y-4 p-5 border border-border rounded-xl bg-secondary/10">
                        <h3 className="font-semibold text-foreground mb-2">Business Settings</h3>
                        <div className="flex items-center gap-2 mb-4">
                          <input
                            type="checkbox"
                            id="dashboardGstRegistered"
                            checked={profileForm.isGstRegistered}
                            onChange={(e) => {
                              setProfileForm(prev => ({
                                ...prev,
                                isGstRegistered: e.target.checked,
                                gstin: e.target.checked ? prev.gstin : ''
                              }));
                            }}
                            className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary/20"
                          />
                          <Label htmlFor="dashboardGstRegistered">
                            I am GST Registered
                          </Label>
                        </div>

                        {profileForm.isGstRegistered && (
                          <div className="space-y-2">
                            <Label htmlFor="gstin">GSTIN / GST Number</Label>
                            <Input
                              id="gstin"
                              value={profileForm.gstin}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, gstin: e.target.value.toUpperCase() }))}
                              placeholder="e.g. 07AAAAA0000A1Z5"
                              className="uppercase"
                              required={profileForm.isGstRegistered}
                              pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                              title="Please enter a valid 15-character Indian GSTIN"
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" value={user.email} disabled className="bg-muted" />
                          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Full Address</Label>
                          <Textarea
                            id="address"
                            rows={3}
                            value={profileForm.address}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Enter your complete billing address..."
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

      {/* Recharge Wallet Modal */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Recharge Wallet</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsRechargeModalOpen(false)}>
                <XCircle className="h-6 w-6" />
              </Button>
            </div>

            <p className="text-muted-foreground mb-6">
              Add funds to your wallet to post ads at just ₹1 per ad!
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Recharge Amount (₹)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    min="20"
                    className="pl-8 text-lg font-bold"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                {rechargeAmount !== '' && rechargeAmount < 20 && (
                  <p className="text-xs text-destructive mt-1">Minimum recharge amount is ₹20.</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 py-2">
                {[20, 50, 100].map(amt => (
                  <Button
                    key={amt}
                    type="button"
                    variant={rechargeAmount === amt ? 'accent' : 'outline'}
                    onClick={() => setRechargeAmount(amt)}
                  >
                    ₹{amt}
                  </Button>
                ))}
              </div>

              <Button
                variant="accent"
                className="w-full mt-2 text-lg h-12"
                onClick={handleRechargeSubmit}
                disabled={rechargeAmount === '' || rechargeAmount < 20}
              >
                Proceed to Pay {rechargeAmount ? `₹${rechargeAmount}` : ''}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
