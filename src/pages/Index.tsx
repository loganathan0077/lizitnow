import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedListings from '@/components/home/FeaturedListings';
import TrustFeatures from '@/components/home/TrustFeatures';
import TokenCTA from '@/components/home/TokenCTA';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedListings />
        <TrustFeatures />
        <TokenCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
