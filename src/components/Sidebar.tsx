import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* OVERLAY (mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r z-50
        transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="font-bold text-lg">SumoPod</h1>
          <button
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="p-4 space-y-4 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-2">SERVICES</p>
            <ul className="space-y-1">
              <li className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                Chat
              </li>
              <li className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                AI
              </li>
              <li className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                Services
              </li>
              <li className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                Wallet
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2">INFRASTRUCTURE</p>
            <ul className="space-y-1">
              <li className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                VPS
              </li>
              <li className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                Database
              </li>
              <li className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                Domains
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2">ACCOUNT</p>
            <ul className="space-y-1">
              <li className="p-2 rounded-lg bg-gray-100 font-medium">
                Billing
              </li>
              <li className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                Settings
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 lg:ml-64">
        
        {/* TOPBAR */}
        <header className="flex items-center justify-between p-4 border-b bg-white">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <h2 className="font-semibold">Dashboard</h2>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">User</p>
              <p className="text-xs text-gray-500">user@email.com</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
              U
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-2">Billing</h1>
          <p className="text-gray-500">
            Manage your balance and view transaction history
          </p>
        </main>
      </div>
    </div>
  );
}