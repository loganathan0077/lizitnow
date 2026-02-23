import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const CategoryNav = () => {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.categories || []))
            .catch(err => console.error(err));
    }, []);

    if (categories.length === 0) return null;

    return (
        <nav className="flex items-center justify-between py-1.5 relative w-full">
            {categories.map((category) => (
                <div key={category.id} className="group inline-block">
                    <Link
                        to={`/${category.slug}`}
                        className="flex items-center gap-1.5 py-3 px-2 text-[15px] font-medium text-foreground/90 hover:text-primary transition-colors whitespace-nowrap"
                    >
                        {category.name}
                        {category.subcategories && category.subcategories.length > 0 && (
                            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform duration-300 group-hover:-rotate-180" />
                        )}
                    </Link>

                    {/* Dropdown Menu - Bridge gap with pt-4 to ensure solid invisible hit area */}
                    {
                        category.subcategories && category.subcategories.length > 0 && (
                            <div className="absolute top-full left-auto pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-[9999] group-hover:delay-75 delay-150">
                                {/* Hover bridge helper to prevent losing hover when traversing */}
                                <div className="absolute top-0 left-0 w-full h-6 bg-transparent"></div>

                                {/* Arrow pointing up */}
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-t border-l border-border rotate-45 z-0"></div>

                                <div className="relative bg-card border border-border rounded-xl shadow-[0_12px_40px_rgb(0,0,0,0.12)] min-w-[280px] p-2 overflow-hidden z-10 transform origin-top scale-95 group-hover:scale-100 transition-transform duration-300">
                                    <div className="grid grid-cols-1 gap-1">
                                        {category.subcategories.map((sub: any) => (
                                            <Link
                                                key={sub.id}
                                                to={`/${category.slug}/${sub.slug}`}
                                                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors group/item"
                                            >
                                                <span className="truncate group-hover/item:translate-x-1 transition-transform">{sub.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            ))
            }
        </nav >
    );
};

export default CategoryNav;
