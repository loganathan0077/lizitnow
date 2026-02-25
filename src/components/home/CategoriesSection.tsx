import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import CategoryCard from './CategoryCard';

const CategoriesSection = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="container-tight">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Browse Categories
            </h2>
            <p className="text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          <CategoryCard category={{
            id: 'b2b-wholesale',
            name: 'B2B / Wholesale',
            slug: 'b2b',
            icon: 'PackageSearch'
          }} />
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
          {/* View All Card */}
          <div className="relative group h-48 md:h-56">
            <Link
              to="/listings"
              className="block w-full h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative border-2 border-transparent hover:border-primary/50"
            >
              <img
                src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop"
                alt="View All Categories"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">
                <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-md">View All Categories</h3>
                <div className="text-white/90 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 mt-2">
                  Explore <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
