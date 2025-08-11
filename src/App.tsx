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

              <Route
                path="/super-admin"
                element={
                  <RequireAuth allowedRoles={["super-admin"]}>
                    <SuperAdminDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/business-admin"
                element={
                  <RequireAuth allowedRoles={["business-admin"]}>
                    <BusinessAdminDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/customer"
                element={
                  <RequireAuth allowedRoles={["customer"]}>
                    <CustomerDashboard />
                  </RequireAuth>
                }
              />

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
