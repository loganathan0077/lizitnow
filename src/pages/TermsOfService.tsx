import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BookOpen } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-16 px-4">
                <div className="container max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                            <BookOpen className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl font-display font-bold mb-4">Terms of Service</h1>
                        <p className="text-lg text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft prose prose-gray dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold mb-4 mt-0">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            By accessing or using Liztitnow.com, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Liztitnow.com is an online marketplace that allows users to buy and sell goods and services. We are not a party to any transaction between buyers and sellers and do not guarantee the quality, safety, or legality of the items advertised.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            To use certain features of the platform, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">4. Posting Rules and Guidelines</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Users may post a maximum of 5 free ads. Beyond this limit, a verified membership is required. You may not post ads that are illegal, fraudulent, misleading, or violate our community guidelines. We reserve the right to remove any content that violates these terms.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            In no event shall Liztitnow.com or its affiliates be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the platform. We provide the service on an "as is" and "as available" basis without any warranties.
                        </p>

                        <h2 className="text-2xl font-bold mb-4">6. Changes to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to modify these Terms of Service at any time. Your continued use of the platform following the posting of changes constitutes your acceptance of such changes.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfService;
