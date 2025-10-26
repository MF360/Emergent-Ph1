import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
} from "lucide-react";

// Environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
const API = `${BACKEND_URL}/api`;

// TypeScript interface for investor detail
interface InvestorDetailType {
  investor_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  dob: string;
  pan: string;
  arn?: string;
  kyc_status: "Y" | "N";
  risk_profile: "Low" | "Medium" | "High" | "Unknown";
  amt_aum: number;
  folio_ids: string[];
  preferred_contact: string;
  notes?: string;
}

export default function InvestorDetail() {
  const { id } = useParams<{ id: string }>();
  const [investor, setInvestor] = useState<InvestorDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestor();
  }, [id]);

  const fetchInvestor = async () => {
    try {
      const response = await axios.get<InvestorDetailType>(
        `${API}/investors/${id}`
      );
      setInvestor(response.data);
    } catch {
      toast.error("Failed to fetch investor details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!investor) {
    return <div className="p-6 text-center">Investor not found</div>;
  }

  return (
    <div data-testid="investor-detail-page" className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/investors">
            <Button data-testid="back-to-investors" variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold heading-font text-gray-900">
              {investor.first_name} {investor.last_name}
            </h1>
            <p className="text-gray-600 mt-1">ARN: {investor.arn}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card data-testid="profile-card" className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="heading-font">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm font-medium">{investor.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-sm font-medium">{investor.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-sm font-medium">
                  {investor.city}, {investor.state}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-sm font-medium">{investor.dob}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">PAN</p>
                <p className="text-sm font-medium">{investor.pan}</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">KYC Status</span>
                <Badge
                  variant={
                    investor.kyc_status === "Y" ? "default" : "secondary"
                  }
                >
                  {investor.kyc_status === "Y" ? "Complete" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Risk Profile</span>
                <Badge variant="outline">{investor.risk_profile}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Summary */}
        <Card data-testid="portfolio-card" className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="heading-font">Portfolio Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
              <p className="text-sm opacity-90">Total AUM</p>
              <p className="text-3xl font-bold heading-font mt-2">
                ₹{investor.amt_aum.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Folio IDs</p>
              <div className="flex flex-wrap gap-2">
                {investor.folio_ids.map((folio) => (
                  <Badge key={folio} variant="secondary">
                    {folio}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Preferred Contact</p>
              <Badge variant="outline">{investor.preferred_contact}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Placeholder */}
        <Card data-testid="ai-insights-card" className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="heading-font">AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No AI insights available</p>
              <p className="text-sm mt-2">
                Run an analysis from AI Analysis page
              </p>
              <Link to="/ai-analysis">
                <Button
                  data-testid="run-analysis-link"
                  className="mt-4"
                  size="sm"
                >
                  Run Analysis
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {investor.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="heading-font">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{investor.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
