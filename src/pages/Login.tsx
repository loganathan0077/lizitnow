import API_BASE from '@/lib/api';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle
} from 'lucide-react';

const Login = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isGstRegistered, setIsGstRegistered] = useState(false);
  const [gstin, setGstin] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (method === 'phone') {
      toast.info('Phone login not implemented yet.', { description: 'Please use Email Login.' });
      return;
    }

    try {
      if (mode === 'login') {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to login');

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', data.token);

        toast.success('Login Successful', { description: 'Welcome back to Liztitnow.com!' });
        navigate('/dashboard');
      } else {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, referredByCode: referralCode || undefined, gstin: gstin || undefined })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to register');

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', data.token);

        toast.success('Registration Successful', { description: 'Welcome to Liztitnow.com!' });
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(mode === 'login' ? 'Login Failed' : 'Registration Failed', {
        description: err.message || 'Check your details and try again',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="card-premium p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'login'
                  ? 'Login to your Liztitnow.com account'
                  : 'Join our trusted marketplace'}
              </p>
            </div>

            {/* Method Tabs */}
            <div className="flex gap-2 p-1 bg-secondary rounded-xl mb-6">
              <button
                onClick={() => setMethod('email')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${method === 'email'
                  ? 'bg-card text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Mail className="h-4 w-4" />
                Email
              </button>
              <button
                onClick={() => setMethod('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${method === 'phone'
                  ? 'bg-card text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Phone className="h-4 w-4" />
                Phone
              </button>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleLogin}>
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              {method === 'email' ? (
                <>
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
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full h-12 px-4 pr-12 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Referral Code (Optional)
                        </label>
                        <input
                          type="text"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value)}
                          placeholder="e.g. A1B2C3"
                          className="w-full h-12 px-4 mb-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-4 mt-2">
                          <input
                            type="checkbox"
                            id="gstRegistered"
                            checked={isGstRegistered}
                            onChange={(e) => {
                              setIsGstRegistered(e.target.checked);
                              if (!e.target.checked) setGstin('');
                            }}
                            className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary/20"
                          />
                          <label htmlFor="gstRegistered" className="text-sm font-medium text-foreground">
                            GST Registered?
                          </label>
                        </div>

                        {isGstRegistered && (
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              GSTIN / GST Number
                            </label>
                            <input
                              type="text"
                              value={gstin}
                              onChange={(e) => setGstin(e.target.value.toUpperCase())}
                              placeholder="e.g. 07AAAAA0000A1Z5"
                              required={isGstRegistered}
                              pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                              title="Please enter a valid 15-character Indian GSTIN"
                              className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <div className="w-20 h-12 px-3 rounded-xl bg-secondary flex items-center justify-center text-foreground font-medium">
                      +91
                    </div>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      className="flex-1 h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && method === 'email' && (
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button variant="accent" size="lg" className="w-full">
                {mode === 'login' ? 'Login' : 'Create Account'}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>

            {/* Signup Benefits */}
            {mode === 'signup' && (
              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-trust-green mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Get 20 Free Tokens!</p>
                    <p className="text-xs text-muted-foreground">Post your first 4 ads completely free</p>
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Mode */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-primary font-medium hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Login'}
              </button>
            </div>
          </div>

          {/* Trust Note */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
