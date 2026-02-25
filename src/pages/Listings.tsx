import { useState, useMemo } from 'react';
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
  MapPin
} from 'lucide-react';
import { listings, categories, formatPrice, locations } from '@/data/mockData';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  Smartphone,
  Laptop,
  Sofa,
  Refrigerator,
  Car,
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
  'real-estate': [
    { key: 'Approval Type', label: 'Approval Type', options: ['DTCP', 'CMDA', 'Panchayat', 'NA'] },
    { key: 'Facing Direction', label: 'Facing Direction', options: ['East', 'West', 'North', 'South'] },
    { key: 'Corner Plot', label: 'Corner Plot', options: ['Yes', 'No'] }
  ],
  'furniture': [
    { key: 'Material', label: 'Material', options: ['Wood', 'Plastic', 'Metal', 'Leather', 'Sheesham Wood'] },
    { key: 'Assembly Required', label: 'Assembly Required', options: ['Yes', 'No'] }
  ],
  'mobiles': [
    { key: 'RAM', label: 'RAM', options: ['4GB', '6GB', '8GB', '12GB', '16GB'] },
    { key: 'Storage', label: 'Storage', options: ['64GB', '128GB', '256GB', '512GB', '1TB'] }
  ],
  'electronics': [
    { key: 'Brand', label: 'Brand', options: ['Apple', 'Samsung', 'Sony', 'LG', 'HP', 'Dell'] }
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
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || 'All Locations');
  const [brandSearch, setBrandSearch] = useState('');
  const [dynamicFilters, setDynamicFilters] = useState<Record<string, string>>({});

  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Global Search (from Header)
    if (globalSearch) {
      const query = globalSearch.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (activeCategory === 'b2b') {
      result = result.filter(l => l.isB2B === true);
    } else if (activeCategory !== 'all') {
      result = result.filter(l => l.category === activeCategory);
    }

    // Filter by condition
    if (condition !== 'all') {
      result = result.filter(l => l.condition === condition);
    }

    // Filter by price
    const minPrice = priceRange[0] === '' ? 0 : priceRange[0];
    const maxPrice = priceRange[1] === '' ? Infinity : priceRange[1];
    result = result.filter(l => l.price >= minPrice && l.price <= maxPrice);

    // Filter by location
    if (locationFilter !== 'All Locations') {
      result = result.filter(l => l.location === locationFilter);
    }

    // Filter by Brand/Model (Simple text search on title)
    if (brandSearch.trim()) {
      const query = brandSearch.toLowerCase();
      result = result.filter(l => l.title.toLowerCase().includes(query));
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

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [activeCategory, condition, sortBy, priceRange, locationFilter, brandSearch, globalSearch, dynamicFilters]);

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
    setLocationFilter(location);
    if (location === 'All Locations') {
      searchParams.delete('location');
    } else {
      searchParams.set('location', location);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setCondition('all');
    setPriceRange([0, '']);
    setLocationFilter('All Locations');
    setBrandSearch('');
    setDynamicFilters({});

    searchParams.delete('q');
    searchParams.delete('location');
    handleCategoryChange('all');
  };

  const activeCategoryData = categories.find(c => c.slug === activeCategory);

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
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon];
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={cn(
                      "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                      activeCategory === cat.slug
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-foreground hover:bg-muted"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
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
                  <select
                    value={locationFilter}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
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
                    <select
                      value={locationFilter}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
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
