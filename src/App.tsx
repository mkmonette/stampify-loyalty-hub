import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SuperAdminDashboard } from "./pages/dashboards/SuperAdminDashboard";
import { BusinessAdminDashboard } from "./pages/dashboards/BusinessAdminDashboard";
import { CustomerDashboard } from "./pages/dashboards/CustomerDashboard";
import { AuthProvider } from "./context/AuthContext";
import { RequireAuth } from "./routes/RequireAuth";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { HelmetProvider } from "react-helmet-async";
import DashboardLayout from "./components/layout/DashboardLayout";
import ComingSoon from "./pages/ComingSoon";
// Feature pages
import CampaignsPage from "./pages/business/Campaigns";
import BusinessRewardsPage from "./pages/business/Rewards";
import CouponsPage from "./pages/business/Coupons";
import QRCodesPage from "./pages/business/QRCodes";
import BusinessAnalyticsPage from "./pages/business/Analytics";
import BusinessReferralsPage from "./pages/business/Referrals";
import BrandingPage from "./pages/business/Branding";
import CustomerLoyaltyCardsPage from "./pages/customer/LoyaltyCards";
import CustomerRewardsPage from "./pages/customer/Rewards";
import CustomerScanPage from "./pages/customer/Scan";
import CustomerReferralsPage from "./pages/customer/Referrals";
import SuperAdminAnalyticsPage from "./pages/super/Analytics";
import CampaignPublicPage from "./pages/CampaignPublicPage";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/campaigns/:businessSlug" element={<CampaignPublicPage />} />

              {/* Super Admin */}
              <Route
                path="/super-admin/*"
                element={
                  <RequireAuth allowedRoles={["super-admin"]}>
                    <DashboardLayout role="super-admin" />
                  </RequireAuth>
                }
              >
                <Route index element={<SuperAdminDashboard />} />
                <Route path="tenants" element={<ComingSoon title="Tenants" />} />
                <Route path="subscriptions" element={<ComingSoon title="Subscriptions" />} />
                <Route path="analytics" element={<SuperAdminAnalyticsPage />} />
                <Route path="settings" element={<ComingSoon title="Settings" />} />
                <Route path="more" element={<ComingSoon title="More" />} />
              </Route>

              {/* Business Admin */}
              <Route
                path="/business-admin/*"
                element={
                  <RequireAuth allowedRoles={["business-admin"]}>
                    <DashboardLayout role="business-admin" />
                  </RequireAuth>
                }
              >
                <Route index element={<BusinessAdminDashboard />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="customers" element={<ComingSoon title="Customers" />} />
                <Route path="branding" element={<BrandingPage />} />
                <Route path="rewards" element={<BusinessRewardsPage />} />
                <Route path="coupons" element={<CouponsPage />} />
                <Route path="qr-codes" element={<QRCodesPage />} />
                <Route path="analytics" element={<BusinessAnalyticsPage />} />
                <Route path="referrals" element={<BusinessReferralsPage />} />
                <Route path="settings" element={<ComingSoon title="Settings" />} />
                <Route path="more" element={<ComingSoon title="More" />} />
              </Route>

              {/* Customer */}
              <Route
                path="/customer/*"
                element={
                  <RequireAuth allowedRoles={["customer"]}>
                    <DashboardLayout role="customer" />
                  </RequireAuth>
                }
              >
                <Route index element={<CustomerDashboard />} />
                <Route path="loyalty-cards" element={<CustomerLoyaltyCardsPage />} />
                <Route path="rewards" element={<CustomerRewardsPage />} />
                <Route path="scan" element={<CustomerScanPage />} />
                <Route path="referrals" element={<CustomerReferralsPage />} />
                <Route path="history" element={<ComingSoon title="History" />} />
                <Route path="profile" element={<ComingSoon title="Profile" />} />
                <Route path="more" element={<ComingSoon title="More" />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
