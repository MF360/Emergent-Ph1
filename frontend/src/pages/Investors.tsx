import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { Search, Download, Upload, Eye, Trash2 } from "lucide-react";

// Type-safe environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Define TypeScript interface for an investor
interface Investor {
  investor_id: number;
  first_name: string;
  last_name: string;
  email: string;
  arn: string;
  kyc_status: "Y" | "N";
  risk_profile: "Low" | "Medium" | "High" | "Unknown";
  amt_aum: number;
}

export default function Investors() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [filteredInvestors, setFilteredInvestors] = useState<Investor[]>([]);
  const [search, setSearch] = useState("");
  const [kycFilter, setKycFilter] = useState<"all" | "Y" | "N">("all");
  const [riskFilter, setRiskFilter] = useState<
    "all" | "Low" | "Medium" | "High" | "Unknown"
  >("all");
  const [loading, setLoading] = useState(true);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    fetchInvestors();
  }, []);

  useEffect(() => {
    filterInvestors();
  }, [investors, search, kycFilter, riskFilter]);

  const fetchInvestors = async () => {
    try {
      const response = await axios.get<Investor[]>(`${API}/investors`);
      setInvestors(response.data);
    } catch (error) {
      toast.error("Failed to fetch investors");
    } finally {
      setLoading(false);
    }
  };

  const filterInvestors = () => {
    let filtered = [...investors];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.first_name.toLowerCase().includes(searchLower) ||
          inv.last_name.toLowerCase().includes(searchLower) ||
          inv.email.toLowerCase().includes(searchLower) ||
          inv.arn.toLowerCase().includes(searchLower)
      );
    }

    if (kycFilter !== "all") {
      filtered = filtered.filter((inv) => inv.kyc_status === kycFilter);
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter((inv) => inv.risk_profile === riskFilter);
    }

    setFilteredInvestors(filtered);
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(
        `${API}/investors/csv-template/download`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "investor_template.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Template downloaded successfully");
    } catch {
      toast.error("Failed to download template");
    }
  };

  const handleImportCSV = async () => {
    if (!uploadFile) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const response = await axios.post(
        `${API}/investors/import-csv`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(response.data.message);
      setImportDialogOpen(false);
      setUploadFile(null);
      fetchInvestors();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to import CSV");
    }
  };

  const handleDelete = async (investorId: number) => {
    if (!window.confirm("Are you sure you want to delete this investor?"))
      return;

    try {
      await axios.delete(`${API}/investors/${investorId}`);
      toast.success("Investor deleted successfully");
      fetchInvestors();
    } catch {
      toast.error("Failed to delete investor");
    }
  };

  return (
    <div data-testid="investors-page" className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold heading-font text-gray-900">
            Investors
          </h1>
          <p className="text-gray-600 mt-1">Manage your investor database</p>
        </div>
        <div className="flex space-x-2">
          <Button
            data-testid="download-template-button"
            onClick={handleDownloadTemplate}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" /> Template
          </Button>
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="import-csv-button" variant="outline">
                <Upload className="h-4 w-4 mr-2" /> Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Investors from CSV</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUploadFile(e.target.files?.[0] || null)
                  }
                  data-testid="csv-file-input"
                />
                <Button
                  data-testid="upload-csv-button"
                  onClick={handleImportCSV}
                  className="w-full"
                >
                  Upload
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                data-testid="search-input"
                placeholder="Search investors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={kycFilter}
              onValueChange={(value) =>
                setKycFilter(value as "all" | "Y" | "N")
              }
            >
              <SelectTrigger data-testid="kyc-filter">
                <SelectValue placeholder="KYC Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All KYC Status</SelectItem>
                <SelectItem value="Y">Completed</SelectItem>
                <SelectItem value="N">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={riskFilter}
              onValueChange={(value) =>
                setRiskFilter(
                  value as "all" | "Low" | "Medium" | "High" | "Unknown"
                )
              }
            >
              <SelectTrigger data-testid="risk-filter">
                <SelectValue placeholder="Risk Profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Profiles</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Investor Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading investors...
            </div>
          ) : filteredInvestors.length === 0 ? (
            <div
              data-testid="no-investors-message"
              className="p-8 text-center text-gray-500"
            >
              No investors found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table data-testid="investors-table" className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ARN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KYC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AUM
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvestors.map((investor) => (
                    <tr
                      key={investor.investor_id}
                      data-testid={`investor-row-${investor.investor_id}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {investor.first_name} {investor.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {investor.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {investor.arn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            investor.kyc_status === "Y"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {investor.kyc_status === "Y" ? "Complete" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {investor.risk_profile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{investor.amt_aum.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/investors/${investor.investor_id}`}
                            data-testid={`view-investor-${investor.investor_id}`}
                          >
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            data-testid={`delete-investor-${investor.investor_id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(investor.investor_id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
