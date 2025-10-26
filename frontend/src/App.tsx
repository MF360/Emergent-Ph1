import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import type { User } from "./lib/types";

// Landing Pages
import Index from "./pages/Index"; // landing home

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import Investors from "./pages/Investors";
import InvestorDetail from "./pages/InvestorDetail";
import AIAnalysis from "./pages/AIAnalysis";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: User, token: string) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster position="top-right" richColors />
        <BrowserRouter>
          <Routes>
            {/* Public Landing Pages */}
            <Route path="/" element={<Index />} />

            {/* Authentication */}
            <Route
              path="/login"
              element={
                !user ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/signup"
              element={
                !user ? (
                  <Signup onLogin={handleLogin} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                user ? (
                  <Layout user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="investors" element={<Investors />} />
              <Route path="investors/:id" element={<InvestorDetail />} />
              <Route path="ai-analysis" element={<AIAnalysis />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
