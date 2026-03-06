import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Completing sign in...');

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            setStatus('Sign in failed');
            toast.error('Google Sign In Failed', {
                description: 'Something went wrong. Please try again.',
            });
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        if (token) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('token', token);
            toast.success('Login Successful', {
                description: 'Welcome to Liztitnow.com!',
            });
            navigate('/dashboard');
        } else {
            setStatus('No authentication token received');
            toast.error('Authentication Error', {
                description: 'No token received. Please try again.',
            });
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-foreground font-medium">{status}</p>
            </div>
        </div>
    );
};

export default GoogleCallback;
