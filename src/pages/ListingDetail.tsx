import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { TrustBadges } from '@/components/shared/TrustBadges';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Heart,
  Share2,
  MessageCircle,
  Shield,
  User,
  Calendar,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Check,
  Flame,
  TrendingDown,
  Eye,
  ShieldCheck,
  Youtube
} from 'lucide-react';
import { listings, formatPrice } from '@/data/mockData';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import ChatSheet from '@/components/messaging/ChatSheet';

const conditionLabels = {
  new: 'Brand New',
  'like-new': 'Like New',
  used: 'Used',
};

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Fallback for listings that might be missing in mockData during transition
  const listing = listings.find(l => l.id === id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link Copied", {
      description: "Listing link copied to clipboard.",
    });
  };

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Listing Not Found</h1>
            <Button asChild>
              <Link to="/listings">Back to Listings</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Mock multiple images
  const images = [
    listing.images[0],
    '/placeholder.svg',
    '/placeholder.svg',
  ];

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Safe access for new property with fallback
  const isSellerOnline = (listing.seller as any).isOnline ?? false;

  const getYouTubeId = (url: string) => {
    const p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const match = url.match(p);
    return match ? match[1] : null;
  };
  const videoId = listing.videoUrl ? getYouTubeId(listing.videoUrl) : null;

  const renderSmartPrice = () => {
    if (!listing.marketPrice || listing.marketPrice <= listing.price) return null;

    const savings = listing.marketPrice - listing.price;
    const savePercent = Math.round((savings / listing.marketPrice) * 100);

    if (listing.category === 'real-estate') {
      const score = Math.min(10, 5 + (savePercent / 5)).toFixed(1);
      return (
        <div className="bg-amber/10 border border-amber/20 rounded-xl p-4 mb-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber/20 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-amber" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-lg text-amber-900 dark:text-amber-500">🔥 Deal Score: {score} / 10</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Priced <strong>{formatPrice(savings)}</strong> below market average! Great investment opportunity.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-trust-green/10 border border-trust-green/20 rounded-xl p-4 mb-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-trust-green/20 flex items-center justify-center shrink-0">
          <TrendingDown className="w-6 h-6 text-trust-green" />
        </div>
        <div>
          <h4 className="font-bold text-lg text-trust-green mb-1">Smart Price Suggestion</h4>
          <div className="flex items-end gap-3 text-sm">
            <div className="line-through text-muted-foreground">Market: {formatPrice(listing.marketPrice)}</div>
            <div className="font-semibold text-trust-green">You Save: {formatPrice(savings)} ({savePercent}%)</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-secondary/50 border-b border-border py-4">
          <div className="container-tight">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Listings
            </Link>
          </div>
        </div>

        <div className="container-tight py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="card-premium overflow-hidden">
                <div className="relative aspect-[4/3] bg-secondary">
                  <img
                    src={images[currentImage]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-soft hover:bg-card transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center shadow-soft hover:bg-card transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Featured Badge */}
                  {listing.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-amber text-accent-foreground text-sm font-semibold">
                      Featured
                    </div>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-foreground/80 text-primary-foreground text-sm">
                    {currentImage + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={cn(
                        "w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors",
                        currentImage === idx ? "border-primary" : "border-transparent"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="card-premium p-6">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {listing.title}
                </h1>

                {/* Quick Info Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-foreground">
                    <MapPin className="h-4 w-4 text-muted-foreground" /> {listing.location}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" /> Posted {timeAgo(listing.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-foreground capitalize">
                    {conditionLabels[listing.condition as keyof typeof conditionLabels]} Condition
                  </span>
                  {listing.views && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-foreground">
                      <Eye className="h-4 w-4 text-muted-foreground" /> {listing.views} Views
                    </span>
                  )}
                  {listing.dynamicFields?.['Warranty'] && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-trust-green/10 text-trust-green text-sm font-bold">
                      <ShieldCheck className="h-4 w-4" /> Warranty Included
                    </span>
                  )}
                </div>

                {renderSmartPrice()}

                {/* What You Get Section */}
                {listing.includedItems && listing.includedItems.length > 0 && (
                  <div className="mb-6 p-5 rounded-xl bg-secondary/50 border border-border">
                    <h3 className="font-semibold text-foreground mb-3">Included Extras</h3>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {listing.includedItems.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                          <Check className="h-4 w-4 text-trust-green shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Structured Product Details */}
                {listing.dynamicFields && Object.keys(listing.dynamicFields).length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-display font-semibold text-lg mb-4">Key Specifications</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(listing.dynamicFields).map(([key, value]) => (
                        <div key={key} className="bg-secondary p-3.5 rounded-lg border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">{key}</div>
                          <div className="font-bold text-sm text-foreground">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Embed */}
                {videoId && (
                  <div className="mb-8 p-1 border border-border rounded-xl bg-secondary/20">
                    <div className="flex items-center gap-2 mb-3 px-3 pt-3">
                      <Youtube className="h-5 w-5 text-red-600" />
                      <h3 className="font-display font-semibold text-lg">Product Video</h3>
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black/5">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?loop=0&controls=1`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                      />
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-6">
                  <h3 className="font-display font-semibold text-lg mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Price & Seller */}
            <div className="space-y-6">
              {/* Price Card */}
              <div className="card-premium p-6 sticky top-24">
                <div className="text-3xl font-display font-bold text-foreground mb-4">
                  {formatPrice(listing.price)}
                </div>

                {/* Action Buttons: FIXED ALIGNMENT */}
                <div className="hidden lg:flex items-center gap-3 mb-6">
                  <Button
                    variant="accent"
                    size="lg"
                    className="flex-1 gap-2 shadow-sm min-w-0 px-4"
                    onClick={() => setIsContactOpen(true)}
                  >
                    <MessageCircle className="h-5 w-5 shrink-0" />
                    <span className="truncate">Contact Seller</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setIsFavorited(!isFavorited);
                      toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
                    }}
                    className={cn(
                      "px-3 w-12 shrink-0",
                      isFavorited && "text-destructive border-destructive bg-destructive/5"
                    )}
                  >
                    <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    className="px-3 w-12 shrink-0"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Shield className="h-4 w-4 text-trust-green" />
                  <span>Safe transaction tips available</span>
                </div>

                {/* Seller Info */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold">Seller Information</h3>
                    <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-secondary">
                      <span className={cn(
                        "w-2.5 h-2.5 rounded-full animate-pulse",
                        isSellerOnline ? "bg-green-500" : "bg-red-500"
                      )} />
                      <span className="text-xs font-medium text-muted-foreground">
                        {isSellerOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center relative">
                      <User className="h-7 w-7 text-primary" />
                      {/* Avatar Online Status Dot */}
                      <span className={cn(
                        "absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-background rounded-full",
                        isSellerOnline ? "bg-green-500" : "bg-red-500"
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground mb-1">
                        {listing.seller.name}
                      </div>
                      <TrustBadges badges={listing.seller.badges} size="sm" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {listing.seller.memberSince}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BarChart3 className="h-4 w-4" />
                      <span>{listing.seller.adsPosted} ads posted</span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-trust-green/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Response Rate</span>
                      <span className="font-semibold text-trust-green">{listing.seller.responseRate}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-trust-green rounded-full"
                        style={{ width: `${listing.seller.responseRate}%` }}
                      />
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to={`/seller/${listing.seller.id}`}>View Seller Profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-40 flex items-center gap-3">
        <Button
          variant="accent"
          size="lg"
          className="flex-[2] gap-2 shadow-sm font-bold"
          onClick={() => setIsContactOpen(true)}
        >
          <MessageCircle className="h-5 w-5 shrink-0" />
          Chat Now
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            setIsFavorited(!isFavorited);
            toast.success(isFavorited ? "Item Saved" : "Removed from Saved");
          }}
          className={cn(
            "flex-1 gap-2 font-bold",
            isFavorited && "text-destructive border-destructive bg-destructive/5"
          )}
        >
          <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
          Save
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleShare}
          className="px-3 shrink-0"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Replaced Dialog with WhatsApp-style Chat Sheet */}
      <ChatSheet
        open={isContactOpen}
        onOpenChange={setIsContactOpen}
        sellerName={listing.seller.name}
        sellerId={listing.seller.id}
        isOnline={isSellerOnline}
        listingTitle={listing.title}
      />
    </div>
  );
};

export default ListingDetail;
