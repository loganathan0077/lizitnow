import API_BASE from '@/lib/api';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            setSent(true);
            toast.success('Email Sent', { description: data.message });
        } catch (err: any) {
            toast.error('Failed', { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="p-6 sm:p-8 rounded-2xl bg-card shadow-soft border border-border/50">
                        {!sent ? (
                            <>
                                <div className="text-center mb-6">
                                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="h-7 w-7 text-primary" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
                                    <p className="text-muted-foreground text-sm mt-2">
                                        Enter your email and we'll send you a link to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    <Button variant="accent" size="lg" className="w-full" disabled={loading}>
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Link'}
                                        {!loading && <ArrowRight className="h-5 w-5" />}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-7 w-7 text-green-600" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground mb-2">Check Your Email</h2>
                                <p className="text-muted-foreground text-sm mb-4">
                                    If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Don't see the email? Check your spam folder or{' '}
                                    <button onClick={() => setSent(false)} className="text-primary hover:underline">
                                        try again
                                    </button>
                                </p>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ForgotPassword;
