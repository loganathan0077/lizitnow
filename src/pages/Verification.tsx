import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Upload, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Verification = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    const handleVerification = () => {
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            localStorage.setItem('isVerified', 'true');
            setIsSubmitting(false);

            toast.success('Verification Successful!', {
                description: 'You are now a verified seller on TrustMart.',
            });

            navigate('/dashboard');
        }, 2000); // 2 second delay for realism
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-lg">
                    <div className="card-premium p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-trust-green/10 flex items-center justify-center mx-auto mb-4">
                                <BadgeCheck className="h-8 w-8 text-trust-green" />
                            </div>
                            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                                Get Verified
                            </h1>
                            <p className="text-muted-foreground">
                                To ensure a safe marketplace, we require all sellers to verify their identity.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Step 1: ID Upload */}
                            <div className={`p-4 rounded-xl border ${step === 1 ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-foreground mb-1">Government ID</h3>
                                        <p className="text-sm text-muted-foreground mb-4">Upload a clear photo of your Aadhar Card, PAN Card, or Driving License.</p>

                                        {step === 1 && (
                                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => setStep(2)}>
                                                <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                                                <span className="text-sm text-primary font-medium">Click to upload document</span>
                                            </div>
                                        )}
                                        {step > 1 && (
                                            <div className="flex items-center gap-2 text-trust-green text-sm font-medium">
                                                <ShieldCheck className="h-4 w-4" />
                                                Document Uploaded
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Phone Verification */}
                            <div className={`p-4 rounded-xl border ${step === 2 ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step === 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-foreground mb-1">Phone Verification</h3>
                                        <p className="text-sm text-muted-foreground mb-4">We'll verify the number linked to your account.</p>

                                        {step === 2 && (
                                            <div className="flex gap-2">
                                                <div className="w-16 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-medium">+91</div>
                                                <input type="text" value="9876543210" disabled className="flex-1 h-10 px-3 rounded-lg bg-secondary border-0 text-muted-foreground text-sm" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="accent"
                                size="lg"
                                className="w-full"
                                onClick={handleVerification}
                                disabled={step < 2 || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Complete Verification
                                        <ArrowRight className="h-5 w-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Verification;
