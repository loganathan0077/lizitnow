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
                    <h1 className="text-4xl font-display font-bold mb-4">Pricing Plans Structure</h1>
                    <p className="text-xl text-muted-foreground mb-12">
                        Start for free, then pay as you post.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
                        {/* Starter Plan (Free Tier) */}
                        <div className="card-premium p-8 relative">
                            <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                Starter Plan
                            </h3>
                            <div className="text-sm text-muted-foreground font-medium mb-4">(For New Users)</div>
                            <div className="text-4xl font-bold mb-6 font-display">2 Ads <span className="text-lg text-green-600 font-bold uppercase">Free</span></div>
                            <ul className="space-y-4 mb-8 text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-trust-green" />
                                    <span>No payment required</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-trust-green" />
                                    <span>Perfect for first-time sellers</span>
                                </li>
                            </ul>
                            <Button variant="outline" className="w-full text-lg mt-auto" asChild>
                                <Link to="/signup">👉 Start Free</Link>
                            </Button>
                        </div>

                        {/* Launch Offer Plan */}
                        <div className="relative rounded-2xl bg-gradient-to-br from-primary to-olive-dark p-[2px] mt-4 md:mt-0">
                            <div className="absolute top-0 right-8 -translate-y-1/2 bg-amber text-amber-950 px-3 py-1 rounded-full text-sm font-bold shadow-lg z-20">
                                Launch Offer
                            </div>
                            <div className="bg-foreground rounded-[14px] p-8 h-full text-primary-foreground relative overflow-hidden flex flex-col z-10">
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl mix-blend-screen" />

                                <h3 className="text-2xl font-semibold mb-2">Launch Offer Plan</h3>
                                <div className="text-4xl font-bold mb-6 font-display">₹1<span className="text-lg text-primary-foreground/70 font-normal">/ad</span></div>
                                <ul className="space-y-4 mb-8 text-primary-foreground/90">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-trust-green" />
                                        <span>Post up to 30 ads at ₹1 each</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-trust-green" />
                                        <span>Minimum Wallet Recharge: ₹20</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-trust-green" />
                                        <span>Pay as you post</span>
                                    </li>
                                </ul>
                                <Button variant="accent" className="w-full text-lg mt-auto" asChild>
                                    <Link to="/post-ad">Get Started</Link>
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
