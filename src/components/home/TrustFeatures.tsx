import { Shield, BadgeCheck, Ban, Coins } from 'lucide-react';

const features = [
  {
    icon: BadgeCheck,
    title: 'Verified Sellers',
    description: 'Every seller undergoes mobile and email verification. Trust badges show credibility at a glance.',
    color: 'text-trust-green',
    bg: 'bg-trust-green/10',
  },
  {
    icon: Ban,
    title: 'No Spam, No Scams',
    description: 'Our token-based system ensures only serious sellers post ads. Say goodbye to fake listings.',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  {
    icon: Coins,
    title: 'Fair Token System',
    description: 'Get 20 free tokens on signup. Post ads for just 5 tokens each. Recharge anytime from ₹100.',
    color: 'text-amber',
    bg: 'bg-amber/10',
  },
  {
    icon: Shield,
    title: 'Admin Moderated',
    description: 'Every ad is reviewed before going live. Suspicious content gets blocked immediately.',
    color: 'text-trust-premium',
    bg: 'bg-trust-premium/10',
  },
];

const TrustFeatures = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container-tight">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Liztitnow.com?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We've built a marketplace where trust comes first. No more wasting time on fake ads or unserious buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card-premium p-6 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustFeatures;
