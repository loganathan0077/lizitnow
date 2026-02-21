import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-16 px-4">
                <div className="container max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-display font-bold mb-4">Membership Pricing</h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Simple, honest pricing for serious sellers.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
                        {/* Free Tier */}
                        <div className="card-premium p-8 relative">
                            <h3 className="text-2xl font-semibold mb-2">New Sellers</h3>
                            <div className="text-4xl font-bold mb-6 font-display">Free</div>
                            <ul className="space-y-4 mb-8 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-trust-green" />
                                    <span>Post up to 5 ads for free</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-trust-green" />
                                    <span>Reach local buyers</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-muted-foreground/30" />
                                    <span className="text-muted-foreground/50">Unlimited posting</span>
                                </li>
                            </ul>
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/signup">Start for Free</Link>
                            </Button>
                        </div>

                        {/* Pro Tier */}
                        <div className="relative rounded-2xl bg-gradient-to-br from-primary to-olive-dark p-[2px]">
                            <div className="absolute top-0 right-8 -translate-y-1/2 bg-amber text-amber-950 px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                Most Popular
                            </div>
                            <div className="bg-foreground rounded-[14px] p-8 h-full text-primary-foreground relative overflow-hidden">
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl mix-blend-screen" />

                                <h3 className="text-2xl font-semibold mb-2">Verified Members</h3>
                                <div className="text-4xl font-bold mb-1 font-display">₹100</div>
                                <div className="text-sm text-primary-foreground/70 mb-6">for 6 months validity</div>

                                <ul className="space-y-4 mb-8 text-primary-foreground/90">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-trust-green" />
                                        <span>Post unlimited ads</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-trust-green" />
                                        <span>Verified Seller Badge</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-trust-green" />
                                        <span>Valid for full 6 months</span>
                                    </li>
                                </ul>
                                <Button variant="accent" className="w-full" asChild>
                                    <Link to="/dashboard">Get Membership Now</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Pricing;
