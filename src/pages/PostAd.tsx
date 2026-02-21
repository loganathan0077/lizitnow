import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ShieldAlert, BadgeCheck, Loader2, Coins, Calendar, Image as ImageIcon, Youtube } from 'lucide-react';
import { toast } from 'sonner';
import { Listing } from '@/types/marketplace';

export interface Category {
    id: string;
    name: string;
    slug: string;
    subcategories: Subcategory[];
}

export interface Subcategory {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    formFields: string; // JSON Array String
    _count?: { ads: number };
}

const PostAd = () => {
    const navigate = useNavigate();
    const [isMember, setIsMember] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [adsPostedCount, setAdsPostedCount] = useState(0);

    const [categories, setCategories] = useState<Category[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        categoryId: '',
        subcategoryId: '',
        description: '',
        location: 'Mumbai, India', // Default for now
        condition: 'new',
        videoUrl: ''
    });

    const [dynamicFields, setDynamicFields] = useState<Record<string, string | number>>({});
    const [includedItems, setIncludedItems] = useState('');

    const handleDynamicFieldChange = (name: string, value: string) => {
        setDynamicFields(prev => ({ ...prev, [name]: value }));
    };

    // Reset dynamic fields when subcategory changes
    useEffect(() => {
        setDynamicFields({});
    }, [formData.subcategoryId]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsVerified(false);
                    setIsLoading(false);
                    return;
                }

                // Fetch Categories
                const catRes = await fetch('http://localhost:5001/api/categories');
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategories(catData.categories || []);
                }

                const res = await fetch('http://localhost:5001/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setIsVerified(true); // User is authenticated
                    const user = data.user;
                    const hasActiveMembership = user.membershipExpiry && new Date(user.membershipExpiry) > new Date();
                    setIsMember(hasActiveMembership);
                    setAdsPostedCount(user.adsPosted || 0);
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('isAuthenticated');
                    setIsVerified(false);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isValidYouTubeUrl = (url: string) => {
        if (!url) return true;
        const p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? true : false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.videoUrl && !isValidYouTubeUrl(formData.videoUrl)) {
            toast.error("Invalid Video Link", { description: "Please enter a valid YouTube URL." });
            return;
        }

        if (!isMember && adsPostedCount >= 5) {
            toast.error('Membership Required', {
                description: 'You have used your 5 free ads. Please purchase a membership to continue posting.',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                title: formData.title,
                price: formData.price,
                categoryId: formData.categoryId,
                subcategoryId: formData.subcategoryId,
                description: formData.description,
                condition: formData.condition,
                location: formData.location,
                images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'],
                dynamicData: dynamicFields,
                includedItems: includedItems.trim() ? includedItems.split(',').map(i => i.trim()) : undefined,
                videoUrl: formData.videoUrl || undefined
            };

            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5001/api/ads/post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error('Failed to Post', { description: errorData.error });
                setIsSubmitting(false);
                return;
            }

            const adData = await res.json();

            // 3. Save to LocalStorage mock as fallback
            const existingAds = JSON.parse(localStorage.getItem('myAds') || '[]');
            localStorage.setItem('myAds', JSON.stringify([adData.ad, ...existingAds]));

            setIsSubmitting(false);

            toast.success('Ad Posted Successfully!', {
                description: 'Your ad is now live for 30 days.',
            });

            navigate('/dashboard');
        } catch (error) {
            toast.error('An error occurred');
            setIsSubmitting(false);
        }
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
                            <h1 className="text-2xl font-bold font-display text-foreground mb-2">Membership Required</h1>
                            <p className="text-muted-foreground">
                                To maintain a safe marketplace, only paid members can post listings on Liztitnow.com.
                            </p>
                        </div>
                        <Button variant="accent" size="lg" className="w-full" asChild>
                            <Link to="/dashboard">
                                <BadgeCheck className="h-5 w-5 mr-2" />
                                Buy Membership (₹100)
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link to="/">Back to Home</Link>
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
                                                name="categoryId"
                                                required
                                                value={formData.categoryId}
                                                onChange={(e) => {
                                                    setFormData(prev => ({ ...prev, categoryId: e.target.value, subcategoryId: '' }));
                                                }}
                                                className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {formData.categoryId && (
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Subcategory</label>
                                            <select
                                                name="subcategoryId"
                                                required
                                                value={formData.subcategoryId}
                                                onChange={handleInputChange}
                                                className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                            >
                                                <option value="">Select Subcategory</option>
                                                {categories.find(c => c.id === formData.categoryId)?.subcategories.map(sub => (
                                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

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

                                    {/* Category Specific Fields */}
                                    {formData.subcategoryId && (() => {
                                        const subcat = categories
                                            .find(c => c.id === formData.categoryId)
                                            ?.subcategories.find(s => s.id === formData.subcategoryId);

                                        if (!subcat || !subcat.formFields) return null;

                                        let fields = [];
                                        try {
                                            fields = JSON.parse(subcat.formFields);
                                        } catch (e) { console.error("Invalid JSON in formFields"); }

                                        if (fields.length === 0) return null;

                                        return (
                                            <div className="pt-4 border-t border-border">
                                                <h3 className="font-semibold text-foreground mb-4">Category Specific Details</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {fields.map((field: any) => (
                                                        <div key={field.name}>
                                                            <label className="block text-sm font-medium text-foreground mb-2">{field.name}</label>
                                                            {field.type === 'select' ? (
                                                                <select
                                                                    required
                                                                    value={dynamicFields[field.name] || ''}
                                                                    onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
                                                                    className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                                                >
                                                                    <option value="">Select {field.name}</option>
                                                                    {field.options?.map((opt: string) => (
                                                                        <option key={opt} value={opt}>{opt}</option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <input
                                                                    type={field.type}
                                                                    required
                                                                    value={dynamicFields[field.name] || ''}
                                                                    onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
                                                                    placeholder={field.placeholder}
                                                                    className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Included Items */}
                                    <div className="pt-4 border-t border-border">
                                        <label className="block text-sm font-medium text-foreground mb-2">What You Get (Included Items)</label>
                                        <p className="text-xs text-muted-foreground mb-3">List items separated by commas (e.g. Original Charger, Box, Case)</p>
                                        <input
                                            type="text"
                                            value={includedItems}
                                            onChange={(e) => setIncludedItems(e.target.value)}
                                            placeholder="Optional inclusions..."
                                            className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
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

                                    {/* Video Link */}
                                    <div className="pt-4 border-t border-border">
                                        <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                                            <Youtube className="h-4 w-4 text-red-600" />
                                            Video Link (Optional)
                                        </label>
                                        <p className="text-xs text-muted-foreground mb-3">Paste a YouTube link to showcase your item in action.</p>
                                        <input
                                            type="url"
                                            name="videoUrl"
                                            value={formData.videoUrl}
                                            onChange={handleInputChange}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            variant="accent"
                                            size="lg"
                                            className="w-full"
                                            disabled={isSubmitting || (!isMember && adsPostedCount >= 5)}
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
                                    <div className="flex items-start justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2 shrink-0 pt-0.5">
                                            <Calendar className="h-4 w-4" /> Validity
                                        </span>
                                        <span className="font-medium text-foreground text-right">30 Days</span>
                                    </div>
                                    <div className="flex items-start justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2 shrink-0 pt-0.5">
                                            <Coins className="h-4 w-4" /> Cost
                                        </span>
                                        <span className="font-medium text-foreground text-right pl-2">
                                            {isMember ? 'Included (Unlimited)' : (adsPostedCount < 5 ? `Free (${adsPostedCount}/5 used)` : '₹100 (Membership Required)')}
                                        </span>
                                    </div>
                                    <div className="h-px bg-border my-2" />
                                    <div className="flex items-start justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2 shrink-0">
                                            <BadgeCheck className="h-4 w-4" /> Membership
                                        </span>
                                        <span className={`font-bold text-right ${!isMember ? 'text-destructive' : 'text-trust-green'}`}>
                                            {isMember ? 'Active' : 'Free Tier'}
                                        </span>
                                    </div>
                                </div>

                                {!isMember && adsPostedCount >= 5 && (
                                    <div className="p-3 bg-destructive/10 rounded-lg text-sm text-destructive mb-4">
                                        You have used your 5 free ads. Purchase a 6-month membership to continue posting.
                                    </div>
                                )}

                                <div className="bg-secondary/50 p-4 rounded-xl">
                                    <h4 className="font-medium text-sm text-foreground mb-2">Liztitnow Posting Rules</h4>
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
