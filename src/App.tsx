import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./components/LoginForm";
import OtpForm from "./components/OtpForm";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Complaints from "./pages/Complaints";
import NotFound from "./pages/NotFound";
import NewComplaint from "./pages/NewComplaint";
import RegionalComplaint from "./pages/RegionalComplaint";
import ComplaintDetails from "./pages/ComplaintDetails";

import { DashboardLayout } from "./components/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/index" element={<Index />} />
            <Route path="/otp-verification" element={<OtpForm />} />
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              }
            />
            <Route
              path="/complaints/all"
              element={
                <DashboardLayout>
                  <Complaints />
                </DashboardLayout>
              }
            />
            <Route
              path="/complaints/department"
              element={
                <DashboardLayout>
                  <RegionalComplaint />
                </DashboardLayout>
              }
            />
            <Route
              path="/complaints/:id"
              element={
                <DashboardLayout>
                  <ComplaintDetails />
                </DashboardLayout>
              }
            />
            <Route
              path="/complaints/pending"
              element={
                <DashboardLayout>
                  <Complaints />
                </DashboardLayout>
              }
            />
            <Route
              path="/new-complaint"
              element={
                <DashboardLayout>
                  <NewComplaint />
                </DashboardLayout>
              }
            />
            <Route
              path="/configuration/*"
              element={
                <DashboardLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Configuration</h1>
                  </div>
                </DashboardLayout>
              }
            />
            <Route
              path="/crm-reports/*"
              element={
                <DashboardLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">CRM Reports</h1>
                  </div>
                </DashboardLayout>
              }
            />
            <Route
              path="/kyc-reports/*"
              element={
                <DashboardLayout>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">KYC Reports</h1>
                  </div>
                </DashboardLayout>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
