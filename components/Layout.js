import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { 
  FiHome, 
  FiUsers, 
  FiBarChart, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiBriefcase,
  FiClock,
  FiFileText 
} from "react-icons/fi";

export default function Layout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (confirm("Yakin ingin logout?")) {
      localStorage.removeItem("isLoggedIn");
      router.push("/");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: FiHome,
    },
    {
      name: "Kelola Client",
      href: "/clients",
      icon: FiUsers,
    },
    {
      name: "Catatan",
      href: "/notes",
      icon: FiFileText,
    },
    {
      name: "History",
      href: "/history",
      icon: FiClock,
    },
    {
      name: "Statistik",
      href: "/stats",
      icon: FiBarChart,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-700/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FiBriefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">ProMi</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-white hover:text-blue-200 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "text-blue-100 hover:bg-blue-700/50 hover:text-white hover:transform hover:scale-105"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-blue-300 group-hover:text-white"}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-300 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-200 group"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-20 left-4 right-4 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
      </aside>

      {/* Main Content Area */}
      <div className="md:ml-64 min-h-screen">
        {/* Top Header for Mobile */}
        <header className="md:hidden bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-600 rounded-md">
                <FiBriefcase className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-blue-800">ProMi</h1>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="max-w-none">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}