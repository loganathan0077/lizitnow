import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-16 px-4">
                <div className="container max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                            <Shield className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl font-display font-bold mb-4">Privacy Policy</h1>
                        <p className="text-lg text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft prose prose-gray dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4 mt-0">1. Information We Collect</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            When you register for an account, post an ad, or interact with our platform, we may collect personal information such as your name, email address, phone number, and location. We also collect data regarding your device, IP address, and platform usage to improve our services and ensure security.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            We use the information we collect to operate, evaluate, and improve our services. Specifically, we use your data to facilitate communication between buyers and sellers, verify accounts, process membership payments, display relevant ads, and prevent fraudulent or illegal activities.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">3. Sharing of Information</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            We do not sell your personal information to third parties. We may share necessary information with trusted service providers who assist us in operating our platform (such as payment processors). We may also disclose information if required by law or to protect the rights and safety of our users.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet-based service is completely secure, and you use our platform at your own risk.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            You have the right to access, correct, or delete your personal data. You can manage your account information directly from your dashboard or contact our support team for assistance.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at privacy@liztitnow.com or utilize our Contact Us page.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
