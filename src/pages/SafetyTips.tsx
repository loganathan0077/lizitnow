import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ShieldAlert, AlertTriangle, Eye, CreditCard } from 'lucide-react';

const SafetyTips = () => {
    const tips = [
        {
            icon: <Eye className="w-8 h-8 text-blue-500" />,
            title: "Meet in Person in Public Places",
            desc: "Always arrange to meet the buyer or seller in a well-lit, busy public place like a mall, cafe, or near a police station. Avoid secluded areas or meeting late at night."
        },
        {
            icon: <ShieldAlert className="w-8 h-8 text-trust-green" />,
            title: "Inspect the Item thoroughly",
            desc: "Before making any payment, take the time to inspect the item to ensure it matches the description. If it's electronics, turn it on and test its basic functions."
        },
        {
            icon: <CreditCard className="w-8 h-8 text-amber" />,
            title: "Beware of Advance Payments",
            desc: "Never pay in advance for an item before seeing it. Scammers often ask for token advances through UPI to 'reserve' the item. Only pay directly when you have the item in hand."
        },
        {
            icon: <AlertTriangle className="w-8 h-8 text-destructive" />,
            title: "If It's Too Good to Be True, It Probably Is",
            desc: "Be cautious of items priced drastically lower than market value. High-end phones, bikes, or cars offered for a fraction of their real price are often stolen or counterfeit."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-16 px-4">
                <div className="container max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-display font-bold mb-4">Safety & Security</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We take the safety of our buyers and sellers very seriously.
                            Follow these core guidelines to ensure a smooth, risk-free transaction.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {tips.map((tip, index) => (
                            <div key={index} className="bg-card p-8 rounded-2xl border border-border shadow-soft hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
                                    {tip.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {tip.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center">
                        <h3 className="text-2xl font-bold text-destructive mb-3">Report Suspicious Activity</h3>
                        <p className="text-muted-foreground mb-0">
                            If you feel someone is trying to scam you, do not proceed with the transaction.
                            Report the user immediately so our moderation team can take action and keep Liztitnow.com safe.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SafetyTips;
