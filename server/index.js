const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Razorpay = require('razorpay');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();
const { generateInvoicePDF } = require('./utils/invoiceGenerator');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

const app = express();
const prisma = new PrismaClient();

// Configure CORS and JSON parsing
app.use(cors({
    origin: '*', // For development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-development';

// Frontend URL for OAuth redirects
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ==========================================
// PASSPORT GOOGLE OAUTH SETUP
// ==========================================
let googleOAuthEnabled = false;

try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.warn('[OAuth] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Google OAuth disabled.');
    } else {
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/auth/google/callback',
            scope: ['profile', 'email']
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const googleId = profile.id;
                const name = profile.displayName;
                const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

                // Check if user exists by email or googleId
                let user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email },
                            { googleId }
                        ]
                    }
                });

                if (user) {
                    // Link googleId if not already linked
                    if (!user.googleId) {
                        user = await prisma.user.update({
                            where: { id: user.id },
                            data: { googleId, avatarUrl: user.avatarUrl || avatar }
                        });
                    }
                } else {
                    // Create new user
                    user = await prisma.user.create({
                        data: {
                            name,
                            email,
                            password: null,
                            googleId,
                            avatarUrl: avatar,
                            referralCode: crypto.randomBytes(3).toString('hex').toUpperCase(),
                        }
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }));

        passport.serializeUser((user, done) => done(null, user.id));
        passport.deserializeUser(async (id, done) => {
            try {
                const user = await prisma.user.findUnique({ where: { id } });
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        });

        googleOAuthEnabled = true;
        console.log('[OAuth] Google OAuth configured successfully.');
        console.log('[OAuth] Callback URL:', process.env.GOOGLE_CALLBACK_URL);
    }
} catch (err) {
    console.error('[OAuth] Failed to initialize Google OAuth:', err.message);
}

app.use(passport.initialize());

// ==========================================
// FIREBASE ADMIN SDK SETUP
// ==========================================
let firebaseEnabled = false;
try {
    if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            }),
        });
        firebaseEnabled = true;
        console.log('[Firebase] Admin SDK initialized successfully.');
    } else {
        console.warn('[Firebase] FIREBASE_PROJECT_ID not set. Firebase auth disabled.');
    }
} catch (err) {
    console.error('[Firebase] Failed to initialize Admin SDK:', err.message);
}

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SKnTW4vdIbLtKk',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'jZmMEEfXwRbXTtRg5UGWvKvZ',
});

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, PNG, JPEG, and WEBP are allowed.'));
        }
    }
});

// Helper: Upload Buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'ads' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        const { Readable } = require('stream');
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        stream.pipe(uploadStream);
    });
};

// Health Check Route
app.get('/health', async (req, res) => {
    try {
        const userCount = await prisma.user.count();
        const categoryCount = await prisma.category.count();
        const adCount = await prisma.ad.count();
        res.json({
            status: 'OK',
            database: 'Connected',
            counts: { users: userCount, categories: categoryCount, ads: adCount },
            cloudinary: {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
                api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
                api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            database: 'Disconnected',
            error: error.message,
            cloudinary: {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
                api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
                api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
            },
            timestamp: new Date().toISOString()
        });
    }
});

// Cloudinary Test Route
app.get('/health/cloudinary', async (req, res) => {
    try {
        // 1x1 transparent GIF buffer
        const buffer = Buffer.from('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64');
        const url = await uploadToCloudinary(buffer);
        res.json({
            status: 'OK',
            message: 'Cloudinary upload succeeded',
            url: url
        });
    } catch (error) {
        console.error('Cloudinary Test Failed:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Cloudinary upload failed',
            error: error.message,
            stack: error.stack
        });
    }
});

// Diagnostic Route: Raw Ads Check
app.get('/health/ads', async (req, res) => {
    try {
        const ads = await prisma.ad.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { category: true }
        });
        res.json({ status: 'OK', ads });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', error: error.message });
    }
});

// Middleware: Authenticate User
const authenticate = (req, res, next) => {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
        token = req.query.token; // Support for file downloads via direct URL
    }

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware: Authenticate Admin
const isAdmin = async (req, res, next) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }
    next();
};

// Helper: Generate a random 6-character referral code
const generateReferralCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone, referredByCode, gstin } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        let referredBy = null;

        // Validate referral code if provided
        if (referredByCode) {
            const referrer = await prisma.user.findUnique({ where: { referralCode: referredByCode } });
            if (referrer) {
                referredBy = referrer.referralCode;
            } else {
                return res.status(400).json({ error: 'Invalid referral code' });
            }
        }

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                referredBy,
                referralCode: generateReferralCode(),
                gstin: gstin ? gstin.toUpperCase() : null
            },
        });

        // Create a pending referral record if a valid code was used
        if (referredBy) {
            const referrer = await prisma.user.findUnique({ where: { referralCode: referredBy } });
            if (referrer) {
                await prisma.referral.create({
                    data: {
                        referrerId: referrer.id,
                        referredUserId: newUser.id,
                        status: 'pending', // Will become 'paid' upon membership purchase
                    }
                });
            }
        }

        const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'User created successfully', token, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // If user signed up via Google and has no password
        if (!user.password) {
            return res.status(401).json({ error: 'This account uses Google login. Please use "Continue with Google" instead.' });
        }

        // Compare with bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==========================================
// FORGOT / RESET PASSWORD
// ==========================================

// Forgot Password — send reset link via email
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal if email exists or not (security)
            return res.json({ message: 'If this email is registered, you will receive a password reset link.' });
        }

        // Google-only users can't reset password
        if (user.googleId && !user.password) {
            return res.json({ message: 'If this email is registered, you will receive a password reset link.' });
        }

        // Generate secure token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry }
        });

        // Send email
        const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: 'Reset Your Password — Liztitnow.com',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Password Reset</h2>
                    <p>Hi ${user.name || 'there'},</p>
                    <p>We received a request to reset your password. Click the button below to set a new password:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #e87461; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
                    <p style="color: #666; font-size: 14px;">This link will expire in <strong>30 minutes</strong>.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="color: #999; font-size: 12px;">Liztitnow.com</p>
                </div>
            `,
        });

        res.json({ message: 'If this email is registered, you will receive a password reset link.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Failed to process request. Please try again.' });
    }
});

// Reset Password — validate token and update password
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset link. Please request a new one.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        res.json({ message: 'Password reset successful! You can now login with your new password.' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password. Please try again.' });
    }
});

// Get current user details
app.get('/api/auth/me', authenticate, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true, name: true, email: true, phone: true, role: true,
                walletBalance: true, referralCode: true, membershipExpiry: true,
                adsPosted: true, gstin: true, createdAt: true,
                avatarUrl: true, bannerImage: true, address: true,
                facebookUrl: true, instagramUrl: true, twitterUrl: true,
                isGstVerified: true
            }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update User Profile
app.put('/api/auth/profile', authenticate, async (req, res) => {
    try {
        const { name, phone, address, gstin, facebookUrl, instagramUrl, twitterUrl } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                name,
                phone,
                address,
                gstin: gstin ? gstin.toUpperCase() : null,
                facebookUrl,
                instagramUrl,
                twitterUrl
            },
            select: {
                id: true, name: true, email: true, phone: true, address: true, role: true,
                walletBalance: true, referralCode: true, membershipExpiry: true,
                adsPosted: true, gstin: true, facebookUrl: true, instagramUrl: true, twitterUrl: true
            }
        });

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
});

// ==========================================
// GOOGLE OAUTH ROUTES
// ==========================================

// Debug route to check Google OAuth configuration
app.get('/auth/google/debug', (req, res) => {
    res.json({
        googleOAuthEnabled,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING',
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'NOT SET (using default)',
        FRONTEND_URL: process.env.FRONTEND_URL || 'NOT SET (using default: http://localhost:5173)',
    });
});

// Initiate Google OAuth — saves the frontend origin in state so we know where to redirect back
app.get('/auth/google', (req, res, next) => {
    if (!googleOAuthEnabled) {
        return res.status(500).json({ error: 'Google OAuth is not configured on this server. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars.' });
    }

    // Capture the frontend origin from Referer header or use FRONTEND_URL
    const referer = req.headers.referer || req.headers.origin || '';
    let frontendOrigin = FRONTEND_URL;
    if (referer) {
        try {
            const url = new URL(referer);
            frontendOrigin = url.origin; // e.g. https://beta.doodlesstore.com
        } catch (e) {
            // ignore parse errors
        }
    }

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
        state: Buffer.from(JSON.stringify({ frontendOrigin })).toString('base64')
    })(req, res, next);
});

// Google OAuth Callback
app.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        // Decode the frontend origin from state
        let frontendOrigin = FRONTEND_URL;
        try {
            if (req.query.state) {
                const state = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
                if (state.frontendOrigin) {
                    frontendOrigin = state.frontendOrigin;
                }
            }
        } catch (e) {
            console.error('Failed to parse OAuth state:', e);
        }

        if (err) {
            console.error('Google OAuth error:', err);
            return res.redirect(`${frontendOrigin}/login?error=oauth_failed&detail=${encodeURIComponent(err.message)}`);
        }

        if (!user) {
            console.error('Google OAuth: no user returned', info);
            return res.redirect(`${frontendOrigin}/login?error=oauth_no_user`);
        }

        try {
            const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
            console.log('Google OAuth success, redirecting to:', `${frontendOrigin}/auth/google/callback?token=...`);
            res.redirect(`${frontendOrigin}/auth/google/callback?token=${token}`);
        } catch (error) {
            console.error('Google OAuth token generation error:', error);
            res.redirect(`${frontendOrigin}/login?error=token_failed`);
        }
    })(req, res, next);
});

// ==========================================
// FIREBASE PHONE AUTH ROUTE
// ==========================================
app.post('/api/auth/firebase', async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ error: 'Firebase ID token is required' });
        }

        if (!firebaseEnabled) {
            return res.status(500).json({ error: 'Firebase is not configured on this server' });
        }

        // Verify the Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, phone_number } = decodedToken;

        if (!phone_number) {
            return res.status(400).json({ error: 'No phone number found in Firebase token' });
        }

        // Find user by firebaseUid or phone number
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { firebaseUid: uid },
                    { phone: phone_number }
                ]
            }
        });

        if (user) {
            // Update firebaseUid and phone if needed
            const updateData = {};
            if (!user.firebaseUid) updateData.firebaseUid = uid;
            if (!user.phone) updateData.phone = phone_number;
            if (Object.keys(updateData).length > 0) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: updateData
                });
            }
        } else {
            // Create new user with phone number
            user = await prisma.user.create({
                data: {
                    name: null,
                    email: null,
                    password: null,
                    phone: phone_number,
                    firebaseUid: uid,
                    referralCode: crypto.randomBytes(3).toString('hex').toUpperCase(),
                }
            });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role }
        });
    } catch (error) {
        console.error('Firebase auth error:', error);
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ error: 'Token expired. Please try again.' });
        }
        if (error.code === 'auth/argument-error') {
            return res.status(400).json({ error: 'Invalid token format' });
        }
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// ==========================================
// CATEGORY ROUTES
// ==========================================

// Get all categories with subcategories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                subcategories: true,
                pricing: true,
                _count: {
                    select: { ads: true }
                }
            }
        });

        // Also get counts for subcategories separately or include them
        const subcategoriesWithCount = await prisma.subcategory.findMany({
            include: {
                _count: {
                    select: { ads: true }
                }
            }
        });

        // Map subcategory counts
        const categoryData = categories.map(cat => ({
            ...cat,
            subcategories: cat.subcategories.map(sub => {
                const matchedSub = subcategoriesWithCount.find(s => s.id === sub.id);
                return {
                    ...sub,
                    _count: matchedSub ? matchedSub._count : { ads: 0 }
                };
            })
        }));

        res.json({ categories: categoryData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==========================================
// ADS & LISTING ROUTES
// ==========================================

// Get all ads (with optional category/subcategory filters)
app.get('/api/ads', async (req, res) => {
    try {
        const { categorySlug, subcategorySlug } = req.query;
        let where = { status: 'active' };

        if (subcategorySlug) {
            where.subcategory = { slug: subcategorySlug };
        } else if (categorySlug) {
            where.category = { slug: categorySlug };
        }

        const ads = await prisma.ad.findMany({
            where,
            include: {
                category: true,
                subcategory: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ ads });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search Ads with Distance Filter (Haversine)
app.get('/api/ads/search', async (req, res) => {
    try {
        const { lat, lng, radius, categorySlug, subcategorySlug, condition, q, sort, minPrice, maxPrice } = req.query;

        let where = { status: 'active' };

        if (subcategorySlug) {
            where.subcategory = { slug: subcategorySlug };
        } else if (categorySlug && categorySlug !== 'all') {
            if (categorySlug === 'b2b') {
                where.isB2B = true;
            } else {
                where.category = { slug: categorySlug };
            }
        }

        if (condition && condition !== 'all') {
            where.condition = condition;
        }

        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } }
            ];
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice && !isNaN(parseFloat(minPrice))) {
                where.price.gte = parseFloat(minPrice);
            }
            if (maxPrice && !isNaN(parseFloat(maxPrice))) {
                where.price.lte = parseFloat(maxPrice);
            }
            // Clean up if both were invalid
            if (Object.keys(where.price).length === 0) delete where.price;
        }

        let orderBy = { createdAt: 'desc' };
        if (sort === 'price-low') orderBy = { price: 'asc' };
        if (sort === 'price-high') orderBy = { price: 'desc' };

        let ads = await prisma.ad.findMany({
            where,
            include: {
                category: true,
                subcategory: true
            },
            orderBy
        });

        // Manually stitch user data since Ad lacks an explicit relation in Prisma schema
        const userIds = [...new Set(ads.map(ad => ad.userId))];
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, isGstVerified: true, avatarUrl: true }
        });

        ads = ads.map(ad => ({
            ...ad,
            user: users.find(u => u.id === ad.userId) || null
        }));

        // Apply Haversine distance filter if lat, lng, and radius provided
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        const maxDist = parseFloat(radius);

        if (!isNaN(userLat) && !isNaN(userLng) && !isNaN(maxDist)) {
            const toRad = (deg) => deg * (Math.PI / 180);

            ads = ads
                .filter(ad => ad.latitude !== null && ad.longitude !== null)
                .map(ad => {
                    const dLat = toRad(ad.latitude - userLat);
                    const dLng = toRad(ad.longitude - userLng);
                    const a = Math.sin(dLat / 2) ** 2 +
                        Math.cos(toRad(userLat)) * Math.cos(toRad(ad.latitude)) *
                        Math.sin(dLng / 2) ** 2;
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const distance = 6371 * c; // Earth radius in km
                    return { ...ad, distance: Math.round(distance * 10) / 10 };
                })
                .filter(ad => ad.distance <= maxDist)
                .sort((a, b) => a.distance - b.distance);
        }

        res.json({ ads });
    } catch (error) {
        console.error('[ads/search] Error:', error);
        console.error('Query params:', req.query);
        res.status(500).json({ error: 'Search failed', details: error.message });
    }
});

// Get User Ads
app.get('/api/user/ads', authenticate, async (req, res) => {
    try {
        const ads = await prisma.ad.findMany({
            where: { userId: req.user.userId },
            include: {
                category: true,
                subcategory: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ ads });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update User Banner
app.post('/api/user/banner', authenticate, upload.single('banner'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Banner image required' });

        const bannerUrl = await uploadToCloudinary(req.file.buffer);

        await prisma.user.update({
            where: { id: req.user.userId },
            data: { bannerImage: bannerUrl }
        });

        res.json({ message: 'Banner updated successfully', bannerImage: bannerUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update banner' });
    }
});

// Update User Avatar
app.post('/api/user/avatar', authenticate, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Avatar image required' });

        const avatarUrl = await uploadToCloudinary(req.file.buffer);

        await prisma.user.update({
            where: { id: req.user.userId },
            data: { avatarUrl }
        });

        res.json({ message: 'Avatar updated successfully', avatarUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update avatar' });
    }
});

// Get Public Seller Profile by ID
app.get('/api/seller/:id', async (req, res) => {
    try {
        const seller = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                name: true,
                createdAt: true,
                adsPosted: true,
                isGstVerified: true,
                facebookUrl: true,
                instagramUrl: true,
                twitterUrl: true,
                bannerImage: true,
                avatarUrl: true
            }
        });

        if (!seller) return res.status(404).json({ error: 'Seller not found' });

        const activeAds = await prisma.ad.findMany({
            where: { userId: seller.id, status: 'active' },
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        res.json({ seller, ads: activeAds });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single ad by ID
app.get('/api/ads/:id', async (req, res) => {
    try {
        const ad = await prisma.ad.findUnique({
            where: { id: req.params.id },
            include: {
                category: true,
                subcategory: true
            }
        });

        if (!ad) return res.status(404).json({ error: 'Ad not found' });

        // Increment views
        await prisma.ad.update({
            where: { id: ad.id },
            data: { views: { increment: 1 } }
        });

        res.json({ ad });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Post Ad
app.post('/api/ads/post', authenticate, upload.array('images', 5), async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Require phone number to post ads
        if (!user.phone) {
            return res.status(403).json({
                error: 'Phone verification required',
                message: 'You must verify your mobile number before posting ads. Please update your phone number in your profile settings.'
            });
        }

        const {
            title, description, price, categoryId, subcategoryId,
            condition, location, dynamicData, includedItems, videoUrl, mapUrl,
            isB2B, b2bMoq, b2bPricePerUnit, b2bStock, b2bBusinessName, b2bGstNumber, b2bDelivery,
            latitude, longitude
        } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'At least one image is required' });
        }

        if (!latitude || !longitude || isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
            return res.status(400).json({ error: 'Valid Location coordinates (latitude and longitude) are strictly required to post an ad.' });
        }

        // Upload images to Cloudinary
        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
        const imageUrls = await Promise.all(uploadPromises);

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { pricing: true }
        });

        if (!category) return res.status(400).json({ error: 'Invalid category' });

        // Pricing Logic
        let adPlanType = 'standard';
        let priceToDeduct = category.pricing ? category.pricing.price : 10;
        let validityDays = category.pricing ? category.pricing.validityDays : 30;

        const isServiceOrEvent = ['services', 'events', 'event-services'].includes(category.slug);

        // Launch offer logic: First 2 free, next 30 for ₹1
        if (!isServiceOrEvent && user.adsPosted < 32) {
            adPlanType = 'launch';
            if (user.adsPosted < 2) {
                priceToDeduct = 0; // First 2 free
            } else {
                priceToDeduct = 1; // Next 30 for 1 rupee
            }
            validityDays = 30; // Launch offer validity is strictly 30.
        }

        // Check Wallet Balance
        if (user.walletBalance < priceToDeduct) {
            return res.status(400).json({ error: `Insufficient wallet balance. Listing fee is ₹${priceToDeduct}. Please recharge.` });
        }

        // Category Misuse Validation Flag (MVP)
        let adStatus = 'active';
        if (!['properties', 'real-estate'].includes(category.slug)) {
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes('plot') || lowerTitle.includes('flat') || lowerTitle.includes('apartment') || lowerTitle.includes('land')) {
                adStatus = 'pending'; // Flag for admin review
            }
        }

        // Verify subcategory exists
        const subcategory = await prisma.subcategory.findUnique({ where: { id: subcategoryId } });
        if (!subcategory) return res.status(400).json({ error: 'Invalid subcategory' });

        const isB2B_bool = isB2B === 'true';

        // Basic B2B Validation
        if (isB2B_bool) {
            if (!b2bMoq || isNaN(parseInt(b2bMoq))) return res.status(400).json({ error: 'Minimum Order Quantity (MOQ) is required for B2B' });
            if (!b2bPricePerUnit || isNaN(parseFloat(b2bPricePerUnit))) return res.status(400).json({ error: 'Price Per Unit is required for B2B' });
        }

        const now = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(now.getDate() + validityDays);

        // Transactions
        let newAd;
        await prisma.$transaction(async (tx) => {
            // Deduct Wallet
            if (priceToDeduct > 0) {
                await tx.user.update({
                    where: { id: user.id },
                    data: { walletBalance: { decrement: priceToDeduct } }
                });
            }

            // Create Ad
            newAd = await tx.ad.create({
                data: {
                    title,
                    description,
                    price: parseFloat(price) || 0,
                    categoryId,
                    subcategoryId,
                    userId: user.id,
                    condition,
                    location,
                    images: JSON.stringify(imageUrls),
                    dynamicData: dynamicData ? (typeof dynamicData === 'string' ? dynamicData : JSON.stringify(dynamicData)) : null,
                    includedItems: includedItems ? (typeof includedItems === 'string' ? includedItems : JSON.stringify(includedItems)) : null,
                    videoUrl,
                    mapUrl,
                    isB2B: isB2B_bool,
                    b2bMoq: isB2B_bool ? (parseInt(b2bMoq) || null) : null,
                    b2bPricePerUnit: isB2B_bool ? (parseFloat(b2bPricePerUnit) || null) : null,
                    b2bStock: (isB2B_bool && b2bStock) ? (parseInt(b2bStock) || null) : null,
                    b2bBusinessName: isB2B_bool ? b2bBusinessName : null,
                    b2bGstNumber: isB2B_bool ? b2bGstNumber : null,
                    b2bDelivery: isB2B_bool ? (b2bDelivery === 'true') : null,
                    expiresAt,
                    status: adStatus,
                    validityDays,
                    pricePaid: priceToDeduct,
                    adPlanType,
                    latitude: (latitude && !isNaN(parseFloat(latitude))) ? parseFloat(latitude) : null,
                    longitude: (longitude && !isNaN(parseFloat(longitude))) ? parseFloat(longitude) : null
                }
            });

            // Log Wallet Transaction
            if (priceToDeduct > 0) {
                await tx.walletTransaction.create({
                    data: {
                        userId: user.id,
                        amount: priceToDeduct,
                        type: 'deduction',
                        description: `Ad posting fee for "${title}"`,
                        adId: newAd.id
                    }
                });
            }

            // Increment adsPosted counter
            await tx.user.update({
                where: { id: user.id },
                data: { adsPosted: { increment: 1 } }
            });
        });

        res.json({ message: 'Ad posted successfully', adId: newAd.id });
    } catch (error) {
        console.error('CRITICAL POST AD ERROR:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
            stack: error.stack
        });
    }
});

// ==========================================
// PAYMENT & MEMBERSHIP ROUTES
// ==========================================

// Create Razorpay Order
app.post('/api/payment/create-order', authenticate, async (req, res) => {
    try {
        const reqAmount = req.body.amount || 1;
        if (reqAmount < 1) {
            return res.status(400).json({ error: 'Minimum recharge amount is ₹1.' });
        }
        const amount = reqAmount * 100; // in paise

        const options = {
            amount,
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        let order;
        order = await razorpay.orders.create(options);

        // Record the pending payment
        await prisma.payment.create({
            data: {
                userId: req.user.userId,
                razorpayOrderId: order.id,
                amount: reqAmount,
                status: 'pending',
                planName: 'Wallet Recharge'
            }
        });

        res.json({ orderId: order.id, amount: options.amount, currency: options.currency });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Verify Payment and Activate Membership
app.post('/api/payment/verify', authenticate, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log('[verify] Received:', { razorpay_order_id, razorpay_payment_id });

        const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: razorpay_order_id } });
        if (!payment) {
            console.log('[verify] Order not found:', razorpay_order_id);
            return res.status(404).json({ error: 'Order not found' });
        }
        console.log('[verify] Payment found:', payment.id, 'amount:', payment.amount);

        // Use the same secret as the Razorpay instance (with fallback)
        const keySecret = process.env.RAZORPAY_KEY_SECRET || 'jZmMEEfXwRbXTtRg5UGWvKvZ';
        const generated_signature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        const isSignatureValid = generated_signature === razorpay_signature;
        console.log('[verify] Signature valid:', isSignatureValid);

        if (!isSignatureValid) {
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'failed', razorpayPaymentId: razorpay_payment_id }
            });
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        // Payment is successful! Update payment status
        const paymentDate = new Date();

        // Generate Invoice Number
        const count = await prisma.payment.count({ where: { status: 'success' } });
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

        // Calculate GST (18%)
        const totalAmount = payment.amount;
        const baseAmount = totalAmount / 1.18;
        const gstAmount = totalAmount - baseAmount;
        const cgst = gstAmount / 2;
        const sgst = gstAmount / 2;
        const igst = 0;

        // Get User to check GSTIN
        const userForInvoice = await prisma.user.findUnique({ where: { id: req.user.userId } });

        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'success',
                razorpayPaymentId: razorpay_payment_id,
                paymentDate,
                invoiceNumber,
                planName: 'Wallet Recharge',
                gstAmount,
                cgst,
                sgst,
                igst,
                gstinUsed: userForInvoice?.gstin || null
            }
        });

        // Add funds to user's wallet
        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                walletBalance: {
                    increment: totalAmount
                }
            }
        });

        console.log('[verify] ✅ Success! New balance:', updatedUser.walletBalance);
        res.json({ message: 'Wallet recharged successfully!', walletBalance: updatedUser.walletBalance });
    } catch (error) {
        console.error('[verify] ❌ Error:', error.message, error.stack);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
});

// ==========================================
// BILLING & INVOICE ROUTES
// ==========================================

// Get User Billing History
app.get('/api/user/billing-history', authenticate, async (req, res) => {
    try {
        const payments = await prisma.payment.findMany({
            where: { userId: req.user.userId, status: 'success' },
            orderBy: { paymentDate: 'desc' }
        });
        res.json({ payments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Download PDF Invoice
app.get('/api/invoices/:id/download', authenticate, async (req, res) => {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: req.params.id },
            include: { user: true }
        });

        if (!payment || payment.status !== 'success') {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Ensure user owns invoice or is admin
        if (payment.userId !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const action = req.query.action || 'download';
        generateInvoicePDF(payment, res, action);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==========================================
// ADMIN ROUTES
// ==========================================

// Founder Admin Dashboard Stats
app.get('/api/admin/founder-stats', authenticate, isAdmin, async (req, res) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 1. User Growth Metrics
        const totalUsers = await prisma.user.count();
        const dailySignups = await prisma.user.count({
            where: { createdAt: { gte: startOfToday } }
        });

        // 2. Premium Metrics
        const premiumUsers = await prisma.user.count({
            where: { membershipExpiry: { gt: now } }
        });
        const premiumPurchasesToday = await prisma.payment.count({
            where: {
                status: 'success',
                paymentDate: { gte: startOfToday }
            }
        });
        const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(2) : 0;

        const totalRevenueAggr = await prisma.payment.aggregate({
            _sum: { amount: true, gstAmount: true },
            where: { status: 'success' }
        });
        const totalRevenue = totalRevenueAggr._sum.amount ? totalRevenueAggr._sum.amount : 0;
        const totalGst = totalRevenueAggr._sum.gstAmount ? totalRevenueAggr._sum.gstAmount : 0;
        const arpu = totalUsers > 0 ? (totalRevenue / totalUsers).toFixed(2) : 0;

        // 3. Marketplace Activity Metrics
        const totalListings = await prisma.ad.count();
        const activeListings = await prisma.ad.count({ where: { status: 'active' } });
        const soldListings = await prisma.ad.count({ where: { status: 'sold' } });
        const todaysListings = await prisma.ad.count({
            where: { createdAt: { gte: startOfToday } }
        });
        const listingsPerUser = totalUsers > 0 ? (totalListings / totalUsers).toFixed(2) : 0;
        const chatsStarted = 0; // Mocked for now, until Messages schema is fully utilized

        // 4. Engagement Ratios
        // Activation Rate (Users who posted >= 1 listing)
        const activatedUsers = await prisma.user.count({
            where: { adsPosted: { gt: 0 } }
        });
        const activationRate = totalUsers > 0 ? ((activatedUsers / totalUsers) * 100).toFixed(2) : 0;

        // Mock Retention Rate since traffic tracking takes time to accrue
        const retentionRate = "42.5"; // Hardcoded mock percentage for UX completion until telemetry is built

        // Daily Traffic (Mocked or simple DAU)
        const dailyTraffic = dailySignups * 4 + 120; // Simulated mock DAU for UI

        res.json({
            userGrowth: {
                totalUsers,
                dailySignups,
                activeUsers: dailyTraffic, // mock
                mau: totalUsers * 0.8 // mock
            },
            premiumMetrics: {
                totalPremiumUsers: premiumUsers,
                premiumPurchasesToday,
                conversionRate: parseFloat(conversionRate),
                arpu: parseFloat(arpu),
                revenue: totalRevenue,
                totalGst
            },
            marketplaceActivity: {
                totalListings,
                activeListings,
                soldListings,
                todaysListings,
                listingsPerUser: parseFloat(listingsPerUser),
                chatsStarted
            },
            engagement: {
                activationRate: parseFloat(activationRate),
                retentionRate: parseFloat(retentionRate),
                dailyTraffic
            }
        });
    } catch (error) {
        console.error("Error fetching founder stats: ", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/stats', authenticate, isAdmin, async (req, res) => {
    try {
        const totalPayments = await prisma.payment.count({ where: { status: 'success' } });
        const totalRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: 'success' }
        });
        const totalBonuses = await prisma.referral.aggregate({
            _sum: { amount: true },
            where: { status: 'paid' }
        });

        res.json({
            membershipsSold: totalPayments,
            revenue: totalRevenue._sum.amount || 0,
            referralBonusesGiven: totalBonuses._sum.amount || 0,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/admin/users', authenticate, isAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true, name: true, email: true, role: true,
                membershipExpiry: true, walletBalance: true, createdAt: true
            }
        });
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export GST Invoices (CSV)
app.get('/api/admin/invoices', authenticate, isAdmin, async (req, res) => {
    try {
        const { gstOnly, startDate, endDate } = req.query;
        let whereClause = { status: 'success' };

        if (gstOnly === 'true') {
            whereClause.gstAmount = { gt: 0 };
        }

        if (startDate && endDate) {
            whereClause.paymentDate = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        const payments = await prisma.payment.findMany({
            where: whereClause,
            include: { user: true },
            orderBy: { paymentDate: 'desc' }
        });

        res.json({ invoices: payments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin toggle block (We achieve blocking by setting an explicit blocked role or clearing their sessions)
app.post('/api/admin/users/:id/block', authenticate, isAdmin, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.params.id } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.role === 'admin') return res.status(400).json({ error: 'Cannot block admins' });

        const newRole = user.role === 'blocked' ? 'user' : 'blocked';
        await prisma.user.update({
            where: { id: user.id },
            data: { role: newRole }
        });

        res.json({ message: `User ${newRole === 'blocked' ? 'blocked' : 'unblocked'} successfully`, role: newRole });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin Category Management
app.post('/api/admin/categories', authenticate, isAdmin, async (req, res) => {
    try {
        const { name, slug } = req.body;
        const category = await prisma.category.create({ data: { name, slug } });
        res.json({ category });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
});

app.put('/api/admin/categories/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { name, slug } = req.body;
        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: { name, slug }
        });
        res.json({ category });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
});

app.delete('/api/admin/categories/:id', authenticate, isAdmin, async (req, res) => {
    try {
        await prisma.category.delete({ where: { id: req.params.id } });
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// Admin Subcategory Management
app.post('/api/admin/subcategories', authenticate, isAdmin, async (req, res) => {
    try {
        const { name, slug, categoryId, formFields } = req.body;
        const subcategory = await prisma.subcategory.create({
            data: { name, slug, categoryId, formFields: JSON.stringify(formFields || []) }
        });
        res.json({ subcategory });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create subcategory' });
    }
});

app.put('/api/admin/subcategories/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { name, slug, categoryId, formFields } = req.body;
        const subcategory = await prisma.subcategory.update({
            where: { id: req.params.id },
            data: { name, slug, categoryId, formFields: JSON.stringify(formFields || []) }
        });
        res.json({ subcategory });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update subcategory' });
    }
});

app.delete('/api/admin/subcategories/:id', authenticate, isAdmin, async (req, res) => {
    try {
        await prisma.subcategory.delete({ where: { id: req.params.id } });
        res.json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete subcategory' });
    }
});

// ─── WISHLIST ROUTES ────────────────────────────────────────
// GET /api/wishlist  — fetch logged-in user's wishlist
app.get('/api/wishlist', authenticate, async (req, res) => {
    try {
        const items = await prisma.wishlist.findMany({
            where: { userId: req.user.userId },
            include: {
                ad: {
                    select: {
                        id: true, title: true, price: true, images: true,
                        location: true, status: true, category: { select: { name: true } },
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

// POST /api/wishlist/:adId  — add ad to wishlist (idempotent)
app.post('/api/wishlist/:adId', authenticate, async (req, res) => {
    try {
        const item = await prisma.wishlist.upsert({
            where: { userId_adId: { userId: req.user.userId, adId: req.params.adId } },
            update: {},
            create: { userId: req.user.userId, adId: req.params.adId },
        });
        res.json({ message: 'Added to wishlist', item });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

// DELETE /api/wishlist/:adId  — remove ad from wishlist
app.delete('/api/wishlist/:adId', authenticate, async (req, res) => {
    try {
        await prisma.wishlist.delete({
            where: { userId_adId: { userId: req.user.userId, adId: req.params.adId } },
        });
        res.json({ message: 'Removed from wishlist' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
});

// GET /api/wishlist/status/:adId — check if specific ad is in wishlist
app.get('/api/wishlist/status/:adId', authenticate, async (req, res) => {
    try {
        const item = await prisma.wishlist.findUnique({
            where: { userId_adId: { userId: req.user.userId, adId: req.params.adId } },
        });
        res.json({ isSaved: !!item });
    } catch (err) {
        res.status(500).json({ error: 'Failed to check wishlist status' });
    }
});
// ────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
