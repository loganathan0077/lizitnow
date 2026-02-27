import API_BASE, { fetchWithRetry } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const MobileCategoryAccordion = ({ onClose }: { onClose: () => void }) => {
    const [categories, setCategories] = useState<any[]>([]);
    const [openCategory, setOpenCategory] = useState<string | null>(null);

    useEffect(() => {
        fetchWithRetry(`${API_BASE}/api/categories`)
            .then(res => res.json())
            .then(data => setCategories(data.categories || []))
            .catch(err => console.error('MobileCategory fetch failed:', err));
    }, []);

    if (categories.length === 0) return null;

    return (
        <div className="flex flex-col w-full mt-2 mb-2 border-t border-border/60 pt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">All Categories</h3>
            {categories.map((category) => (
                <div key={category.id} className="flex flex-col border-b border-border/40 last:border-0">
                    <div className="flex items-center">
                        {category.subcategories && category.subcategories.length > 0 ? (
                            <button
                                onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
                                className="flex items-center justify-between w-full py-3.5 px-2 text-left font-medium text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                            >
                                <span className="text-[15px]">{category.name}</span>
                                {openCategory === category.id ?
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" /> :
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                }
                            </button>
                        ) : (
                            <Link
                                to={`/${category.slug}`}
                                onClick={onClose}
                                className="flex items-center justify-between w-full py-3.5 px-2 text-left font-medium text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                            >
                                <span className="text-[15px]">{category.name}</span>
                            </Link>
                        )}
                    </div>

                    {/* Subcategories Accordion Content */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openCategory === category.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        {category.subcategories && category.subcategories.length > 0 && (
                            <div className="flex flex-col gap-1 pl-4 pr-2 pb-3 bg-secondary/20 rounded-b-lg">
                                <Link
                                    to={`/${category.slug}`}
                                    onClick={onClose}
                                    className="py-2.5 px-3 mt-1 text-sm font-semibold text-primary hover:bg-primary/10 rounded-md transition-colors"
                                >
                                    View all in {category.name}
                                </Link>
                                {category.subcategories.map((sub: any) => (
                                    <Link
                                        key={sub.id}
                                        to={`/${category.slug}/${sub.slug}`}
                                        onClick={onClose}
                                        className="flex items-center justify-between py-2.5 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                                    >
                                        <span>{sub.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
