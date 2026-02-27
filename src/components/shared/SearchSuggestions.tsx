import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Tag } from 'lucide-react';
import API_BASE from '@/lib/api';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
    query: string;
    onClose: () => void;
    className?: string;
}

const SearchSuggestions = ({ query, onClose, className }: SearchSuggestionsProps) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    // Debounced search
    useEffect(() => {
        if (!query || query.length < 2) {
            setCategories([]);
            setProducts([]);
            return;
        }

        const timer = setTimeout(() => {
            // Search categories
            fetch(`${API_BASE}/api/categories`)
                .then(r => r.json())
                .then(data => {
                    const lowerQuery = query.toLowerCase();
                    const matched = (data.categories || [])
                        .filter((c: any) =>
                            c.name.toLowerCase().includes(lowerQuery) ||
                            c.slug.toLowerCase().includes(lowerQuery)
                        )
                        .slice(0, 2);
                    setCategories(matched);
                })
                .catch(() => setCategories([]));

            // Search ads
            fetch(`${API_BASE}/api/ads/search?q=${encodeURIComponent(query)}`)
                .then(r => r.json())
                .then(data => {
                    setProducts((data.ads || []).slice(0, 3));
                })
                .catch(() => setProducts([]));
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    if (categories.length === 0 && products.length === 0) {
        return null;
    }

    const handleSelect = (url: string) => {
        navigate(url);
        onClose();
    };

    return (
        <div className={cn(
            "absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2",
            className
        )}>
            {categories.length > 0 && (
                <div className="p-2 border-b border-border/50">
                    <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Categories
                    </p>
                    {categories.map((category: any) => (
                        <button
                            key={category.id}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors text-left"
                            onClick={() => handleSelect(`/listings?category=${category.slug}`)}
                        >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Tag className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{category.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {products.length > 0 && (
                <div className="p-2">
                    <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Top Results
                    </p>
                    {products.map((product: any) => (
                        <button
                            key={product.id}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors text-left"
                            onClick={() => handleSelect(`/listing/${product.id}`)}
                        >
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1 truncate">
                                <span className="font-medium">{product.title}</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchSuggestions;
