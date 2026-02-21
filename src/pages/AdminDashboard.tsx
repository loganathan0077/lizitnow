import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Shield, Users, IndianRupee, Ban, CheckCircle, Plus, Edit, Trash2, TrendingUp, Activity, MessageSquare, ShoppingBag, Percent, ArrowUpRight, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [founderStats, setFounderStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'categories' | 'billing'>('users');

    const [invoices, setInvoices] = useState<any[]>([]);
    const [invoiceFilter, setInvoiceFilter] = useState({ gstOnly: false, startDate: '', endDate: '' });
    // Form States for Categories
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [catForm, setCatForm] = useState({ name: '', slug: '' });

    // Form States for Subcategories
    const [showSubcategoryForm, setShowSubcategoryForm] = useState<string | null>(null); // categoryId
    const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
    const [subCatForm, setSubCatForm] = useState({ name: '', slug: '', formFields: '[]' });

    const fetchInvoices = async () => {
        try {
            const token = localStorage.getItem('token');
            const query = new URLSearchParams({
                gstOnly: invoiceFilter.gstOnly.toString(),
                startDate: invoiceFilter.startDate,
                endDate: invoiceFilter.endDate
            });
            const res = await fetch(`http://localhost:5001/api/admin/invoices?${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setInvoices(data.invoices || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (activeTab === 'billing') {
            fetchInvoices();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, invoiceFilter.gstOnly, invoiceFilter.startDate, invoiceFilter.endDate]);

    const handleExportCSV = () => {
        if (!invoices.length) return toast.info('No invoices to export');

        const headers = ['Invoice Number', 'Date', 'User Name', 'GSTIN', 'Total Amount', 'GST Amount', 'Status', 'Plan'];
        const csvContent = [
            headers.join(','),
            ...invoices.map(inv => [
                inv.invoiceNumber || 'N/A',
                new Date(inv.paymentDate).toLocaleDateString(),
                inv.user?.name || 'Unknown',
                inv.gstinUsed || 'N/A',
                inv.amount,
                inv.gstAmount,
                inv.status,
                inv.planName
            ].map(v => `"${v}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `GST_Invoices_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const [statsRes, usersRes, catsRes] = await Promise.all([
                fetch('http://localhost:5001/api/admin/founder-stats', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('http://localhost:5001/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('http://localhost:5001/api/categories')
            ]);

            if (!statsRes.ok || !usersRes.ok) {
                throw new Error('Failed to fetch admin data or Unauthorized');
            }

            const statsData = await statsRes.json();
            const usersData = await usersRes.json();
            const catsData = await catsRes.json();

            setFounderStats(statsData);
            setUsers(usersData.users);
            setCategories(catsData.categories || []);
        } catch (error) {
            console.error(error);
            toast.error('Admin access required');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleToggleBlock = async (userId: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5001/api/admin/users/${userId}/block`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to block/unblock');

            const text = await res.json();
            toast.success(text.message);
            fetchAdminData(); // Refresh list
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    // Category CRUD
    const saveCategory = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = editingCategory
                ? `http://localhost:5001/api/admin/categories/${editingCategory.id}`
                : `http://localhost:5001/api/admin/categories`;

            const method = editingCategory ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(catForm)
            });

            if (!res.ok) throw new Error('Failed to save category');
            toast.success('Category saved successfully');
            setShowCategoryForm(false);
            setEditingCategory(null);
            fetchAdminData();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category? All related subcategories and ads will be lost.')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5001/api/admin/categories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete category');
            toast.success('Category deleted');
            fetchAdminData();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    // Subcategory CRUD
    const saveSubcategory = async (categoryId: string) => {
        try {
            // Validate JSON
            let parsedFields;
            try {
                parsedFields = JSON.parse(subCatForm.formFields);
            } catch (e) {
                throw new Error('Invalid JSON format in Form Fields');
            }

            const token = localStorage.getItem('token');
            const url = editingSubcategory
                ? `http://localhost:5001/api/admin/subcategories/${editingSubcategory.id}`
                : `http://localhost:5001/api/admin/subcategories`;

            const method = editingSubcategory ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...subCatForm, categoryId, formFields: parsedFields })
            });

            if (!res.ok) throw new Error('Failed to save subcategory');
            toast.success('Subcategory saved successfully');
            setShowSubcategoryForm(null);
            setEditingSubcategory(null);
            fetchAdminData();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const deleteSubcategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subcategory?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5001/api/admin/subcategories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to delete subcategory');
            toast.success('Subcategory deleted');
            fetchAdminData();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 py-12 px-4 container mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
                </div>

                {founderStats && (
                    <div className="space-y-8 mb-12">
                        {/* Summary Block */}
                        <div>
                            <h2 className="text-xl font-display font-semibold mb-4 text-foreground/80 flex items-center gap-2">
                                <Activity className="h-5 w-5" /> Morning Summary
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4">
                                <div className="card-premium p-4 flex flex-col items-center justify-center text-center">
                                    <span className="text-sm font-medium text-muted-foreground">Total Users</span>
                                    <span className="text-xl font-bold font-display">{founderStats.userGrowth.totalUsers}</span>
                                </div>
                                <div className="card-premium p-4 flex flex-col items-center justify-center text-center">
                                    <span className="text-sm font-medium text-muted-foreground text-trust-premium">Premium User</span>
                                    <span className="text-xl font-bold font-display text-trust-premium">{founderStats.premiumMetrics.totalPremiumUsers}</span>
                                </div>
                                <div className="card-premium p-4 flex flex-col items-center justify-center text-center">
                                    <span className="text-sm font-medium text-muted-foreground text-trust-green">Revenue</span>
                                    <span className="text-xl font-bold font-display text-trust-green">₹{founderStats.premiumMetrics.revenue}</span>
                                </div>
                                <div className="card-premium p-4 flex flex-col items-center justify-center text-center">
                                    <span className="text-sm font-medium text-muted-foreground text-amber">GST Collected</span>
                                    <span className="text-xl font-bold font-display text-amber">₹{founderStats.premiumMetrics.totalGst.toFixed(2)}</span>
                                </div>
                                <div className="card-premium p-4 flex flex-col items-center justify-center text-center">
                                    <span className="text-sm font-medium text-muted-foreground">Listings</span>
                                    <span className="text-xl font-bold font-display">{founderStats.marketplaceActivity.totalListings}</span>
                                </div>
                                <div className="card-premium p-4 flex flex-col items-center justify-center text-center bg-primary/5">
                                    <span className="text-sm font-medium text-muted-foreground">Today's Lists</span>
                                    <span className="text-xl font-bold font-display text-primary">{founderStats.marketplaceActivity.todaysListings}</span>
                                </div>
                                <div className="card-premium p-4 flex flex-col items-center justify-center text-center">
                                    <span className="text-sm font-medium text-muted-foreground">Active Lists</span>
                                    <span className="text-xl font-bold font-display text-primary">{founderStats.marketplaceActivity.activeListings}</span>
                                </div>
                                <div className="card-premium p-4 flex flex-col items-center justify-center text-center border-trust-green/30 border">
                                    <span className="text-sm font-medium text-muted-foreground">Sold Lists</span>
                                    <span className="text-xl font-bold font-display text-trust-green">{founderStats.marketplaceActivity.soldListings}</span>
                                </div>
                                <div className="card-premium p-4 flex flex-col items-center justify-center text-center border-amber/30 border bg-amber/5">
                                    <span className="text-sm font-medium text-muted-foreground">Daily Traffic</span>
                                    <span className="text-xl font-bold font-display text-amber">{founderStats.engagement.dailyTraffic}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* User Growth */}
                            <div className="card-premium p-6 flex flex-col space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold text-lg">User Growth</h3>
                                </div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-muted-foreground">Total Users</span>
                                    <span className="font-bold text-lg">{founderStats.userGrowth.totalUsers}</span>
                                </div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-muted-foreground">Daily Signups</span>
                                    <span className="font-bold text-lg flex items-center text-primary"><ArrowUpRight className="h-4 w-4" />{founderStats.userGrowth.dailySignups}</span>
                                </div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-muted-foreground">DAU</span>
                                    <span className="font-bold text-lg">{founderStats.userGrowth.activeUsers}</span>
                                </div>
                                <div className="flex justify-between items-end pb-2">
                                    <span className="text-muted-foreground">MAU</span>
                                    <span className="font-bold text-lg">{founderStats.userGrowth.mau}</span>
                                </div>
                            </div>

                            {/* Premium Metrics */}
                            <div className="card-premium p-6 flex flex-col space-y-4 border-t-4 border-t-trust-premium">
                                <div className="flex items-center gap-2 mb-2">
                                    <IndianRupee className="h-5 w-5 text-trust-premium" />
                                    <h3 className="font-semibold text-lg">Premium Metrics</h3>
                                </div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-muted-foreground">Total Premium</span>
                                    <span className="font-bold text-lg text-trust-premium">{founderStats.premiumMetrics.totalPremiumUsers}</span>
                                </div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-muted-foreground">Purchased Today</span>
                                    <span className="font-bold text-lg">{founderStats.premiumMetrics.premiumPurchasesToday}</span>
                                </div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-muted-foreground">Conversion</span>
                                    <span className="font-bold text-lg">{founderStats.premiumMetrics.conversionRate}%</span>
                                </div>
                                <div className="flex justify-between items-end pb-2">
                                    <span className="text-muted-foreground">ARPU</span>
                                    <span className="font-bold text-lg">₹{founderStats.premiumMetrics.arpu}</span>
                                </div>
                            </div>

                            {/* Marketplace Activity */}
                            <div className="card-premium p-6 flex flex-col space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShoppingBag className="h-5 w-5 text-primary" />
                                    <h3 className="font-semibold text-lg">Marketplace Activity</h3>
                                </div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-muted-foreground">Total Listings</span>
                                    <span className="font-bold text-lg">{founderStats.marketplaceActivity.totalListings}</span>
                                </div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-muted-foreground">Active / Sold</span>
                                    <span className="font-bold text-lg text-trust-green">{founderStats.marketplaceActivity.activeListings} / {founderStats.marketplaceActivity.soldListings}</span>
                                </div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-muted-foreground">Lists per user</span>
                                    <span className="font-bold text-lg">{founderStats.marketplaceActivity.listingsPerUser}</span>
                                </div>
                                <div className="flex justify-between items-end pb-2">
                                    <span className="text-muted-foreground">Chats Started</span>
                                    <span className="font-bold text-lg">{founderStats.marketplaceActivity.chatsStarted}</span>
                                </div>
                            </div>

                            {/* Engagement Ratios */}
                            <div className="card-premium p-6 flex flex-col space-y-4 border-t-4 border-t-amber">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="h-5 w-5 text-amber" />
                                    <h3 className="font-semibold text-lg">Engagement</h3>
                                </div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-muted-foreground">Activation Rate</span>
                                    <div className="text-right">
                                        <span className="font-bold text-xl block text-amber">{founderStats.engagement.activationRate}%</span>
                                        <span className="text-[10px] text-muted-foreground">Users who posted ad</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end border-b pb-2">
                                    <span className="text-muted-foreground">Retention Rate</span>
                                    <div className="text-right">
                                        <span className="font-bold text-xl block text-trust-green">{founderStats.engagement.retentionRate}%</span>
                                        <span className="text-[10px] text-muted-foreground">Returned &gt;7 Days</span>
                                    </div>
                                </div>
                                <div className="pt-2 bg-secondary/50 rounded p-3 text-center">
                                    <span className="text-xs uppercase font-medium tracking-wider text-muted-foreground">Health Status</span>
                                    <span className="block mt-1 font-bold text-trust-green flex items-center justify-center gap-1"><CheckCircle className="h-4 w-4" /> Healthy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <Button
                        variant={activeTab === 'users' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('users')}
                    >
                        User Management
                    </Button>
                    <Button
                        variant={activeTab === 'categories' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('categories')}
                    >
                        Category Management
                    </Button>
                    <Button
                        variant={activeTab === 'billing' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('billing')}
                    >
                        Billing Management
                    </Button>
                </div>

                {activeTab === 'billing' && (
                    <div className="card-premium p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-display font-semibold">Billing & GST Management</h2>
                            <Button onClick={handleExportCSV} className="gap-2">
                                <Download className="w-4 h-4" /> Export CSV
                            </Button>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 bg-secondary/50 p-4 rounded-xl border border-border">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-muted-foreground">Start Date</span>
                                <input type="date" className="rounded-md border border-border bg-background p-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20" value={invoiceFilter.startDate} onChange={e => setInvoiceFilter({ ...invoiceFilter, startDate: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium text-muted-foreground">End Date</span>
                                <input type="date" className="rounded-md border border-border bg-background p-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20" value={invoiceFilter.endDate} onChange={e => setInvoiceFilter({ ...invoiceFilter, endDate: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-2 mt-4 ml-auto">
                                <input type="checkbox" id="gstOnly" checked={invoiceFilter.gstOnly} onChange={e => setInvoiceFilter({ ...invoiceFilter, gstOnly: e.target.checked })} className="w-4 h-4 border-primary/20 text-primary rounded" />
                                <label htmlFor="gstOnly" className="text-sm font-medium">GST Invoices Only</label>
                            </div>
                        </div>

                        {/* Invoices Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-secondary/50 text-sm border-b border-border">
                                        <th className="p-4 font-medium">Invoice Number</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Customer & GSTIN</th>
                                        <th className="p-4 font-medium text-right">Total Amount</th>
                                        <th className="p-4 font-medium text-right text-trust-green">GST Collected</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {invoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4 font-medium">{inv.invoiceNumber || 'Processing'}</td>
                                            <td className="p-4 text-muted-foreground">{new Date(inv.paymentDate).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <div className="font-semibold">{inv.user?.name || 'Unknown'}</div>
                                                <div className="text-xs text-muted-foreground">{inv.gstinUsed ? `GSTIN: ${inv.gstinUsed}` : 'No GSTIN'}</div>
                                            </td>
                                            <td className="p-4 font-semibold text-right">₹{inv.amount.toLocaleString()}</td>
                                            <td className="p-4 text-right text-trust-green font-semibold">₹{inv.gstAmount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {invoices.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-muted-foreground">No invoices found matching current criteria.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="card-premium overflow-hidden">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-xl font-display font-semibold">User Management</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-secondary/50 text-sm border-b border-border">
                                        <th className="p-4 font-medium">Name</th>
                                        <th className="p-4 font-medium">Email</th>
                                        <th className="p-4 font-medium">Role</th>
                                        <th className="p-4 font-medium">Membership Expiry</th>
                                        <th className="p-4 font-medium">Wallet Balance</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {users.map((u) => {
                                        const isBlocked = u.role === 'blocked';
                                        const isMember = u.membershipExpiry && new Date(u.membershipExpiry) > new Date();

                                        return (
                                            <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-4 font-medium">{u.name}</td>
                                                <td className="p-4 text-muted-foreground">{u.email}</td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-primary/20 text-primary' :
                                                        isBlocked ? 'bg-destructive/20 text-destructive' :
                                                            'bg-secondary text-foreground'
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground">
                                                    {isMember ? new Date(u.membershipExpiry).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="p-4 font-semibold text-amber">
                                                    ₹{u.walletBalance}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {u.role !== 'admin' && (
                                                        <Button
                                                            variant={isBlocked ? "outline" : "destructive"}
                                                            size="sm"
                                                            className="w-24 gap-1"
                                                            onClick={() => handleToggleBlock(u.id)}
                                                        >
                                                            {isBlocked ? (
                                                                <> <CheckCircle className="w-4 h-4" /> Unblock </>
                                                            ) : (
                                                                <> <Ban className="w-4 h-4" /> Block </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="card-premium p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-display font-semibold">Categories & Subcategories</h2>
                            <Button onClick={() => { setCatForm({ name: '', slug: '' }); setShowCategoryForm(true); setEditingCategory(null); }}>
                                <Plus className="w-4 h-4 mr-2" /> Add Main Category
                            </Button>
                        </div>

                        {showCategoryForm && (
                            <div className="bg-secondary/50 p-4 rounded-xl mb-6 border border-border">
                                <h3 className="font-semibold mb-3">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                                <div className="flex gap-4">
                                    <input placeholder="Category Name" className="flex-1 rounded-lg px-3 py-2 bg-background border border-border" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} />
                                    <input placeholder="URL Slug (e.g. electronics)" className="flex-1 rounded-lg px-3 py-2 bg-background border border-border" value={catForm.slug} onChange={e => setCatForm({ ...catForm, slug: e.target.value })} />
                                    <Button onClick={saveCategory}>Save</Button>
                                    <Button variant="ghost" onClick={() => setShowCategoryForm(false)}>Cancel</Button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {categories.map(cat => (
                                <div key={cat.id} className="border border-border rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-primary">{cat.name} <span className="text-sm font-normal text-muted-foreground ml-2">/{cat.slug}</span></h3>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => { setSubCatForm({ name: '', slug: '', formFields: '[\n  { "name": "Brand", "type": "text" }\n]' }); setShowSubcategoryForm(cat.id); setEditingSubcategory(null); }}>
                                                <Plus className="w-3 h-3 mr-1" /> Add Subcat
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => { setCatForm({ name: cat.name, slug: cat.slug }); setEditingCategory(cat); setShowCategoryForm(true); }}>
                                                <Edit className="w-4 h-4 text-muted-foreground" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)}>
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Subcategory Grid */}
                                    {cat.subcategories && cat.subcategories.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {cat.subcategories.map((sub: any) => (
                                                <div key={sub.id} className="bg-secondary/30 rounded-lg p-3 border border-border flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold text-sm">{sub.name}</p>
                                                        <p className="text-xs text-muted-foreground">/{cat.slug}/{sub.slug}</p>
                                                    </div>
                                                    <div className="flex">
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                                                            setSubCatForm({ name: sub.name, slug: sub.slug, formFields: sub.formFields });
                                                            setEditingSubcategory(sub);
                                                            setShowSubcategoryForm(cat.id);
                                                        }}>
                                                            <Edit className="w-3 h-3 text-muted-foreground" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteSubcategory(sub.id)}>
                                                            <Trash2 className="w-3 h-3 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Subcategory Form */}
                                    {showSubcategoryForm === cat.id && (
                                        <div className="mt-4 bg-background p-4 rounded-xl border border-primary/20">
                                            <h4 className="font-semibold mb-3 text-sm">{editingSubcategory ? 'Edit Subcategory' : 'New Subcategory'}</h4>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <input placeholder="Subcategory Name" className="rounded-lg px-3 py-2 bg-secondary border border-border" value={subCatForm.name} onChange={e => setSubCatForm({ ...subCatForm, name: e.target.value })} />
                                                <input placeholder="URL Slug (e.g. mobile-phones)" className="rounded-lg px-3 py-2 bg-secondary border border-border" value={subCatForm.slug} onChange={e => setSubCatForm({ ...subCatForm, slug: e.target.value })} />
                                            </div>
                                            <textarea
                                                rows={5}
                                                className="w-full rounded-lg px-3 py-2 bg-secondary border border-border mb-4 font-mono text-xs"
                                                placeholder={`[ { "name": "Brand", "type": "text" }, { "name": "RAM", "type": "select", "options": ["4GB", "8GB"] } ]`}
                                                value={subCatForm.formFields}
                                                onChange={e => setSubCatForm({ ...subCatForm, formFields: e.target.value })}
                                            />
                                            <div className="flex gap-2">
                                                <Button onClick={() => saveSubcategory(cat.id)} size="sm">Save Subcategory</Button>
                                                <Button variant="ghost" size="sm" onClick={() => setShowSubcategoryForm(null)}>Cancel</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
