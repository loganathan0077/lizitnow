import { Link } from 'react-router-dom';
import {
  Smartphone,
  Laptop,
  Sofa,
  Refrigerator,
  Car,
  LucideIcon
} from 'lucide-react';
import { Category } from '@/types/marketplace';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: any;
}

const iconMap: Record<string, LucideIcon> = {
  'mobiles': Smartphone,
  'electronics': Laptop,
  'furniture': Sofa,
  'appliances': Refrigerator,
  'vehicles': Car,
  'real-estate': Sofa // Backup icon
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  const Icon = iconMap[category.slug] || Smartphone;
  const count = category._count ? category._count.ads : 0;

  return (
    <div className="relative group">
      <Link
        to={`/listings?category=${category.slug}`}
        className="card-premium p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300 block w-full h-full"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-display font-semibold text-foreground mb-1">
          {category.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {count.toLocaleString()} ads
        </p>
      </Link>

      {/* Hover Dropdown Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-secondary/95 backdrop-blur-xl border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
          <div className="p-2 space-y-1">
            {category.subcategories.map((sub: any) => (
              <Link
                key={sub.id}
                to={`/${category.slug}/${sub.slug}`}
                className="flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                title={sub.name}
              >
                <span className="truncate mr-2 font-medium">{sub.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{sub._count?.ads || 0}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
