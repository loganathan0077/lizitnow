import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocationProvider } from "@/context/LocationContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Verification from "./pages/Verification";
import PostAd from "./pages/PostAd";
import SellerProfile from './pages/SellerProfile';
import AdminDashboard from './pages/AdminDashboard';
import Pricing from './pages/Pricing';
import HowItWorks from './pages/HowItWorks';
import HelpCenter from './pages/HelpCenter';
import SafetyTips from './pages/SafetyTips';
import ContactUs from './pages/ContactUs';
import ReportIssue from './pages/ReportIssue';
import CategoryView from './pages/CategoryView';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Sitemap from './pages/Sitemap';

const queryClient = new QueryClient();

// Simple Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/seller/:id" element={
              <ProtectedRoute>
                <SellerProfile />
              </ProtectedRoute>
            } />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verification"
              element={
                <ProtectedRoute>
                  <Verification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-ad"
              element={
                <ProtectedRoute>
                  <PostAd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/safety" element={<SafetyTips />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/sitemap" element={<Sitemap />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/:categorySlug" element={<CategoryView />} />
            <Route path="/:categorySlug/:subcategorySlug" element={<CategoryView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LocationProvider>
  </QueryClientProvider>
);

export default App;
