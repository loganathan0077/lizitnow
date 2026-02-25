import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ShieldAlert, BadgeCheck, Loader2, Coins, Calendar, Image as ImageIcon, Youtube, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Listing } from '@/types/marketplace';

export interface Category {
    id: string;
    name: string;
    slug: string;
    subcategories: Subcategory[];
    pricing?: { price: number; validityDays: number; };
}

export interface Subcategory {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    formFields: string; // JSON Array String
    _count?: { ads: number };
}

// --- Image Mapping ---
const CATEGORY_IMAGES: Record<string, string> = {
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop',
    'vehicles': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
    'furniture': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
    'real-estate': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    'appliances': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
    'jobs': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop',
};

const SUBCATEGORY_IMAGES: Record<string, string> = {
    // Real Estate
    'real-estate-premium-villa-plots': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
    'real-estate-farmland': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
    'real-estate-houses-villas': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    'real-estate-apartments': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
    'real-estate-budget-plots': 'https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=800&auto=format&fit=crop',
    'real-estate-rental': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
    'real-estate-commercial-shops': 'https://images.unsplash.com/photo-1534433722253-ab8c0e25b128?q=80&w=800&auto=format&fit=crop',
    'real-estate-office-spaces': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    'real-estate-warehouse-industrial': 'https://images.unsplash.com/photo-1586528116311-ad8ed7450862?q=80&w=800&auto=format&fit=crop',
    'real-estate-gated-plots': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop',

    // Vehicles
    'vehicles-cars': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop',
    'vehicles-bikes': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
    'vehicles-scooters': 'https://images.unsplash.com/photo-1560920452-92144367c3b5?q=80&w=800&auto=format&fit=crop',
    'vehicles-commercial': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop',
    'vehicles-spare-parts': 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=800&auto=format&fit=crop',

    // Electronics
    'electronics-mobile-phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    'electronics-televisions': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop',
    'electronics-laptops': 'https://images.unsplash.com/photo-1531297172867-0c7f28abecb1?q=80&w=800&auto=format&fit=crop',
    'electronics-tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
    'electronics-cameras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    'electronics-accessories': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop',

    // Furniture
    'furniture-sofa': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop',
    'furniture-beds': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop',
    'furniture-dining': 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=800&auto=format&fit=crop',
    'furniture-office': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
    'furniture-chairs': 'https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=80&w=800&auto=format&fit=crop',

    // Home Appliances
    'appliances-ac': 'https://images.unsplash.com/photo-1545601264-b0351db7aeac?q=80&w=800&auto=format&fit=crop',
    'appliances-fridge': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
    'appliances-washing': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=800&auto=format&fit=crop',
    'appliances-other': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',

    // Jobs & Careers
    'jobs-it': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
    'jobs-office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    'jobs-manufacturing': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    'jobs-driver': 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop',
    'jobs-healthcare': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
    'jobs-retail': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop',
    'jobs-education': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
    'jobs-construction': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    'jobs-wfh': 'https://images.unsplash.com/photo-1593642532400-2682810df593?q=80&w=800&auto=format&fit=crop',
};

// Default fallback images
const DEFAULT_CATEGORY_IMG = 'https://images.unsplash.com/photo-1556761175-5973b0ceafcf?q=80&w=800&auto=format&fit=crop';
const DEFAULT_SUBCATGORY_IMG = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop';

const PostAd = () => {
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [adsPostedCount, setAdsPostedCount] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);

    const [categories, setCategories] = useState<Category[]>([]);

    // UI Navigation State
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        categoryId: '',
        subcategoryId: '',
        description: '',
        location: 'Mumbai, India', // Default for now
        condition: 'new',
        videoUrl: '',
        mapUrl: '',
        isB2B: false,
        b2bMoq: '',
        b2bPricePerUnit: '',
        b2bStock: '',
        b2bBusinessName: '',
        b2bGstNumber: '',
        b2bDelivery: false
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
                    setAdsPostedCount(user.adsPosted || 0);
                    setWalletBalance(user.walletBalance || 0);
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
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
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

        if (walletBalance < currentListingFee) {
            toast.error('Insufficient Wallet Balance', {
                description: `This ad requires ₹${currentListingFee}. Please recharge your wallet.`,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                price: formData.isB2B ? 0 : Number(formData.price), // Fallback price for B2B since they use price per unit
                images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'], // Hardcoded for now
                dynamicData: Object.keys(dynamicFields).length > 0 ? dynamicFields : undefined,
                includedItems: includedItems.trim() ? includedItems.split(',').map(i => i.trim()) : undefined,
                videoUrl: formData.videoUrl || undefined,
                mapUrl: formData.mapUrl || undefined
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
                            <h1 className="text-2xl font-bold font-display text-foreground mb-2">Login Required</h1>
                            <p className="text-muted-foreground">
                                Please login to your account to post an ad on Liztitnow.com.
                            </p>
                        </div>
                        <Button variant="accent" size="lg" className="w-full" asChild>
                            <Link to="/login">
                                Login / Register
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

    // Dynamic Pricing Calculation
    const selectedCategory = categories.find(c => c.id === formData.categoryId);
    const isServiceOrEvent = selectedCategory && ['services', 'events', 'event-services'].includes(selectedCategory.slug);

    let currentListingFee = selectedCategory?.pricing?.price ?? 10;
    let currentValidityDays = selectedCategory?.pricing?.validityDays ?? 30;
    let isLaunchOffer = false;

    if (!isServiceOrEvent && adsPostedCount < 32) {
        currentListingFee = adsPostedCount < 2 ? 0 : 1;
        currentValidityDays = 30;
        isLaunchOffer = true;
    }

    const isJobCategory = categories.find(c => c.id === formData.categoryId)?.slug === 'jobs';

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-12 px-4">
                <div className="container max-w-3xl">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold font-display text-foreground mb-2">Post New Ad</h1>
                            <p className="text-muted-foreground">
                                {currentStep === 1 && "Choose a main category for your listing."}
                                {currentStep === 2 && "Select the exact subcategory."}
                                {currentStep === 3 && "Fill out all the details to make your listing stand out."}
                            </p>
                        </div>
                        {currentStep === 2 && (
                            <Button variant="outline" onClick={() => setCurrentStep(1)}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                        )}
                        {currentStep === 3 && (
                            <Button variant="outline" onClick={() => setCurrentStep(2)}>
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Subcategories
                            </Button>
                        )}
                    </div>

                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, categoryId: cat.id, subcategoryId: '' }));
                                        setCurrentStep(2);
                                        window.scrollTo(0, 0);
                                    }}
                                    className="group relative h-48 w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 text-left border-2 border-transparent hover:border-primary/50"
                                >
                                    <img
                                        src={CATEGORY_IMAGES[cat.slug] || DEFAULT_CATEGORY_IMG}
                                        alt={cat.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                                        <div>
                                            <h3 className="text-white font-bold text-xl drop-shadow-md">{cat.name}</h3>
                                            <div className="mt-2 text-white/80 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                                Select <ArrowLeft className="h-4 w-4 rotate-180" />
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep === 2 && formData.categoryId && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.find(c => c.id === formData.categoryId)?.subcategories.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, subcategoryId: sub.id }));
                                        setCurrentStep(3);
                                        window.scrollTo(0, 0);
                                    }}
                                    className="group relative h-40 w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 text-left border-2 border-transparent hover:border-primary/50"
                                >
                                    <img
                                        src={SUBCATEGORY_IMAGES[sub.slug] || DEFAULT_SUBCATGORY_IMG}
                                        alt={sub.name}
                                        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent flex items-center p-6">
                                        <div className="max-w-[80%]">
                                            <h3 className="text-white font-bold text-[1.1rem] leading-tight drop-shadow-md">{sub.name}</h3>
                                        </div>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all text-white">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form Section */}
                            <div className="lg:col-span-2">
                                <div className="card-premium p-6">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {currentStep === 3 && (
                                            <>
                                                {/* Minimal Category Header summary instead of selects */}
                                                <div className="bg-secondary/40 p-4 rounded-xl mb-6 border border-border flex items-center justify-between">
                                                    <div>
                                                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Selected Category</div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-foreground">
                                                                {categories.find(c => c.id === formData.categoryId)?.name}
                                                            </span>
                                                            <span className="text-muted-foreground">/</span>
                                                            <span className="font-semibold text-primary">
                                                                {categories.find(c => c.id === formData.categoryId)?.subcategories.find(s => s.id === formData.subcategoryId)?.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setCurrentStep(1)}
                                                        className="shrink-0"
                                                    >
                                                        Change
                                                    </Button>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-foreground mb-2">Ad Title</label>
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        required
                                                        value={formData.title}
                                                        onChange={handleInputChange}
                                                        placeholder={isJobCategory ? "e.g. Hiring Senior Web Developer" : "e.g. iPhone 14 Pro Max 256GB"}
                                                        className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                    />
                                                </div>

                                                {/* Sale Type Toggle */}
                                                {!isJobCategory && (
                                                    <div className="pt-4 border-t border-border">
                                                        <label className="block text-sm font-medium text-foreground mb-3">Sale Type</label>
                                                        <div className="flex gap-4">
                                                            <label className={`cursor-pointer flex-1 p-3 rounded-xl border-2 transition-all text-center font-medium ${!formData.isB2B ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                                                                <input
                                                                    type="radio"
                                                                    name="saleType"
                                                                    className="hidden"
                                                                    checked={!formData.isB2B}
                                                                    onChange={() => setFormData(prev => ({ ...prev, isB2B: false }))}
                                                                />
                                                                Retail Sale
                                                            </label>
                                                            <label className={`cursor-pointer flex-1 p-3 rounded-xl border-2 transition-all text-center font-medium ${formData.isB2B ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                                                                <input
                                                                    type="radio"
                                                                    name="saleType"
                                                                    className="hidden"
                                                                    checked={formData.isB2B}
                                                                    onChange={() => setFormData(prev => ({ ...prev, isB2B: true }))}
                                                                />
                                                                B2B / Wholesale
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}

                                                {!isJobCategory && !formData.isB2B && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-2">Price (₹)</label>
                                                        <input
                                                            type="number"
                                                            name="price"
                                                            required={!formData.isB2B}
                                                            value={formData.price}
                                                            onChange={handleInputChange}
                                                            placeholder="e.g. 85000"
                                                            className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                        />
                                                    </div>
                                                )}

                                                {/* B2B Dynamic Fields */}
                                                {!isJobCategory && formData.isB2B && (
                                                    <div className="bg-primary/5 p-5 rounded-xl border border-primary/20 space-y-4">
                                                        <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                                                            📦 Wholesale Specific Requirements
                                                        </h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-foreground mb-2">Minimum Order Quantity (MOQ) *</label>
                                                                <input
                                                                    type="number"
                                                                    name="b2bMoq"
                                                                    required
                                                                    min="2"
                                                                    value={formData.b2bMoq}
                                                                    onChange={handleInputChange}
                                                                    placeholder="e.g. 50"
                                                                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-foreground mb-2">Price Per Unit (₹) *</label>
                                                                <input
                                                                    type="number"
                                                                    name="b2bPricePerUnit"
                                                                    required
                                                                    min="1"
                                                                    value={formData.b2bPricePerUnit}
                                                                    onChange={handleInputChange}
                                                                    placeholder="e.g. 450"
                                                                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-foreground mb-2">Available Stock (Optional)</label>
                                                                <input
                                                                    type="number"
                                                                    name="b2bStock"
                                                                    value={formData.b2bStock}
                                                                    onChange={handleInputChange}
                                                                    placeholder="e.g. 5000"
                                                                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-foreground mb-2">Business Name (Optional)</label>
                                                                <input
                                                                    type="text"
                                                                    name="b2bBusinessName"
                                                                    value={formData.b2bBusinessName}
                                                                    onChange={handleInputChange}
                                                                    placeholder="Your Company Pvt Ltd"
                                                                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-foreground mb-2">GST Number (Optional)</label>
                                                                <input
                                                                    type="text"
                                                                    name="b2bGstNumber"
                                                                    value={formData.b2bGstNumber}
                                                                    onChange={handleInputChange}
                                                                    placeholder="22AAAAA0000A1Z5"
                                                                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-3 pt-8">
                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="b2bDelivery"
                                                                        className="sr-only peer"
                                                                        checked={formData.b2bDelivery}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                                    <span className="ml-3 text-sm font-medium text-foreground">Delivery Available</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {!isJobCategory && (
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
                                        )}

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

                                        {/* Map Link */}
                                        <div className="pt-4 border-t border-border">
                                            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-emerald-600" />
                                                Google Maps Location Link (Optional)
                                            </label>
                                            <p className="text-xs text-muted-foreground mb-3">Paste a Google Maps share link to show the exact location.</p>
                                            <input
                                                type="url"
                                                name="mapUrl"
                                                value={formData.mapUrl}
                                                onChange={handleInputChange}
                                                placeholder="https://maps.app.goo.gl/..."
                                                className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                variant="accent"
                                                size="lg"
                                                className="w-full"
                                                disabled={isSubmitting || walletBalance < currentListingFee}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        Pay ₹{currentListingFee} & Post Ad
                                                        <CheckCircle2 className="h-5 w-5 ml-2" />
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
                                            <span className="font-medium text-foreground text-right">{currentValidityDays} Days</span>
                                        </div>
                                        <div className="flex items-start justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2 shrink-0 pt-0.5">
                                                <Coins className="h-4 w-4" /> Listing Fee
                                            </span>
                                            <span className="font-medium text-foreground text-right pl-2">
                                                {currentListingFee === 0 ? <span className="text-trust-green font-bold">FREE</span> : `₹${currentListingFee}`}
                                            </span>
                                        </div>
                                        {isLaunchOffer && (
                                            <div className="text-xs text-primary bg-primary/10 p-2 rounded-md">
                                                ⭐ Launch Offer Applied! ({adsPostedCount < 2 ? `Ad ${adsPostedCount + 1} of 2 free` : `Ad ${adsPostedCount + 1} of 32 for ₹1`})
                                            </div>
                                        )}
                                        <div className="h-px bg-border my-2" />
                                        <div className="flex items-start justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2 shrink-0">
                                                <BadgeCheck className="h-4 w-4" /> Wallet Balance
                                            </span>
                                            <span className={`font-bold text-right ${walletBalance < currentListingFee ? 'text-destructive' : 'text-trust-green'}`}>
                                                ₹{walletBalance.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {walletBalance < currentListingFee && (
                                        <div className="p-3 bg-destructive/10 rounded-lg text-sm text-destructive mb-4">
                                            Insufficient wallet balance. Please go to your dashboard and recharge to post this ad.
                                        </div>
                                    )}

                                    <div className="bg-secondary/50 p-4 rounded-xl">
                                        <h4 className="font-medium text-sm text-foreground mb-2">Liztitnow Ad Guidelines</h4>
                                        <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                                            <li>Validity depends on the category plan.</li>
                                            <li>Posting fees are deducted from your Wallet directly.</li>
                                            <li>Spamming will lead to an immediate ban.</li>
                                            <li>Ensure correct category selection to avoid delisting.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PostAd;
