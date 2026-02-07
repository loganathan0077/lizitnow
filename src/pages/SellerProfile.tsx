import { calculateSellerTier } from '@/utils/reputation';

import { useParams } from 'react-router-dom';
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
    Ban
} from 'lucide-react';
import { ReportDialog } from '@/components/shared/ReportDialog';
import { mockAds } from './Dashboard'; // Reusing mock ads for now
import { Seller } from '@/types/marketplace';
import { useState } from 'react';
import { toast } from 'sonner';

// Mock Seller Data (Extended)
const mockSellerData: Seller = { // Renamed to mockSellerData to distinguish from calculated
    id: 'user-1',
    name: 'Rahul Sharma',
    badges: ['verified', 'trusted'],
    memberSince: '2023',
    adsPosted: 45,
    responseRate: 98,
    tier: 'Bronze', // Default, will be recalculated
    stats: {
        itemsSold: 142,
        completionRate: 96,
        transactionCount: 150,
        disputeCount: 2,
        responseTime: 'Usually within 1 hour'
    },
    followers: 850,
    rating: 4.8,
    reviews: [
        { id: 'r1', authorId: 'u2', authorName: 'Amit K.', rating: 5, comment: 'Product was exactly as described. Fast transaction!', date: '2 days ago' },
        { id: 'r2', authorId: 'u3', authorName: 'Priya S.', rating: 4, comment: 'Good deal, but location was a bit far.', date: '1 week ago' },
        { id: 'r3', authorId: 'u4', authorName: 'Vikram R.', rating: 5, comment: 'Highly recommended seller.', date: '3 weeks ago' }
    ],
    isVerifiedMobile: true,
    isVerifiedEmail: true
};

const SellerProfile = () => {
    const { id } = useParams();
    const [isFollowing, setIsFollowing] = useState(false);

    // Calculate dynamic tier
    const currentTier = calculateSellerTier(mockSellerData.stats, mockSellerData.rating);

    // Merge calculated tier into mock data for display
    const mockSeller = { ...mockSellerData, tier: currentTier };

    // ... rest of component ...


    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        if (!isFollowing) {
            toast.success(`You are now following ${mockSeller.name}`);
        } else {
            toast.info(`Unfollowed ${mockSeller.name}`);
        }
    };

    const handleReport = () => {
        toast('Report Submitted', {
            description: 'We have received your report and will investigate.',
        });
    };

    const handleBlock = () => {
        toast.error(`Blocked ${mockSeller.name}`, {
            description: "You will no longer see listings from this seller."
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-12">
                <div className="container max-w-5xl">

                    {/* Header Section */}
                    <div className="bg-gradient-to-br from-secondary/50 to-background border border-border rounded-3xl p-8 mb-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">

                            {/* Avatar & Badges */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-32 rounded-full bg-secondary border-4 border-background shadow-xl overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl">
                                        {mockSeller.name.charAt(0)}
                                    </div>
                                </div>
                                <ReputationBadge tier={mockSeller.tier} size="md" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
                                            {mockSeller.name}
                                            <TrustBadges badges={mockSeller.badges} showLabels={false} />
                                        </h1>
                                        <div className="flex items-center gap-4 text-muted-foreground mt-2 text-sm">
                                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Mumbai, India</span>
                                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Member since {mockSeller.memberSince}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant={isFollowing ? "outline" : "accent"} onClick={handleFollow}>
                                            {isFollowing ? 'Following' : 'Follow'}
                                        </Button>
                                        <Button variant="outline" className="gap-2">
                                            <MessageCircle className="h-4 w-4" /> Chat
                                        </Button>
                                        <ReportDialog sellerName={mockSeller.name} />
                                        <Button variant="ghost" size="icon" onClick={handleBlock} title="Block User">
                                            <Ban className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-6 p-4 bg-background/50 rounded-xl border border-border/50">
                                    <div className="text-center md:text-left">
                                        <div className="text-2xl font-bold font-display">{mockSeller.followers}</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Followers</div>
                                    </div>
                                    <div className="w-px bg-border h-10 hidden md:block" />
                                    <div className="text-center md:text-left">
                                        <div className="text-2xl font-bold font-display flex items-center gap-1">
                                            {mockSeller.rating} <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                        </div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Rating</div>
                                    </div>
                                    <div className="w-px bg-border h-10 hidden md:block" />
                                    <div className="text-center md:text-left">
                                        <div className="text-2xl font-bold font-display">{mockSeller.stats.itemsSold}</div>
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
                                        <span className="font-medium">{mockSeller.stats.completionRate}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <ShoppingBag className="h-4 w-4 text-primary" /> Total Transactions
                                        </span>
                                        <span className="font-medium">{mockSeller.stats.transactionCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-destructive" /> Disputes
                                        </span>
                                        <span className="font-medium">{mockSeller.stats.disputeCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <MessageCircle className="h-4 w-4 text-blue-500" /> Response Time
                                        </span>
                                        <span className="font-medium text-xs text-right">{mockSeller.stats.responseTime}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Verification */}
                            <div className="card-premium p-6">
                                <h3 className="font-display font-semibold mb-4 text-lg">Verifications</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${mockSeller.isVerifiedMobile ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                            <Smartphone className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Phone Verified</div>
                                            <div className="text-xs text-muted-foreground">{mockSeller.isVerifiedMobile ? 'Verified via OTP' : 'Pending'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${mockSeller.isVerifiedEmail ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                            <Mail className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">Email Verified</div>
                                            <div className="text-xs text-muted-foreground">{mockSeller.isVerifiedEmail ? 'Verified via Link' : 'Pending'}</div>
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
                                    {mockAds.slice(0, 4).map(ad => (
                                        <div key={ad.id} className="card-premium overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="aspect-video bg-secondary relative">
                                                <div className="absolute top-2 right-2">
                                                    <div className="bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded">
                                                        {ad.category}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-semibold truncate">{ad.title}</h4>
                                                <div className="text-lg font-bold text-primary mt-1">₹{ad.price.toLocaleString()}</div>
                                                <Button variant="outline" size="sm" className="w-full mt-3">View Details</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reviews */}
                            <div>
                                <h3 className="font-display font-semibold text-xl mb-4">Latest Reviews</h3>
                                <div className="space-y-4">
                                    {mockSeller.reviews.map(review => (
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
