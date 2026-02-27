import API_BASE from '@/lib/api';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingCard from '@/components/listings/ListingCard';
import { Button } from '@/components/ui/button';

const CategoryView = () => {
    const { categorySlug, subcategorySlug } = useParams();
    const [ads, setAds] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (subcategorySlug) {
                    params.set('subcategorySlug', subcategorySlug);
                } else if (categorySlug) {
                    params.set('categorySlug', categorySlug);
                }

                const res = await fetch(`${API_BASE}/api/ads/search?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.ads && Array.isArray(data.ads)) {
                        const formattedAds = data.ads.map((ad: any) => {
                            let imgs: string[] = [];
                            try { imgs = typeof ad.images === 'string' ? JSON.parse(ad.images) : (ad.images || []); } catch { imgs = []; }
                            let dynFields: Record<string, any> = {};
                            try { dynFields = ad.dynamicData ? (typeof ad.dynamicData === 'string' ? JSON.parse(ad.dynamicData) : ad.dynamicData) : {}; } catch { }

                            return {
                                ...ad,
                                images: imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'],
                                dynamicFields: dynFields,
                                category: ad.category?.slug || '',
                                condition: ad.condition || 'used',
                                seller: {
                                    id: ad.user?.id || ad.userId,
                                    name: ad.user?.name || 'Seller',
                                    badges: ad.user?.isGstVerified ? ['verified'] : [],
                                    memberSince: '',
                                    adsPosted: 0,
                                    responseRate: 0,
                                    tier: 'Bronze',
                                    stats: { itemsSold: 0, completionRate: 0, transactionCount: 0, disputeCount: 0, responseTime: '' },
                                    followers: 0,
                                    rating: 0,
                                    reviews: [],
                                    isVerifiedMobile: false,
                                    isVerifiedEmail: false,
                                },
                            };
                        });
                        setAds(formattedAds);
                    } else {
                        setAds([]);
                    }
                } else {
                    setAds([]);
                }

                // Fetch category name
                const catRes = await fetch(`${API_BASE}/api/categories`);
                if (catRes.ok) {
                    const catData = await catRes.json();
                    const cat = catData.categories.find((c: any) => c.slug === categorySlug);
                    if (cat) {
                        if (subcategorySlug) {
                            const sub = cat.subcategories.find((s: any) => s.slug === subcategorySlug);
                            setCategoryName(sub ? `${cat.name} > ${sub.name}` : cat.name);
                        } else {
                            setCategoryName(cat.name);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                setAds([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAds();
    }, [categorySlug, subcategorySlug]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container-tight py-8">
                <div className="mb-8">
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground capitalize">
                        {categoryName || categorySlug?.replace('-', ' ')}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {isLoading ? 'Loading...' : `${ads.length} ads found`}
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : ads.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ads.map((ad) => (
                            <ListingCard key={ad.id} listing={ad} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-secondary/30 rounded-2xl border border-border">
                        <p className="text-muted-foreground mb-4">No listings found in this category.</p>
                        <Button variant="outline" asChild>
                            <Link to="/listings">View All Listings</Link>
                        </Button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CategoryView;
