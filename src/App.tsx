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
                <Route path="analytics" element={<ComingSoon title="Analytics" />} />
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
                <Route path="campaigns" element={<ComingSoon title="Campaigns" />} />
                <Route path="customers" element={<ComingSoon title="Customers" />} />
                <Route path="branding" element={<ComingSoon title="Branding" />} />
                <Route path="rewards" element={<ComingSoon title="Rewards" />} />
                <Route path="qr-codes" element={<ComingSoon title="QR Codes" />} />
                <Route path="analytics" element={<ComingSoon title="Analytics" />} />
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
                <Route path="loyalty-cards" element={<ComingSoon title="Loyalty Cards" />} />
                <Route path="rewards" element={<ComingSoon title="Rewards" />} />
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
