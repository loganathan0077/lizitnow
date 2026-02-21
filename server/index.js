const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Razorpay = require('razorpay');
require('dotenv').config();
const { generateInvoicePDF } = require('./utils/invoiceGenerator');

const app = express();
const prisma = new PrismaClient();

// Configure CORS and JSON parsing
app.use(cors({
    origin: '*', // For development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-development';

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
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

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password, // NOTE: Use bcrypt in production
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

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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
                adsPosted: true, gstin: true
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
        res.status(500).json({ error: 'Internal server error' });
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
app.post('/api/ads/post', authenticate, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMember = user.membershipExpiry && new Date(user.membershipExpiry) > new Date();

        // 5 free ads check
        if (!isMember && user.adsPosted >= 5) {
            return res.status(403).json({ error: 'Ad limit reached. Please purchase a 6-month membership for ₹100 to continue posting.' });
        }

        const {
            title, description, price, categoryId, subcategoryId,
            condition, location, images, dynamicData, includedItems, videoUrl
        } = req.body;

        // Verify subcategory exists
        const subcategory = await prisma.subcategory.findUnique({ where: { id: subcategoryId } });
        if (!subcategory) return res.status(400).json({ error: 'Invalid subcategory' });

        const now = new Date();
        const expiresAt = new Date();
        expiresAt.setDate(now.getDate() + 30); // 30 Days Validity

        // Create Ad
        const newAd = await prisma.ad.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                categoryId,
                subcategoryId,
                userId: user.id,
                condition,
                location,
                images: JSON.stringify(images || []),
                dynamicData: dynamicData ? JSON.stringify(dynamicData) : null,
                includedItems: includedItems ? JSON.stringify(includedItems) : null,
                videoUrl,
                expiresAt,
                status: 'active'
            }
        });

        // Increment adsPosted counter
        await prisma.user.update({
            where: { id: user.id },
            data: { adsPosted: { increment: 1 } }
        });

        res.json({ message: 'Ad posted successfully!', ad: newAd, adsPosted: user.adsPosted + 1 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==========================================
// PAYMENT & MEMBERSHIP ROUTES
// ==========================================

// Create Razorpay Order
app.post('/api/payment/create-order', authenticate, async (req, res) => {
    try {
        const amount = 100 * 100; // ₹100 in paise

        const options = {
            amount,
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        let order;
        // Mock execution if the API keys are the default mock keys
        if (process.env.RAZORPAY_KEY_ID === 'rzp_test_mock_key') {
            order = { id: `mock_order_${crypto.randomBytes(6).toString('hex')}`, amount, currency: 'INR' };
        } else {
            order = await razorpay.orders.create(options);
        }

        // Record the pending payment
        await prisma.payment.create({
            data: {
                userId: req.user.userId,
                razorpayOrderId: order.id,
                amount: 100,
                status: 'pending'
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

        const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: razorpay_order_id } });
        if (!payment) return res.status(404).json({ error: 'Order not found' });

        let isSignatureValid = false;

        if (process.env.RAZORPAY_KEY_ID === 'rzp_test_mock_key') {
            // Allow any mock verification to succeed
            isSignatureValid = true;
        } else {
            const generated_signature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest('hex');
            isSignatureValid = generated_signature === razorpay_signature;
        }

        if (!isSignatureValid) {
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'failed', razorpayPaymentId: razorpay_payment_id }
            });
            return res.status(400).json({ error: 'Invalid payment signature' });
        }

        // Payment is successful! Update payment status
        const paymentDate = new Date();
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 6); // 6 Months membership

        // Generate Invoice Number
        const count = await prisma.payment.count({ where: { status: 'success' } });
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

        // Calculate GST (18%)
        const totalAmount = payment.amount;
        const baseAmount = totalAmount / 1.18;
        const gstAmount = totalAmount - baseAmount;
        const cgst = gstAmount / 2;
        const sgst = gstAmount / 2;
        const igst = 0; // Assuming intra-state for now

        // Get User to check GSTIN
        const userForInvoice = await prisma.user.findUnique({ where: { id: req.user.userId } });

        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'success',
                razorpayPaymentId: razorpay_payment_id,
                paymentDate,
                expiryDate,
                invoiceNumber,
                planName: '6 Months Membership',
                gstAmount,
                cgst,
                sgst,
                igst,
                gstinUsed: userForInvoice.gstin || null
            }
        });

        // Update User's Membership
        const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

        // Extend expiry if already active, otherwise set from today
        let newExpiry = new Date();
        if (user.membershipExpiry && user.membershipExpiry > new Date()) {
            newExpiry = new Date(user.membershipExpiry);
        }
        newExpiry.setMonth(newExpiry.getMonth() + 6);

        await prisma.user.update({
            where: { id: user.id },
            data: { membershipExpiry: newExpiry }
        });

        // Handle Referral Bonus (₹50 to referrer)
        const referral = await prisma.referral.findUnique({
            where: { referredUserId: user.id }
        });

        if (referral && referral.status === 'pending') {
            await prisma.$transaction([
                prisma.referral.update({
                    where: { id: referral.id },
                    data: { status: 'paid' }
                }),
                prisma.user.update({
                    where: { id: referral.referrerId },
                    data: { walletBalance: { increment: 50 } }
                })
            ]);
        }

        res.json({ message: 'Payment verified successfully. Membership activated!', expiryDate: newExpiry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
