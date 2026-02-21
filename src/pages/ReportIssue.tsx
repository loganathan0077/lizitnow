import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Flag, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const ReportIssue = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API request
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success('Report Submitted', {
                description: 'Thank you. Our moderation team will investigate this immediately.'
            });
            // @ts-ignore
            e.target.reset();
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-16 px-4">
                <div className="container max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6 text-destructive">
                            <ShieldAlert className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl font-display font-bold mb-4">Report an Issue</h1>
                        <p className="text-lg text-muted-foreground">
                            Help us keep the community safe. Reporting suspicious ads or fraudulent users is strictly confidential.
                        </p>
                    </div>

                    <div className="bg-card p-8 rounded-2xl border border-destructive/20 shadow-soft">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-4">
                                <label className="text-sm font-semibold text-foreground">Why are you reporting this?</label>
                                <div className="space-y-3">
                                    {['Spam or misleading', 'Fraud or Scam', 'Inappropriate Content', 'Other'].map((reason, idx) => (
                                        <label key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-secondary/50 transition-colors">
                                            <input type="radio" name="reason" value={reason} className="w-4 h-4 text-primary" required />
                                            <span className="text-foreground">{reason}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="url" className="text-sm font-semibold text-foreground">Ad URL or User ID (Optional)</label>
                                <input
                                    type="text"
                                    id="url"
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="https://liztitnow.com/listing/..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-semibold text-foreground">Description of the Incident</label>
                                <textarea
                                    id="description"
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                    placeholder="Please provide specific details so our moderation team can investigate easily..."
                                />
                            </div>

                            <Button type="submit" variant="destructive" size="lg" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting Report...' : (
                                    <>
                                        Submit Report
                                        <Flag className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ReportIssue;
