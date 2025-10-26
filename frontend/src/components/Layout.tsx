import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import type { User } from "../lib/types";
import {
  LayoutDashboard,
  Users,
  Brain,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";

// Define the user and component prop types
interface LayoutProps {
  user?: User;
  onLogout: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  testid: string;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      testid: "nav-dashboard",
    },
    {
      name: "Investors",
      href: "/investors",
      icon: Users,
      testid: "nav-investors",
    },
    {
      name: "AI Analysis",
      href: "/ai-analysis",
      icon: Brain,
      testid: "nav-ai-analysis",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      testid: "nav-settings",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      data-testid="layout-container"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      {/* Sidebar */}
      <aside
        data-testid="sidebar"
        className={`fixed top-0 left-0 z-40 h-screen bg-white shadow-lg transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold heading-font text-gray-900">
                  MF360
                </h1>
                <p className="text-xs text-gray-500">CRM & AI Analysis</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  data-testid={item.testid}
                  className={`sidebar-item flex items-center space-x-3 px-4 py-3 rounded-lg ${
                    isActive(item.href)
                      ? "bg-indigo-600 text-white"
                      : "text-gray-700 hover:bg-indigo-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.full_name?.charAt(0).toUpperCase() ?? "U"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.full_name ?? "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role ?? "Guest"}
                  </p>
                </div>
              </div>
            </div>
            <Button
              data-testid="logout-button"
              onClick={onLogout}
              variant="outline"
              className="w-full justify-center"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              data-testid="toggle-sidebar-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
