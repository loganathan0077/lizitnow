import API_BASE from '@/lib/api';

import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ReputationBadge } from '@/components/shared/ReputationBadge';
import { TrustBadges } from '@/components/shared/TrustBadges';
import {
    User,
    MapPin,
    Calendar,
    MessageCircle,
    Flag,
    Share2,
    CheckCircle2,
    Smartphone,
    Mail,
    Star,
    ShoppingBag,
    AlertCircle,
    Ban,
    Facebook,
    Instagram,
    Twitter,
    Camera
} from 'lucide-react';
import { ReportDialog } from '@/components/shared/ReportDialog';
import { Seller } from '@/types/marketplace';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

const SellerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);

    const [fetchedSeller, setFetchedSeller] = useState<any>(null);
    const [fetchedAds, setFetchedAds] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchMe = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch(`${API_BASE}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setCurrentUser(data.user);
            } catch (e) {
                console.error(e);
            }
        };
        fetchMe();

        const fetchSeller = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/seller/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setFetchedSeller(data.seller);
                    setFetchedAds(data.ads || []);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchSeller();
    }, [id]);

    // Build seller display from fetched data only
    const seller = fetchedSeller ? {
        id: fetchedSeller.id,
        name: fetchedSeller.name,
        badges: fetchedSeller.isGstVerified ? ['verified' as const] : [],
        memberSince: new Date(fetchedSeller.createdAt).getFullYear().toString(),
        adsPosted: fetchedSeller.adsPosted || 0,
        responseRate: 95,
        tier: 'Bronze' as const,
        stats: {
            itemsSold: 0,
            completionRate: 0,
            transactionCount: 0,
            disputeCount: 0,
            responseTime: 'Usually within 1 hour'
        },
        followers: 0,
        rating: 0,
        reviews: [] as any[],
        isVerifiedMobile: false,
        isVerifiedEmail: !!fetchedSeller.email,
        facebookUrl: fetchedSeller.facebookUrl,
        instagramUrl: fetchedSeller.instagramUrl,
        twitterUrl: fetchedSeller.twitterUrl,
        bannerImage: fetchedSeller.bannerImage,
        avatarUrl: fetchedSeller.avatarUrl,
    } : null;

    // Transform fetched ads for ListingCard
    const displayAds = fetchedAds.map((ad: any) => {
        let imgs: string[] = [];
        try { imgs = typeof ad.images === 'string' ? JSON.parse(ad.images) : (ad.images || []); } catch { imgs = []; }
        return {
            ...ad,
            images: imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'],
            category: ad.category?.slug || '',
            condition: ad.condition || 'used',
            seller: seller ? { id: seller.id, name: seller.name, badges: seller.badges } : { id: '', name: 'Seller', badges: [] },
        };
    });

    const isOwner = currentUser?.id === id;


    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        if (!isFollowing) {
            toast.success(`You are now following ${seller?.name}`);
        } else {
            toast.info(`Unfollowed ${seller?.name}`);
        }
    };

    const handleReport = () => {
        toast('Report Submitted', {
            description: 'We have received your report and will investigate.',
        });
    };

    const handleBlock = () => {
        toast.error(`Blocked ${seller?.name}`, {
            description: "You will no longer see listings from this seller."
        });
    };

    const handleChat = () => {
        if (!localStorage.getItem('token')) {
            toast.error('Please login to chat with sellers.');
            navigate('/login');
            return;
        }
        if (isOwner) {
            toast.error("You cannot chat with yourself.");
            return;
        }
        navigate(`/messages/${id}`);
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size must be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64Image = reader.result;
            setIsUploading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE}/api/user/banner`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ bannerImage: base64Image })
                });

                if (res.ok) {
                    toast.success('Profile banner updated successfully');
                    setFetchedSeller((prev: any) => ({ ...prev, bannerImage: base64Image }));
                } else {
                    toast.error('Failed to update banner');
                }
            } catch (err) {
                console.error(err);
                toast.error('An error occurred while uploading');
            } finally {
                setIsUploading(false);
            }
        };
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-12">
                <div className="container max-w-5xl">

                    {/* Banner Image Area */}
                    <div className="relative w-full h-48 md:h-64 rounded-t-3xl overflow-hidden group border border-border bg-muted">
                        {seller?.bannerImage ? (
                            <img src={seller?.bannerImage} alt="Profile Cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden">
                                {/* Abstract pattern for default cover */}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-300 via-transparent to-transparent dark:from-slate-700"></div>
                            </div>
                        )}
                        {isOwner && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <Button variant="secondary" className="gap-2 shadow-sm rounded-full bg-background/90 hover:bg-background text-foreground" onClick={() => bannerInputRef.current?.click()} disabled={isUploading}>
                                    <Camera className="h-4 w-4" />
                                    {isUploading ? 'Uploading...' : 'Change Cover Photo'}
                                </Button>
                                <input type="file" ref={bannerInputRef} className="hidden" accept="image/png, image/jpeg" onChange={handleBannerUpload} />
                            </div>
                        )}
                    </div>

                    {/* Header Section */}
                    <div className="bg-card border-x border-b border-border rounded-b-3xl p-8 mb-8 -mt-6 relative z-10 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-8 items-start">

                            {/* Avatar & Badges */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-32 rounded-full bg-secondary border-4 border-background shadow-xl overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl">
                                        {seller?.name.charAt(0)}
                                    </div>
                                </div>
                                <ReputationBadge tier={seller?.tier} size="md" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
                                            {seller?.name}
                                            <TrustBadges badges={seller?.badges} showLabels={false} />
                                        </h1>
                                        <div className="flex items-center gap-4 text-muted-foreground mt-2 text-sm">
                                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Mumbai, India</span>
                                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Member since {seller?.memberSince}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant={isFollowing ? "outline" : "accent"} onClick={handleFollow}>
                                            {isFollowing ? 'Following' : 'Follow'}
                                        </Button>
                                        <Button variant="outline" className="gap-2" onClick={handleChat}>
                                            <MessageCircle className="h-4 w-4" /> Chat
                                        </Button>
                                        <ReportDialog sellerName={seller?.name} />
                                        <Button variant="ghost" size="icon" onClick={handleBlock} title="Block User">
                                            <Ban className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Social URLs */}
                                {(seller?.facebookUrl || seller?.instagramUrl || seller?.twitterUrl) && (
                                    <div className="flex items-center gap-3">
                                        {seller?.facebookUrl && (
                                            <a href={seller?.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-blue-600 transition-colors">
                                                <Facebook className="h-4 w-4" />
                                            </a>
                                        )}
                                        {seller?.instagramUrl && (
                                            <a href={seller?.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-pink-600 transition-colors">
                                                <Instagram className="h-4 w-4" />
                                            </a>
                                        )}
                                        {seller?.twitterUrl && (
                                            <a href={seller?.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-sky-500 transition-colors">
                                                <Twitter className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-6 p-4 bg-background/50 rounded-xl border border-border/50">
                                    <div className="text-center md:text-left">
                                        <div className="text-2xl font-bold font-display">{seller?.followers}</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Followers</div>
                                    </div>
                                    <div className="w-px bg-border h-10 hidden md:block" />
                                    <div className="text-center md:text-left">
                                        <div className="text-2xl font-bold font-display flex items-center gap-1">
                                            {seller?.rating} <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                        </div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Rating</div>
                                    </div>
                                    <div className="w-px bg-border h-10 hidden md:block" />
                                    <div className="text-center md:text-left">
                                        <div className="text-2xl font-bold font-display">{seller?.stats.itemsSold}</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Items Sold</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Stats & Verifications */}
                        <div className="space-y-6">
                            {/* Reliability Stats */}
                            <div className="card-premium p-6">
                                <h3 className="font-display font-semibold mb-4 text-lg">Performance</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-trust-green" /> Completion Rate
                                        </span>
                                        <span className="font-medium">{seller?.stats.completionRate}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <ShoppingBag className="h-4 w-4 text-primary" /> Total Transactions
                                        </span>
                                        <span className="font-medium">{seller?.stats.transactionCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-destructive" /> Disputes
                                        </span>
                                        <span className="font-medium">{seller?.stats.disputeCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <MessageCircle className="h-4 w-4 text-blue-500" /> Response Time
                                        </span>
                                        <span className="font-medium text-xs text-right">{seller?.stats.responseTime}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Verification */}
                            <div className="card-premium p-6">
                                <h3 className="font-display font-semibold mb-4 text-lg">Verifications</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${seller?.isVerifiedMobile ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                            <Smartphone className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Phone Verified</div>
                                            <div className="text-xs text-muted-foreground">{seller?.isVerifiedMobile ? 'Verified via OTP' : 'Pending'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${seller?.isVerifiedEmail ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Email Verified</div>
                                            <div className="text-xs text-muted-foreground">{seller?.isVerifiedEmail ? 'Verified via Link' : 'Pending'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Listings & Reviews */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Active Listings */}
                            <div>
                                <h3 className="font-display font-semibold text-xl mb-4">Active Listings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {displayAds.map((ad: any) => (
                                        <div key={ad.id} className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="aspect-video bg-secondary relative">
                                                {ad.images && typeof ad.images === 'string' && JSON.parse(ad.images).length > 0 ? (
                                                    <img src={JSON.parse(ad.images)[0]} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">No Image</div>
                                                )}
                                                <div className="absolute top-2 right-2">
                                                    <div className="bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded">
                                                        {ad.category?.name || ad.category}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-semibold truncate">{ad.title}</h4>
                                                <div className="text-lg font-bold text-primary mt-1">₹{ad.price.toLocaleString()}</div>
                                                <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                                                    <Link to={`/listing/${ad.id}`}>View Details</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reviews */}
                            <div>
                                <h3 className="font-display font-semibold text-xl mb-4">Latest Reviews</h3>
                                <div className="space-y-4">
                                    {seller?.reviews.map(review => (
                                        <div key={review.id} className="card-premium p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
                                                        {review.authorName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">{review.authorName}</div>
                                                        <div className="text-xs text-muted-foreground">{review.date}</div>
                                                    </div>
                                                </div>
                                                <div className="flex text-amber-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SellerProfile;
