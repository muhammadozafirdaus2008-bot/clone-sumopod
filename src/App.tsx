import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Services from "@/pages/Services";
import AddService from "@/pages/AddService";
import Billing from "./pages/billing";
import NotFound from "@/pages/NotFound";
import PlaceholderPage from "@/components/PlaceholderPage";
import {
  GraduationCap, Users2, MessageSquare, Bot, Wallet,
  Monitor, Database, Globe, Mail, Users, Settings, HelpCircle,
} from "lucide-react";
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
const [todos, setTodos] = useState([])

const queryClient = new QueryClient();
  useEffect(() => {
    async function getTodos() {
      const { data } = await supabase.from('todos').select()

      if (data) {
        setTodos(data)
      }
    }

    getTodos()
  }, [])


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/services" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<DashboardLayout />}>
              {/* LEARNING */}
              <Route path="/learn" element={<PlaceholderPage title="Learn" subtitle="Tutorials and guides" icon={<GraduationCap className="h-8 w-8 text-accent-foreground" />} />} />
              <Route path="/community" element={<PlaceholderPage title="Community" subtitle="Connect with other users" icon={<Users2 className="h-8 w-8 text-accent-foreground" />} />} />
              {/* SERVICES */}
              <Route path="/chat" element={<PlaceholderPage title="Chat" subtitle="Messaging services" icon={<MessageSquare className="h-8 w-8 text-accent-foreground" />} />} />
              <Route path="/ai" element={<PlaceholderPage title="AI" subtitle="AI-powered tools" icon={<Bot className="h-8 w-8 text-accent-foreground" />} />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/add" element={<AddService />} />
              <Route path="/wallet" element={<PlaceholderPage title="Wallet" subtitle="Manage your wallet" icon={<Wallet className="h-8 w-8 text-accent-foreground" />} />} />
              {/* INFRASTRUCTURE */}
              <Route path="/vps" element={<PlaceholderPage title="VPS" subtitle="Virtual private servers" icon={<Monitor className="h-8 w-8 text-accent-foreground" />} />} />
              <Route path="/database" element={<PlaceholderPage title="Database" subtitle="Managed databases" icon={<Database className="h-8 w-8 text-accent-foreground" />} />} />
              <Route path="/domains" element={<PlaceholderPage title="Domains" subtitle="Domain management" icon={<Globe className="h-8 w-8 text-accent-foreground" />} />} />
              {/* COMMUNICATION */}
              <Route path="/email-smtp" element={<PlaceholderPage title="Email SMTP" subtitle="Email delivery service" icon={<Mail className="h-8 w-8 text-accent-foreground" />} />} />
              {/* ACCOUNT */}
              <Route path="/billing" element={<Billing />} />
              <Route path="/affiliate" element={<PlaceholderPage title="Affiliate" subtitle="Referral program" icon={<Users className="h-8 w-8 text-accent-foreground" />} />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" subtitle="Account settings" icon={<Settings className="h-8 w-8 text-accent-foreground" />} />} />
              <Route path="/support" element={<PlaceholderPage title="Support" subtitle="Get help" icon={<HelpCircle className="h-8 w-8 text-accent-foreground" />} />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
