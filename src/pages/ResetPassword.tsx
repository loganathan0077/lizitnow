import API_BASE from '@/lib/api';
import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Lock, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const passwordChecks = {
        length: password.length >= 6,
        match: password === confirmPassword && confirmPassword.length > 0,
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error('Invalid Link', { description: 'Reset token is missing.' });
            return;
        }

        if (password.length < 6) {
            toast.error('Weak Password', { description: 'Password must be at least 6 characters.' });
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Mismatch', { description: 'Passwords do not match.' });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Reset failed');

            setSuccess(true);
            toast.success('Password Reset!', { description: data.message });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            toast.error('Reset Failed', { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <h1 className="text-2xl font-bold text-foreground mb-3">Invalid Reset Link</h1>
                        <p className="text-muted-foreground mb-6">
                            This password reset link is invalid or has expired. Please request a new one.
                        </p>
                        <Link to="/forgot-password">
                            <Button variant="accent">Request New Link</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="p-6 sm:p-8 rounded-2xl bg-card shadow-soft border border-border/50">
                        {!success ? (
                            <>
                                <div className="text-center mb-6">
                                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="h-7 w-7 text-primary" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-foreground">Set New Password</h1>
                                    <p className="text-muted-foreground text-sm mt-2">
                                        Enter your new password below.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Enter new password"
                                                required
                                                className="w-full h-12 px-4 pr-12 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Confirm Password
                                        </label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            required
                                            className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>

                                    {/* Password strength indicators */}
                                    <div className="space-y-1">
                                        <div className={`flex items-center gap-2 text-xs ${passwordChecks.length ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            At least 6 characters
                                        </div>
                                        <div className={`flex items-center gap-2 text-xs ${passwordChecks.match ? 'text-green-600' : 'text-muted-foreground'}`}>
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            Passwords match
                                        </div>
                                    </div>

                                    <Button
                                        variant="accent"
                                        size="lg"
                                        className="w-full"
                                        disabled={loading || !passwordChecks.length || !passwordChecks.match}
                                    >
                                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Reset Password'}
                                        {!loading && <ArrowRight className="h-5 w-5" />}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-7 w-7 text-green-600" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground mb-2">Password Updated!</h2>
                                <p className="text-muted-foreground text-sm">
                                    Redirecting you to login...
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

export default ResetPassword;
