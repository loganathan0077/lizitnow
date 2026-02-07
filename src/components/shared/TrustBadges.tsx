import { CheckCircle, Star, Crown } from 'lucide-react';
import { TrustBadge } from '@/types/marketplace';
import { cn } from '@/lib/utils';

interface TrustBadgeDisplayProps {
  badge: TrustBadge;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const badgeConfig = {
  verified: {
    icon: CheckCircle,
    label: 'Verified',
    className: 'badge-verified',
    iconColor: 'text-trust-green',
  },
  trusted: {
    icon: Star,
    label: 'Trusted',
    className: 'badge-trusted',
    iconColor: 'text-trust-gold',
  },
  premium: {
    icon: Crown,
    label: 'Premium',
    className: 'badge-premium',
    iconColor: 'text-trust-premium',
  },
};

const sizeClasses = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-sm px-3 py-1',
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

export const TrustBadgeDisplay = ({ 
  badge, 
  showLabel = true, 
  size = 'md' 
}: TrustBadgeDisplayProps) => {
  const config = badgeConfig[badge];
  const Icon = config.icon;

  return (
    <span className={cn(config.className, sizeClasses[size])}>
      <Icon className={cn(iconSizes[size], config.iconColor)} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};

interface TrustBadgesProps {
  badges: TrustBadge[];
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustBadges = ({ badges, showLabels = true, size = 'md' }: TrustBadgesProps) => {
  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <TrustBadgeDisplay 
          key={badge} 
          badge={badge} 
          showLabel={showLabels} 
          size={size} 
        />
      ))}
    </div>
  );
};
