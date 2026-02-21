import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingCard from '@/components/listings/ListingCard';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import { Category, Subcategory } from '@/pages/PostAd'; // reuse types
import { listings as mockListings } from '@/data/mockData';

const CategoryView = () => {
    const { categorySlug, subcategorySlug } = useParams();
    const [ads, setAds] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // To display category name/title nicely
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            try {
                // Fetch ads from our backend
                let url = `http://localhost:5001/api/ads?`;
                if (subcategorySlug) {
                    url += `subcategorySlug=${subcategorySlug}`;
                } else if (categorySlug) {
                    url += `categorySlug=${categorySlug}`;
                }

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (data.ads && Array.isArray(data.ads)) {
                        // Transform strict prisma ad fields to match frontend ListingCard requirements if needed
                        const formattedAds = data.ads.map((ad: any) => ({
                            ...ad,
                            images: ad.images ? JSON.parse(ad.images) : [],
                            dynamicFields: ad.dynamicData ? JSON.parse(ad.dynamicData) : undefined,
                            category: ad.category?.name || 'Unknown', // To satisfy mock ListingCard safely
                            seller: { name: 'Verified User', badges: ['trusted'] } // Mock seller inner for now
                        }));

                        let combinedAds = formattedAds;
                        if (combinedAds.length === 0) {
                            const sampleAds = mockListings.filter(l => l.category === categorySlug);
                            combinedAds = [...combinedAds, ...sampleAds];
                        }

                        setAds(combinedAds);
                    } else {
                        const sampleAds = mockListings.filter(l => l.category === categorySlug);
                        setAds(sampleAds);
                    }
                } else {
                    const sampleAds = mockListings.filter(l => l.category === categorySlug);
                    setAds(sampleAds);
                }

                // Let's also fetch the category name if we only have the slug
                const catRes = await fetch('http://localhost:5001/api/categories');
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
