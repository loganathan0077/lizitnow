import API_BASE from '@/lib/api';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingCard from '@/components/listings/ListingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ChevronDown,
  SlidersHorizontal,
  X,
  Smartphone,
  Laptop,
  Sofa,
  Refrigerator,
  Car,
  Search,
  MapPin,
  Briefcase,
  Wrench,
  Stethoscope,
  BookOpen,
  Dumbbell,
  Dog,
  PartyPopper,
  Factory,
  Locate
} from 'lucide-react';
import { formatPrice, locations } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useLocationContext } from '@/context/LocationContext';
import { LocationFilter } from '@/components/shared/LocationFilter';

const iconMap: Record<string, any> = {
  Smartphone,
  Laptop,
  Sofa,
  Refrigerator,
  Car,
  MapPin,
  Briefcase,
  Wrench,
  Stethoscope,
  BookOpen,
  Dumbbell,
  Dog,
  PartyPopper,
  Factory
};

const conditionOptions = [
  { value: 'all', label: 'All Conditions' },
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'used', label: 'Used' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

const categorySpecificFilters: Record<string, { key: string, label: string, options: string[] }[]> = {
  'mobiles': [
    { key: 'RAM', label: 'RAM', options: ['4GB', '6GB', '8GB', '12GB', '16GB'] },
    { key: 'Storage', label: 'Storage', options: ['64GB', '128GB', '256GB', '512GB', '1TB'] }
  ],
  'electronics': [
    { key: 'RAM', label: 'RAM', options: ['4GB', '8GB', '16GB', '32GB', '64GB'] },
    { key: 'Storage', label: 'Storage', options: ['256GB', '512GB', '1TB', '2TB'] },
    { key: 'Warranty', label: 'Warranty', options: ['Under Warranty', 'Out of Warranty'] }
  ],
  'vehicles': [
    { key: 'Fuel Type', label: 'Fuel Type', options: ['Petrol', 'Diesel', 'Electric', 'CNG'] },
    { key: 'KM Driven', label: 'KM Driven', options: ['0-10,000 km', '10,000-30,000 km', '30,000-50,000 km', '50,000+ km'] },
    { key: 'Transmission', label: 'Transmission', options: ['Manual', 'Automatic'] }
  ],
  'real-estate': [
    { key: 'BHK', label: 'BHK', options: ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'] },
    { key: 'Area (Sq.ft)', label: 'Area (Sq.ft)', options: ['Under 500', '500-1000', '1000-2000', '2000+'] },
    { key: 'Furnishing', label: 'Furnishing', options: ['Fully Furnished', 'Semi-Furnished', 'Unfurnished'] }
  ]
};

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get('category') || 'all';
  const globalSearch = searchParams.get('q') || '';

  const [condition, setCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number | '', number | '']>([0, '']);
  const { location: selectedLocation, setLocation: setSelectedLocation } = useLocationContext();
  const [brandSearch, setBrandSearch] = useState('');

  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`)
      .then(res => res.json())
      .then(data => setCategoriesList(data.categories || []))
      .catch(err => console.error(err));
  }, []);

  // New Filter States
  const [saleType, setSaleType] = useState('all'); // 'all', 'retail', 'b2b'
  const [postedWithin, setPostedWithin] = useState('all'); // 'all', 'today', '3days', '7days', '30days'
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [b2bMaxMoq, setB2bMaxMoq] = useState<number | ''>('');
  const [b2bInStock, setB2bInStock] = useState(false);
  const [b2bDelivery, setB2bDelivery] = useState(false);

  // Distance filter
  const [distanceRange, setDistanceRange] = useState('all');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Detect user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => { } // silently fail
      );
    }
  }, []);

  const [dynamicFilters, setDynamicFilters] = useState<Record<string, string>>({});

  // Real backend ads + loading state
  const [backendAds, setBackendAds] = useState<any[]>([]);
  const [adsLoading, setAdsLoading] = useState(true);

  // Fetch real ads from backend
  useEffect(() => {
    setAdsLoading(true);
    const params = new URLSearchParams();

    if (activeCategory && activeCategory !== 'all') {
      params.set('categorySlug', activeCategory);
    }
    if (condition !== 'all') params.set('condition', condition);
    if (globalSearch) params.set('q', globalSearch);
    if (sortBy) params.set('sort', sortBy);
    if (priceRange[0] !== '' && priceRange[0] > 0) params.set('minPrice', String(priceRange[0]));
    if (priceRange[1] !== '') params.set('maxPrice', String(priceRange[1]));
    if (distanceRange !== 'all' && userCoords) {
      params.set('lat', String(userCoords.lat));
      params.set('lng', String(userCoords.lng));
      params.set('radius', distanceRange);
    }

    fetch(`${API_BASE}/api/ads/search?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setBackendAds(data.ads || []);
        setAdsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch ads:', err);
        setAdsLoading(false);
      });
  }, [activeCategory, condition, globalSearch, sortBy, priceRange, distanceRange, userCoords]);

  // Transform backend ads to Listing type + apply remaining client-side filters
  const filteredListings = useMemo(() => {
    let result = backendAds.map((ad: any) => {
      let imgs: string[] = [];
      try { imgs = JSON.parse(ad.images || '[]'); } catch { imgs = []; }
      let dynFields: Record<string, any> = {};
      try { dynFields = ad.dynamicData ? JSON.parse(ad.dynamicData) : {}; } catch { }
      let included: string[] = [];
      try { included = ad.includedItems ? JSON.parse(ad.includedItems) : []; } catch { }

      return {
        id: ad.id,
        title: ad.title,
        description: ad.description,
        price: ad.price,
        images: imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop'],
        category: ad.category?.slug || '',
        condition: ad.condition as any,
        location: ad.location,
        seller: {
          id: ad.user?.id || ad.userId,
          name: ad.user?.name || 'Seller',
          badges: ad.user?.isGstVerified ? ['verified' as const] : [],
          memberSince: '',
          adsPosted: 0,
          responseRate: 0,
          tier: 'Bronze' as const,
          stats: { itemsSold: 0, completionRate: 0, transactionCount: 0, disputeCount: 0, responseTime: '' },
          followers: 0,
          rating: 0,
          reviews: [],
          isVerifiedMobile: false,
          isVerifiedEmail: false,
        },
        createdAt: ad.createdAt,
        status: ad.status,
        expiresAt: ad.expiresAt,
        includedItems: included,
        videoUrl: ad.videoUrl,
        mapUrl: ad.mapUrl,
        views: ad.views,
        dynamicFields: dynFields,
        isB2B: ad.isB2B,
        b2bMoq: ad.b2bMoq,
        b2bPricePerUnit: ad.b2bPricePerUnit,
        b2bStock: ad.b2bStock,
        b2bBusinessName: ad.b2bBusinessName,
        b2bGstNumber: ad.b2bGstNumber,
        b2bDelivery: ad.b2bDelivery,
        distance: ad.distance, // from Haversine
      };
    });

    // Client-side filters not handled by backend

    // Sale Type
    if (saleType !== 'all') {
      if (saleType === 'b2b') {
        result = result.filter(l => l.isB2B === true);
      } else if (saleType === 'retail') {
        result = result.filter(l => !l.isB2B);
      }
    }

    // Posted Date Filter
    if (postedWithin !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      result = result.filter(l => {
        const adDate = new Date(l.createdAt).getTime();
        switch (postedWithin) {
          case 'today': return adDate >= today;
          case '3days': return adDate >= today - 3 * 24 * 60 * 60 * 1000;
          case '7days': return adDate >= today - 7 * 24 * 60 * 60 * 1000;
          case '30days': return adDate >= today - 30 * 24 * 60 * 60 * 1000;
          default: return true;
        }
      });
    }

    // Verified Seller Filter
    if (verifiedOnly) {
      result = result.filter(l => l.seller.badges && l.seller.badges.includes('verified'));
    }

    // Location filter (text match)
    if (selectedLocation !== 'All Locations') {
      result = result.filter(l => l.location === selectedLocation);
    }

    // Brand/Model text search
    if (brandSearch.trim()) {
      const query = brandSearch.toLowerCase();
      result = result.filter(l => l.title.toLowerCase().includes(query));
    }

    // B2B Specific Filters
    if (activeCategory === 'b2b' || saleType === 'b2b') {
      if (b2bMaxMoq !== '') {
        result = result.filter(l => l.isB2B && l.b2bMoq && l.b2bMoq <= b2bMaxMoq);
      }
      if (b2bInStock) {
        result = result.filter(l => l.isB2B && l.b2bStock && l.b2bStock > 0);
      }
      if (b2bDelivery) {
        result = result.filter(l => l.isB2B && l.b2bDelivery === true);
      }
    }

    // Dynamic Specifications filter
    Object.entries(dynamicFilters).forEach(([key, val]) => {
      if (val) {
        result = result.filter(l =>
          l.dynamicFields &&
          l.dynamicFields[key] &&
          String(l.dynamicFields[key]).toLowerCase() === val.toLowerCase()
        );
      }
    });

    return result;
  }, [
    backendAds, selectedLocation, brandSearch,
    saleType, postedWithin, verifiedOnly,
    b2bMaxMoq, b2bInStock, b2bDelivery, dynamicFilters, activeCategory
  ]);

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setDynamicFilters({}); // Reset dynamic filters when changing category
    setSearchParams(searchParams);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location || 'All Locations');
    if (location && location !== 'All Locations') {
      searchParams.set('location', location);
    } else {
      searchParams.delete('location');
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setCondition('all');
    setPriceRange([0, '']);
    setSelectedLocation('All Locations');
    setBrandSearch('');

    // Reset new filters
    setSaleType('all');
    setPostedWithin('all');
    setVerifiedOnly(false);
    setB2bMaxMoq('');
    setB2bInStock(false);
    setB2bDelivery(false);

    setDistanceRange('all');

    setDynamicFilters({});

    searchParams.delete('q');
    searchParams.delete('location');
    handleCategoryChange('all');
  };

  const activeCategoryData = categoriesList.find(c => c.slug === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-secondary/50 border-b border-border py-6 md:py-8">
          <div className="container-tight">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                  {globalSearch ? `Results for "${globalSearch}"` : (activeCategory === 'b2b' ? 'B2B / Wholesale' : (activeCategoryData ? activeCategoryData.name : 'All Listings'))}
                  {activeCategory === 'b2b' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider border border-primary/20 align-middle">
                      Verified
                    </span>
                  )}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {filteredListings.length} ads found
                </p>
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Category Pills */}
            <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => handleCategoryChange('all')}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  activeCategory === 'all'
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-muted"
                )}
              >
                All Categories
              </button>
              <button
                onClick={() => handleCategoryChange('b2b')}
                className={cn(
                  "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                  activeCategory === 'b2b'
                    ? "bg-primary text-primary-foreground border-transparent shadow-md"
                    : "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
                )}
              >
                B2B / Wholesale
              </button>
              {categoriesList.map((cat) => {
                const Icon = iconMap[cat.icon] || MapPin;
                return (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                      activeCategory === cat.slug
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="container-tight py-8">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="card-premium p-6 sticky top-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground">Filters</h3>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-destructive" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                {/* Search Brand/Model */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Brand or Model</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-9"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Location</Label>
                  <LocationFilter
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 hover:bg-secondary/90 transition-colors"
                  />
                </div>

                {/* Distance Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Distance Range</Label>
                  {userCoords ? (
                    <select
                      value={distanceRange}
                      onChange={(e) => setDistanceRange(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">Any Distance</option>
                      <option value="25">Within 25 KM</option>
                      <option value="50">Within 50 KM</option>
                      <option value="100">Within 100 KM</option>
                      <option value="200">Within 200 KM</option>
                    </select>
                  ) : (
                    <button
                      onClick={() => {
                        setDetectingLocation(true);
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                            setDetectingLocation(false);
                          },
                          () => setDetectingLocation(false)
                        );
                      }}
                      disabled={detectingLocation}
                      className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-muted-foreground flex items-center gap-2 hover:bg-secondary/80 transition-colors disabled:opacity-50"
                    >
                      <Locate className="h-4 w-4" />
                      {detectingLocation ? 'Detecting...' : 'Enable location for distance filter'}
                    </button>
                  )}
                </div>

                {/* Sale Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Sale Type</Label>
                  <select
                    value={saleType}
                    onChange={(e) => setSaleType(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">All Types</option>
                    <option value="retail">Retail Sale</option>
                    <option value="b2b">B2B / Wholesale</option>
                  </select>
                </div>

                {/* Posted Within */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Posted Within</Label>
                  <select
                    value={postedWithin}
                    onChange={(e) => setPostedWithin(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">Anytime</option>
                    <option value="today">Today</option>
                    <option value="3days">Last 3 Days</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                  </select>
                </div>

                {/* Verified Sellers Only */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      verifiedOnly ? "border-primary bg-primary" : "border-muted-foreground group-hover:border-primary"
                    )}>
                      {verifiedOnly && <div className="w-2 h-2 rounded-sm bg-primary-foreground" />}
                    </div>
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-foreground">Verified Sellers Only</span>
                  </label>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Price Range (₹)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([e.target.value === '' ? '' : Number(e.target.value), priceRange[1]])}
                      placeholder="Min"
                      className="h-9"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], e.target.value === '' ? '' : Number(e.target.value)])}
                      placeholder="Max"
                      className="h-9"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Condition</Label>
                  <div className="space-y-2">
                    {conditionOptions.map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                        <div className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                          condition === opt.value ? "border-primary bg-primary" : "border-muted-foreground group-hover:border-primary"
                        )}>
                          {condition === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                        </div>
                        <input
                          type="radio"
                          name="condition"
                          value={opt.value}
                          checked={condition === opt.value}
                          onChange={(e) => setCondition(e.target.value)}
                          className="sr-only"
                        />
                        <span className="text-sm text-foreground">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dynamic Category Filters */}
                {categorySpecificFilters[activeCategory] && (
                  <div className="pt-4 border-t border-border space-y-6">
                    <h4 className="font-semibold text-sm text-primary mb-2">Category Filters</h4>
                    {categorySpecificFilters[activeCategory].map((filter) => (
                      <div key={filter.key}>
                        <Label className="text-sm font-medium mb-2 block">{filter.label}</Label>
                        <select
                          value={dynamicFilters[filter.key] || ''}
                          onChange={(e) => setDynamicFilters(prev => ({ ...prev, [filter.key]: e.target.value }))}
                          className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">All {filter.label}</option>
                          {filter.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                {/* B2B Specific Filters */}
                {(activeCategory === 'b2b' || saleType === 'b2b') && (
                  <div className="pt-4 border-t border-border space-y-6">
                    <h4 className="font-semibold text-sm text-primary mb-2">Wholesale Filters</h4>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Max Minimum Order (MOQ)</Label>
                      <Input
                        type="number"
                        value={b2bMaxMoq}
                        onChange={(e) => setB2bMaxMoq(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g. 50 Units"
                        className="h-10"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          b2bInStock ? "border-primary bg-primary" : "border-muted-foreground group-hover:border-primary"
                        )}>
                          {b2bInStock && <div className="w-2 h-2 rounded-sm bg-primary-foreground" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={b2bInStock}
                          onChange={(e) => setB2bInStock(e.target.checked)}
                          className="sr-only"
                        />
                        <span className="text-sm text-foreground">In Stock Only</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                          b2bDelivery ? "border-primary bg-primary" : "border-muted-foreground group-hover:border-primary"
                        )}>
                          {b2bDelivery && <div className="w-2 h-2 rounded-sm bg-primary-foreground" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={b2bDelivery}
                          onChange={(e) => setB2bDelivery(e.target.checked)}
                          className="sr-only"
                        />
                        <span className="text-sm text-foreground">Delivery Available</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Sort */}
                <div className="pt-4 border-t border-border">
                  <Label className="text-sm font-medium mb-2 block">Sort By</Label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </aside>

            {/* Mobile Filters Overlay */}
            {showFilters && (
              <div className="fixed inset-0 z-50 bg-background md:hidden">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h3 className="font-display font-semibold text-lg">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto h-[calc(100vh-140px)] space-y-6">
                  {/* Search Brand/Model */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Brand or Model</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        className="pl-9"
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Location</Label>
                    <LocationFilter
                      value={selectedLocation}
                      onChange={handleLocationChange}
                      className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 hover:bg-secondary/90"
                    />
                  </div>

                  {/* Distance Filter Mobile */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Distance Range</Label>
                    {userCoords ? (
                      <select
                        value={distanceRange}
                        onChange={(e) => setDistanceRange(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="all">Any Distance</option>
                        <option value="25">Within 25 KM</option>
                        <option value="50">Within 50 KM</option>
                        <option value="100">Within 100 KM</option>
                        <option value="200">Within 200 KM</option>
                      </select>
                    ) : (
                      <button
                        onClick={() => {
                          setDetectingLocation(true);
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                              setDetectingLocation(false);
                            },
                            () => setDetectingLocation(false)
                          );
                        }}
                        disabled={detectingLocation}
                        className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-muted-foreground flex items-center gap-2 hover:bg-secondary/80 transition-colors disabled:opacity-50"
                      >
                        <Locate className="h-4 w-4" />
                        {detectingLocation ? 'Detecting...' : 'Enable location for distance filter'}
                      </button>
                    )}
                  </div>

                  {/* Sale Type Mobile */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Sale Type</Label>
                    <select
                      value={saleType}
                      onChange={(e) => setSaleType(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">All Types</option>
                      <option value="retail">Retail Sale</option>
                      <option value="b2b">B2B / Wholesale</option>
                    </select>
                  </div>

                  {/* Posted Within Mobile */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Posted Within</Label>
                    <select
                      value={postedWithin}
                      onChange={(e) => setPostedWithin(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">Anytime</option>
                      <option value="today">Today</option>
                      <option value="3days">Last 3 Days</option>
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                    </select>
                  </div>

                  {/* Verified Sellers Only Mobile */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                        verifiedOnly ? "border-primary bg-primary" : "border-muted-foreground group-hover:border-primary"
                      )}>
                        {verifiedOnly && <div className="w-2 h-2 rounded-sm bg-primary-foreground" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-foreground">Verified Sellers Only</span>
                    </label>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Price Range (₹)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([e.target.value === '' ? '' : Number(e.target.value), priceRange[1]])}
                        placeholder="Min"
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], e.target.value === '' ? '' : Number(e.target.value)])}
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Condition</Label>
                    <div className="space-y-2">
                      {conditionOptions.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="condition-mobile"
                            value={opt.value}
                            checked={condition === opt.value}
                            onChange={(e) => setCondition(e.target.value)}
                            className="w-4 h-4 text-primary accent-primary"
                          />
                          <span className="text-sm text-foreground">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Category Filters Mobile */}
                  {categorySpecificFilters[activeCategory] && (
                    <div className="pt-4 border-t border-border space-y-6">
                      <h4 className="font-semibold text-sm text-primary mb-2">Category Filters</h4>
                      {categorySpecificFilters[activeCategory].map((filter) => (
                        <div key={filter.key}>
                          <Label className="text-sm font-medium mb-2 block">{filter.label}</Label>
                          <select
                            value={dynamicFilters[filter.key] || ''}
                            onChange={(e) => setDynamicFilters(prev => ({ ...prev, [filter.key]: e.target.value }))}
                            className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="">All {filter.label}</option>
                            {filter.options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* B2B Specific Filters Mobile */}
                  {(activeCategory === 'b2b' || saleType === 'b2b') && (
                    <div className="pt-4 border-t border-border space-y-6">
                      <h4 className="font-semibold text-sm text-primary mb-2">Wholesale Filters</h4>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Max Minimum Order (MOQ)</Label>
                        <Input
                          type="number"
                          value={b2bMaxMoq}
                          onChange={(e) => setB2bMaxMoq(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 50 Units"
                          className="h-10"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            b2bInStock ? "border-primary bg-primary" : "border-muted-foreground group-hover:border-primary"
                          )}>
                            {b2bInStock && <div className="w-2 h-2 rounded-sm bg-primary-foreground" />}
                          </div>
                          <input
                            type="checkbox"
                            checked={b2bInStock}
                            onChange={(e) => setB2bInStock(e.target.checked)}
                            className="sr-only"
                          />
                          <span className="text-sm text-foreground">In Stock Only</span>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            b2bDelivery ? "border-primary bg-primary" : "border-muted-foreground group-hover:border-primary"
                          )}>
                            {b2bDelivery && <div className="w-2 h-2 rounded-sm bg-primary-foreground" />}
                          </div>
                          <input
                            type="checkbox"
                            checked={b2bDelivery}
                            onChange={(e) => setB2bDelivery(e.target.checked)}
                            className="sr-only"
                          />
                          <span className="text-sm text-foreground">Delivery Available</span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Sort By</Label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={clearFilters}>Clear All</Button>
                  <Button className="flex-1" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Listings Grid */}
            <div className="flex-1">
              {filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">No listings found matching your criteria.</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
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

export default Listings;
