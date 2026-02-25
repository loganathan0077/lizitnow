import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Category } from '@/types/marketplace';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: any;
}

// --- Image Mapping ---
const CATEGORY_IMAGES: Record<string, string> = {
  'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop',
  'vehicles': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
  'furniture': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
  'real-estate': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
  'home-appliances': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
  'jobs': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop',
  'industrial-products': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
  'pets-animals': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
  'event-services': 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop',
  'services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
  'books-education': 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop',
  'sports-fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
  'fashion-lifestyle': 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop',
  'b2b': 'https://images.unsplash.com/photo-1586528116311-ad8ed7450862?q=80&w=800&auto=format&fit=crop',
};

const SUBCATEGORY_IMAGES: Record<string, string> = {
  // Real Estate
  'real-estate-premium-villa-plots': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
  'real-estate-farmland': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
  'real-estate-houses-villas': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
  'real-estate-apartments': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
  'real-estate-budget-plots': 'https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=800&auto=format&fit=crop',
  'real-estate-rental': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
  'real-estate-commercial-shops': 'https://images.unsplash.com/photo-1534433722253-ab8c0e25b128?q=80&w=800&auto=format&fit=crop',
  'real-estate-office-spaces': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
  'real-estate-warehouse-industrial': 'https://images.unsplash.com/photo-1586528116311-ad8ed7450862?q=80&w=800&auto=format&fit=crop',
  'real-estate-gated-plots': 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop',

  // Vehicles
  'vehicles-cars': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop',
  'vehicles-bikes': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
  'vehicles-scooters': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800&auto=format&fit=crop',
  'vehicles-commercial': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop',
  'vehicles-spare-parts': 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=800&auto=format&fit=crop',

  // Electronics
  'electronics-mobile-phones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
  'electronics-televisions': 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop',
  'electronics-laptops': 'https://images.unsplash.com/photo-1531297172867-0c7f28abecb1?q=80&w=800&auto=format&fit=crop',
  'electronics-tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
  'electronics-cameras': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
  'electronics-accessories': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop',

  // Furniture
  'furniture-sofa': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop',
  'furniture-beds': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop',
  'furniture-dining': 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=800&auto=format&fit=crop',
  'furniture-office': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
  'furniture-chairs': 'https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=80&w=800&auto=format&fit=crop',

  // Home Appliances
  'appliances-ac': 'https://images.unsplash.com/photo-1545601264-b0351db7aeac?q=80&w=800&auto=format&fit=crop',
  'appliances-fridge': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop',
  'appliances-washing': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=800&auto=format&fit=crop',
  'appliances-other': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',

  // Jobs & Careers
  'jobs-it': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
  'jobs-office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
  'jobs-manufacturing': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
  'jobs-driver': 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop',
  'jobs-healthcare': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop',
  'jobs-retail': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop',
  'jobs-education': 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
  'jobs-construction': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
  'jobs-wfh': 'https://images.unsplash.com/photo-1593642532400-2682810df593?q=80&w=800&auto=format&fit=crop',
};

const DEFAULT_CATEGORY_IMG = 'https://images.unsplash.com/photo-1556761175-5973b0ceafcf?q=80&w=800&auto=format&fit=crop';
const DEFAULT_SUBCATGORY_IMG = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop';

const CategoryCard = ({ category }: CategoryCardProps) => {
  const count = category._count ? category._count.ads : 0;
  const bgImage = CATEGORY_IMAGES[category.slug] || DEFAULT_CATEGORY_IMG;

  return (
    <div className="relative group h-48 md:h-56">
      <Link
        to={`/listings?category=${category.slug}`}
        className="block w-full h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative border-2 border-transparent hover:border-primary/50"
      >
        <img
          src={bgImage}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">
          <h3 className="text-white font-bold text-lg md:text-xl drop-shadow-md">{category.name}</h3>
          <div className="text-white/90 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 mt-2">
            Explore <ArrowLeft className="h-4 w-4 rotate-180" />
          </div>
        </div>
      </Link>

      {/* Hover Dropdown Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="absolute top-full left-0 mt-3 w-full bg-card/95 backdrop-blur-2xl border border-border rounded-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40 overflow-hidden transform origin-top scale-95 group-hover:scale-100">
          <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
            {category.subcategories.map((sub: any) => (
              <Link
                key={sub.id}
                to={`/${category.slug}/${sub.slug}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/80 transition-colors group/sub"
                title={sub.name}
              >
                <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0 relative">
                  <img
                    src={SUBCATEGORY_IMAGES[sub.slug] || DEFAULT_SUBCATGORY_IMG}
                    alt={sub.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover/sub:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block truncate font-medium text-sm text-foreground">{sub.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
