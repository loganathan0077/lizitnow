import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Map, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
    const sitemapLinks = [
        {
            title: "Main Pages",
            links: [
                { name: "Home", path: "/" },
                { name: "Browse All Ads", path: "/listings" },
                { name: "Post an Ad", path: "/post-ad" },
                { name: "How It Works", path: "/how-it-works" },
                { name: "Membership Pricing", path: "/pricing" }
            ]
        },
        {
            title: "User Account",
            links: [
                { name: "Login / Sign Up", path: "/login" },
                { name: "My Dashboard", path: "/dashboard" },
                { name: "Wallet & Referral", path: "/dashboard/wallet" },
                { name: "Verify Account", path: "/verification" }
            ]
        },
        {
            title: "Support & Legal",
            links: [
                { name: "Help Center", path: "/help" },
                { name: "Safety Tips", path: "/safety" },
                { name: "Contact Us", path: "/contact" },
                { name: "Report an Issue", path: "/report" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" }
            ]
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-16 px-4">
                <div className="container max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                            <Map className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl font-display font-bold mb-4">Sitemap</h1>
                        <p className="text-lg text-muted-foreground">
                            Navigate through all sections of Liztitnow.com
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {sitemapLinks.map((section, index) => (
                            <div key={index} className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                                <h2 className="text-xl font-bold mb-4 border-b pb-2">{section.title}</h2>
                                <ul className="space-y-3">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link
                                                to={link.path}
                                                className="flex items-center text-muted-foreground hover:text-primary transition-colors group"
                                            >
                                                <ChevronRight className="h-4 w-4 mr-2 text-primary/50 group-hover:text-primary transition-colors" />
                                                <span>{link.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Sitemap;
