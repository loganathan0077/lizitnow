import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { UserPlus, Megaphone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HowItWorks = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-16 px-4">
                <div className="container max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-display font-bold mb-4">How It Works</h1>
                        <p className="text-xl text-muted-foreground">
                            A trusted marketplace built for genuine buyers and sellers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Step 1 */}
                        <div className="text-center relative">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary z-10 relative">
                                <UserPlus className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">1. Sign Up</h3>
                            <p className="text-muted-foreground">
                                Create your account in seconds using mobile and email verification. Start exploring the marketplace instantly.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center relative">
                            <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-6 text-amber z-10 relative">
                                <Megaphone className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">2. Post 5 Free Ads</h3>
                            <p className="text-muted-foreground">
                                New users get 5 free ads on signup. List your items quickly and connect with buyers in your area.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center relative">
                            <div className="w-16 h-16 rounded-full bg-trust-green/10 flex items-center justify-center mx-auto mb-6 text-trust-green z-10 relative">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">3. Recharge & Post More Ads</h3>
                            <p className="text-muted-foreground">
                                Need to post more? Simply recharge your wallet from ₹50 and post ads for just ₹1 per ad.<br />
                                Each ad stays active for 90 days.
                            </p>
                        </div>

                        {/* Connecting Line (desktop only) */}
                        <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-[2px] bg-border -z-10" />
                    </div>

                    <div className="mt-16 text-center">
                        <Button variant="accent" size="lg" asChild>
                            <Link to="/signup">Get Started for Free</Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HowItWorks;
