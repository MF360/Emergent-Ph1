import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import axios from "axios";
import { Users, AlertCircle, TrendingUp, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Type for dashboard stats
interface Stats {
  total_investors: number;
  kyc_pending: number;
  total_aum: number;
  recent_analyses: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    total_investors: 0,
    kyc_pending: 0,
    total_aum: 0,
    recent_analyses: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get<Stats>(`${API}/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Investors",
      value: stats.total_investors,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      testid: "total-investors-stat",
    },
    {
      title: "KYC Pending",
      value: stats.kyc_pending,
      icon: AlertCircle,
      color: "from-orange-500 to-orange-600",
      testid: "kyc-pending-stat",
    },
    {
      title: "Total AUM",
      value: `₹${(stats.total_aum / 10000000).toFixed(2)}Cr`,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      testid: "total-aum-stat",
    },
    {
      title: "AI Analyses",
      value: stats.recent_analyses,
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      testid: "ai-analyses-stat",
    },
  ];

  return (
    <div data-testid="dashboard-page" className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold heading-font text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome to MF360 - Your Investor CRM & AI Analysis Platform
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-lg loading-shimmer"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                data-testid={stat.testid}
                className="stat-card overflow-hidden"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold heading-font text-gray-900">
                      {stat.value}
                    </div>
                    <div
                      className={`h-12 w-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="heading-font">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/investors"
              data-testid="quick-action-view-investors"
              className="block p-4 rounded-lg border hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">
                View All Investors
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage your investor database
              </p>
            </a>
            <a
              href="/ai-analysis"
              data-testid="quick-action-run-analysis"
              className="block p-4 rounded-lg border hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Run AI Analysis</h3>
              <p className="text-sm text-gray-600 mt-1">
                Generate insights using AI
              </p>
            </a>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="heading-font">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
              <p className="text-sm mt-2">Start by running an AI analysis</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
