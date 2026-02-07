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
  category: Category;
}

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Sofa,
  Refrigerator,
  Car,
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  const Icon = iconMap[category.icon] || Smartphone;

  return (
    <Link
      to={`/listings?category=${category.slug}`}
      className="group card-premium p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="font-display font-semibold text-foreground mb-1">
        {category.name}
      </h3>
      <p className="text-sm text-muted-foreground">
        {category.count.toLocaleString()} ads
      </p>
    </Link>
  );
};

export default CategoryCard;
