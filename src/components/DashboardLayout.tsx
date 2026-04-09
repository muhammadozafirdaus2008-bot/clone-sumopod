import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ScrollIndicator from "@/components/ui/ScrollIndicator";

const DashboardLayout = () => {
  const { user, loading } = useAuth();

  // loading screen
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // redirect kalau belum login
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-6 relative">
          <Outlet />
          <ScrollIndicator />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;