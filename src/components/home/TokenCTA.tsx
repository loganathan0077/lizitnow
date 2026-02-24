import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Coins, ArrowRight } from 'lucide-react';

const TokenCTA = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container-tight">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-olive-dark p-8 md:p-12 lg:p-16">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-primary-foreground/10 rounded-full blur-2xl" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-4">
                <Coins className="h-4 w-4" />
                <span>Launch Offer Plan</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                30 Ads @ <span className="text-amber">₹1 per ad</span>
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-xl mb-2">
                <span className="font-semibold text-white">Minimum Wallet Recharge: ₹20</span>
              </p>
              <p className="text-primary-foreground/60">
                Pay as you post • Limited-time launch offer
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="accent"
                size="xl"
                className="min-w-[180px]"
                asChild
              >
                <Link to="/post-ad">
                  Get Started

                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="min-w-[180px] border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link to="/how-it-works">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenCTA;
