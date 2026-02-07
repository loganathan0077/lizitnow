import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ShieldAlert, BadgeCheck, Loader2, Coins, Calendar, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Listing } from '@/types/marketplace';

const PostAd = () => {
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [walletBalance, setWalletBalance] = useState(15); // Initial mock balance

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: '',
        description: '',
        location: 'Mumbai, India', // Default for now
        condition: 'new'
    });

    useEffect(() => {
        const verified = localStorage.getItem('isVerified') === 'true';
        setIsVerified(verified);

        // Get wallet balance (simulated)
        const storedBalance = localStorage.getItem('walletBalance');
        if (storedBalance) {
            setWalletBalance(parseInt(storedBalance));
        } else {
            localStorage.setItem('walletBalance', '15');
        }

        setIsLoading(false);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (walletBalance < 5) {
            toast.error('Insufficient Tokens', {
                description: 'You need 5 tokens to post an ad. Please recharge your wallet.',
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            // 1. Deduct Tokens
            const newBalance = walletBalance - 5;
            setWalletBalance(newBalance);
            localStorage.setItem('walletBalance', newBalance.toString());

            // 2. Create Ad Object
            const now = new Date();
            const expiresAt = new Date();
            expiresAt.setDate(now.getDate() + 30); // 30 Days Validity

            const newAd: Listing = {
                id: Date.now().toString(),
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price),
                images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'], // Mock Image
                category: formData.category,
                condition: formData.condition as any,
                location: formData.location,
                seller: {
                    id: 'user-1',
                    name: 'Rahul Sharma',
                    badges: ['verified', 'trusted'],
                    memberSince: '2023',
                    adsPosted: 10,
                    responseRate: 98
                },
                createdAt: now.toISOString(),
                expiresAt: expiresAt.toISOString(),
                status: 'active'
            };

            // 3. Save to LocalStorage
            const existingAds = JSON.parse(localStorage.getItem('myAds') || '[]');
            localStorage.setItem('myAds', JSON.stringify([newAd, ...existingAds]));

            setIsSubmitting(false);

            toast.success('Ad Posted Successfully!', {
                description: 'Your ad is now live for 30 days. 5 Tokens deducted.',
            });

            navigate('/dashboard');
        }, 1500);
    };

    if (isLoading) return null;

    if (!isVerified) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                            <ShieldAlert className="h-10 w-10 text-destructive" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-display text-foreground mb-2">Verification Required</h1>
                            <p className="text-muted-foreground">
                                To maintain a safe marketplace, only verified sellers can post listings on TrustMart.
                            </p>
                        </div>
                        <Button variant="accent" size="lg" className="w-full" asChild>
                            <Link to="/verification">
                                <BadgeCheck className="h-5 w-5 mr-2" />
                                Get Verified Now
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link to="/dashboard">Back to Dashboard</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-12 px-4">
                <div className="container max-w-3xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold font-display text-foreground mb-2">Post New Ad</h1>
                        <p className="text-muted-foreground">Create a listing for your item. All fields are required.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <div className="card-premium p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Ad Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g. iPhone 14 Pro Max 256GB"
                                            className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Price (₹)</label>
                                            <input
                                                type="number"
                                                name="price"
                                                required
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 85000"
                                                className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                                            <select
                                                name="category"
                                                required
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                            >
                                                <option value="">Select Category</option>
                                                <option value="electronics">Electronics</option>
                                                <option value="mobiles">Mobiles</option>
                                                <option value="fashion">Fashion</option>
                                                <option value="home">Home & Living</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Condition</label>
                                        <div className="flex gap-2 p-1 bg-secondary rounded-xl">
                                            {['new', 'like-new', 'used'].map((c) => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, condition: c }))}
                                                    className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${formData.condition === c
                                                            ? 'bg-card text-foreground shadow-sm'
                                                            : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                >
                                                    {c.replace('-', ' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            required
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={5}
                                            placeholder="Describe your item in detail..."
                                            className="w-full p-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                        />
                                    </div>

                                    {/* Mock Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Photos</label>
                                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-secondary/30">
                                            <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">Image upload is simulated.</p>
                                            <p className="text-xs text-muted-foreground mt-1">A default image will be used.</p>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            variant="accent"
                                            size="lg"
                                            className="w-full"
                                            disabled={isSubmitting || walletBalance < 5}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                    Posting Ad...
                                                </>
                                            ) : (
                                                <>
                                                    Post Ad Now
                                                    <BadgeCheck className="h-5 w-5 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar / Plan Info */}
                        <div className="lg:col-span-1">
                            <div className="card-premium p-6 sticky top-24">
                                <h3 className="font-display font-semibold text-lg text-foreground mb-4">Ad Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Validity
                                        </span>
                                        <span className="font-medium text-foreground">30 Days</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Coins className="h-4 w-4" /> Cost
                                        </span>
                                        <span className="font-medium text-foreground">5 Tokens</span>
                                    </div>
                                    <div className="h-px bg-border my-2" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Your Balance</span>
                                        <span className={`font-bold ${walletBalance < 5 ? 'text-destructive' : 'text-trust-green'}`}>
                                            {walletBalance} Tokens
                                        </span>
                                    </div>
                                </div>

                                {walletBalance < 5 && (
                                    <div className="p-3 bg-destructive/10 rounded-lg text-sm text-destructive mb-4">
                                        You need at least 5 tokens to post an ad.
                                    </div>
                                )}

                                <div className="bg-secondary/50 p-4 rounded-xl">
                                    <h4 className="font-medium text-sm text-foreground mb-2">Trusted Marketplace Rules</h4>
                                    <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                                        <li>Ads are valid for 30 days only.</li>
                                        <li>No lifetime ads allowed.</li>
                                        <li>Spamming will lead to a ban.</li>
                                        <li>Verified sellers only.</li>
                                    </ul>
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

export default PostAd;
