import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

const HelpCenter = () => {
    const faqs = [
        {
            question: "How do I post my first ad?",
            answer: "Posting an ad is simple and free! Sign up or log into your account, click the 'Post an Ad' button in the top navigation, and fill in the details of the item you want to sell. As a new user, your first 5 ads are completely free."
        },
        {
            question: "What is the 5 Free Ads limit?",
            answer: "To ensure a high-quality marketplace, we offer every new user the ability to post 5 ads for free. Once you reach this limit, you must purchase a 6-month Verify Membership for ₹100 to continue posting unlimited ads."
        },
        {
            question: "How long is the ₹100 membership valid?",
            answer: "The membership grants you verified seller status and unlimited ad posting capabilities for a full 6 months from the date of purchase. It acts as a one-time flat fee with no hidden subscription traps."
        },
        {
            question: "How does the referral system work?",
            answer: "When a new user signs up using your unique referral code, you will earn a ₹50 bonus directly to your Wallet once that user purchases their first ₹100 membership. It's our way of saying thank you for growing the community!"
        },
        {
            question: "How do I report a suspicious ad or user?",
            answer: "Your safety is our priority. If you encounter a suspicious ad, you can use the 'Report an Issue' page linked in the footer, or contact our support team directly. We investigate all reports promptly and ban fraudulent users."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-16 px-4">
                <div className="container max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                            <HelpCircle className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl font-display font-bold mb-4">Help Center</h1>
                        <p className="text-lg text-muted-foreground">
                            Frequently asked questions and support for Liztitnow.com users.
                        </p>
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft">
                        <h2 className="text-2xl font-bold mb-6 border-b pb-4">Frequently Asked Questions</h2>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary transition-colors">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HelpCenter;
