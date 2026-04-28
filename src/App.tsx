import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Services from "@/pages/Services";
import AddService from "@/pages/AddService";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import Billing from "./pages/billing";
import NotFound from "@/pages/NotFound";
import PlaceholderPage from "@/components/PlaceholderPage";
import InstancesPage from "@/pages/InstancesPage";
import InstanceDetailPage from "@/pages/InstanceDetailPage";
import DeployN8NPage from "@/pages/DeployN8NPage";
import SettingsPage from "@/pages/Settings";
import Landing from "./pages/Landing";
import {
  GraduationCap, Users2, MessageSquare, Bot, Wallet,
  Monitor, Database, Globe, Mail, Users, HelpCircle,
} from "lucide-react";
import Learn from "@/pages/Learn";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Dashboard */}
              <Route element={<DashboardLayout />}>

                {/* Learning */}
                <Route path="/learn" element={<Learn />} />
                <Route path="/community" element={<PlaceholderPage title="Community" subtitle="Connect with users"   icon={<Users2 className="h-8 w-8" />} />} />

                {/* AI & Chat */}
                <Route path="/chat" element={<PlaceholderPage title="Chat" subtitle="Messaging" icon={<MessageSquare className="h-8 w-8" />} />} />
                <Route path="/ai"   element={<PlaceholderPage title="AI"   subtitle="AI tools"  icon={<Bot className="h-8 w-8" />} />} />

                {/* Services */}
                <Route path="/services"        element={<Services />} />
                <Route path="/services/add"    element={<AddService />} />
                <Route path="/services/deploy" element={<DeployN8NPage />} />
                <Route path="/services/:id"    element={<ServiceDetailPage />} /> {/* ✅ Manage */}

                {/* Instances (legacy) */}
                <Route path="/instances"     element={<InstancesPage />} />
                <Route path="/instances/:id" element={<InstanceDetailPage />} />

                {/* Infrastructure */}
                <Route path="/wallet"   element={<PlaceholderPage title="Wallet"   subtitle="Manage wallet" icon={<Wallet className="h-8 w-8" />} />} />
                <Route path="/vps"      element={<PlaceholderPage title="VPS"      subtitle="Servers"       icon={<Monitor className="h-8 w-8" />} />} />
                <Route path="/database" element={<PlaceholderPage title="Database" subtitle="DB"            icon={<Database className="h-8 w-8" />} />} />
                <Route path="/domains"  element={<PlaceholderPage title="Domains"  subtitle="Domain mgmt"   icon={<Globe className="h-8 w-8" />} />} />

                {/* Communication */}
                <Route path="/email-smtp" element={<PlaceholderPage title="Email SMTP" subtitle="Email service" icon={<Mail className="h-8 w-8" />} />} />

                {/* Account */}
                <Route path="/billing"   element={<Billing />} />
                <Route path="/affiliate" element={<PlaceholderPage title="Affiliate" subtitle="Referral" icon={<Users className="h-8 w-8" />} />} />
                <Route path="/settings"  element={<SettingsPage />} />
                <Route path="/support"   element={<PlaceholderPage title="Support" subtitle="Help" icon={<HelpCircle className="h-8 w-8" />} />} />

              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}