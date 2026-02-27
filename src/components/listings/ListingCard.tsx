import { Link } from 'react-router-dom';
import { MapPin, Clock, Heart, Share2 } from 'lucide-react';
import { Listing } from '@/types/marketplace';
import { TrustBadges } from '@/components/shared/TrustBadges';
import { formatPrice } from '@/data/mockData';
import { cn } from '@/lib/utils';
import API_BASE from '@/lib/api';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ListingCardProps {
  listing: Listing;
  featured?: boolean;
}

const conditionLabels = {
  new: 'New',
  'like-new': 'Like New',
  used: 'Used',
};

const conditionColors = {
  new: 'bg-trust-green/10 text-trust-green',
  'like-new': 'bg-amber/10 text-amber-dark',
  used: 'bg-muted text-muted-foreground',
};

const ListingCard = ({ listing, featured }: ListingCardProps) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const isAuthenticated = !!localStorage.getItem('token');

  // Check wishlist status on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('token');
    fetch(`${API_BASE}/api/wishlist/status/${listing.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setWishlisted(!!data.isWishlisted))
      .catch(() => { });
  }, [listing.id, isAuthenticated]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    setWishlistLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (wishlisted) {
        await fetch(`${API_BASE}/api/wishlist/${listing.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await fetch(`${API_BASE}/api/wishlist/${listing.id}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/listing/${listing.id}`;
    const shareData = {
      title: listing.title,
      text: `Check out: ${listing.title} - ${formatPrice(listing.price)}`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      }
    } catch {
      // User cancelled share dialog or clipboard failed
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      } catch {
        toast.error('Failed to share');
      }
    }
  };

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

  return (
    <Link
      to={`/listing/${listing.id}`}
      className={cn(
        "group card-premium overflow-hidden flex flex-col",
        featured && "ring-2 ring-amber/30"
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber text-accent-foreground text-xs font-semibold">
            Featured
          </div>
        )}

        {/* Condition Badge */}
        <div className={cn(
          "absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium",
          conditionColors[listing.condition]
        )}>
          {conditionLabels[listing.condition]}
        </div>

        {/* Action Icons - Bottom Right Overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
            title="Share"
          >
            <Share2 className="h-3.5 w-3.5 text-white" />
          </button>
          <button
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors disabled:opacity-50"
            title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                wishlisted ? "fill-red-500 text-red-500" : "text-white"
              )}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Price */}
        <div className="mb-2 flex items-end gap-1.5 flex-wrap">
          <span className="text-xl font-display font-bold text-foreground">
            {listing.isB2B ? formatPrice(listing.b2bPricePerUnit || 0) : formatPrice(listing.price)}
          </span>
          {listing.isB2B && (
            <span className="text-xs text-muted-foreground pb-1 font-medium whitespace-nowrap">
              / unit (Min: {listing.b2bMoq})
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {listing.isB2B && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider mr-2 align-middle border border-primary/20">
              B2B
            </span>
          )}
          <span className="align-middle">{listing.title}</span>
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{listing.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{timeAgo(listing.createdAt)}</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {listing.seller.name}
            </span>
            <TrustBadges badges={listing.seller.badges} showLabels={false} size="sm" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
