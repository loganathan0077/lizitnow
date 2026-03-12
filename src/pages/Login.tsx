import API_BASE from '@/lib/api';
import { useState, useRef, useCallback, useEffect } from 'react';
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
  CheckCircle,
  Loader2
} from 'lucide-react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';
import type { ConfirmationResult } from '@/lib/firebase';

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

  // OTP State
  const [otpStep, setOtpStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<any>(null);

  const navigate = useNavigate();

  // Initialize reCAPTCHA when phone tab is selected
  const setupRecaptcha = useCallback(() => {
    if (recaptchaRef.current) return; // already set up
    try {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => { /* reCAPTCHA solved */ },
        'expired-callback': () => {
          recaptchaRef.current = null;
        }
      });
    } catch (err) {
      console.error('reCAPTCHA setup error:', err);
    }
  }, []);

  useEffect(() => {
    if (method === 'phone') {
      // Short delay to ensure DOM element exists
      const timer = setTimeout(setupRecaptcha, 300);
      return () => clearTimeout(timer);
    }
  }, [method, setupRecaptcha]);

  // Send OTP
  const handleSendOTP = async () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      toast.error('Invalid phone number', { description: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setOtpSending(true);
    try {
      setupRecaptcha();
      const fullPhone = `+91${cleanPhone}`;
      const result = await signInWithPhoneNumber(auth, fullPhone, recaptchaRef.current);
      setConfirmationResult(result);
      setOtpStep('otp');
      toast.success('OTP Sent!', { description: `Verification code sent to ${fullPhone}` });
    } catch (err: any) {
      console.error('OTP send error:', err);
      const msg = err.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again later.'
        : err.code === 'auth/invalid-phone-number'
          ? 'Invalid phone number format.'
          : 'Failed to send OTP. Please try again.';
      toast.error('OTP Failed', { description: msg });
      // Reset reCAPTCHA on fail
      recaptchaRef.current = null;
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!confirmationResult) return;
    if (otp.length !== 6) {
      toast.error('Invalid OTP', { description: 'Please enter the 6-digit code.' });
      return;
    }

    setOtpVerifying(true);
    try {
      const credential = await confirmationResult.confirm(otp);
      const idToken = await credential.user.getIdToken();

      // Send Firebase token to backend
      const res = await fetch(`${API_BASE}/api/auth/firebase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Backend auth failed');

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', data.token);
      toast.success('Login Successful!', { description: 'Welcome to Liztitnow.com!' });
      navigate('/dashboard');
    } catch (err: any) {
      console.error('OTP verify error:', err);
      const msg = err.code === 'auth/invalid-verification-code'
        ? 'Incorrect OTP. Please try again.'
        : err.message || 'Verification failed. Please try again.';
      toast.error('Verification Failed', { description: msg });
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (method === 'phone') {
      if (otpStep === 'phone') {
        handleSendOTP();
      } else {
        handleVerifyOTP();
      }
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

            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => {
                window.location.href = `${API_BASE}/auth/google`;
              }}
              className="w-full flex items-center justify-center gap-3 h-12 px-4 rounded-xl border border-border bg-card text-foreground font-medium text-sm hover:bg-secondary transition-colors mb-6"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-xs text-muted-foreground font-medium uppercase">or</span>
              <div className="flex-1 h-px bg-border"></div>
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
                <div className="space-y-4">
                  {otpStep === 'phone' ? (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <div className="flex gap-2 overflow-hidden">
                        <div className="w-16 shrink-0 h-12 px-2 rounded-xl bg-secondary flex items-center justify-center text-foreground font-medium text-sm">
                          +91
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="9876543210"
                          maxLength={10}
                          className="flex-1 min-w-0 h-12 px-4 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-2">
                        <p className="text-sm text-muted-foreground">
                          OTP sent to <span className="font-medium text-foreground">+91 {phone}</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => { setOtpStep('phone'); setOtp(''); setConfirmationResult(null); recaptchaRef.current = null; }}
                          className="text-xs text-primary hover:underline mt-1"
                        >
                          Change number
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Enter OTP
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          className="w-full h-12 px-4 rounded-xl bg-secondary border-0 text-foreground text-center text-lg tracking-[0.5em] placeholder:tracking-normal placeholder:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                          autoFocus
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {mode === 'login' && method === 'email' && (
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button variant="accent" size="lg" className="w-full" disabled={otpSending || otpVerifying}>
                {otpSending || otpVerifying ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : method === 'phone' ? (
                  otpStep === 'phone' ? 'Send OTP' : 'Verify OTP'
                ) : (
                  mode === 'login' ? 'Login' : 'Create Account'
                )}
                {!otpSending && !otpVerifying && <ArrowRight className="h-5 w-5" />}
              </Button>
              {/* Firebase reCAPTCHA container */}
              <div id="recaptcha-container"></div>
            </form>


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
