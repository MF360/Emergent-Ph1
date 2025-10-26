import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import axios from "axios";
import { toast } from "sonner";
import { Brain, Download, Clock, AlertCircle, CheckCircle } from "lucide-react";

// Environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
const API = `${BACKEND_URL}/api`;

// TypeScript interfaces
interface InvestorType {
  investor_id: number;
  first_name: string;
  last_name: string;
  email: string;
  risk_profile: "Low" | "Medium" | "High" | "Unknown";
}

interface AnalysisResultType {
  analysis_id: number;
  executive_summary: string;
  action_items: string[];
  risk_alerts: string[];
}

interface AnalysisHistoryType {
  analysis_id: number;
  analysis_type: "risk_summary" | "allocation_check";
  investor_ids: number[];
}

export default function AIAnalysis() {
  const [investors, setInvestors] = useState<InvestorType[]>([]);
  const [selectedInvestors, setSelectedInvestors] = useState<number[]>([]);
  const [analysisType, setAnalysisType] = useState<
    "risk_summary" | "allocation_check"
  >("risk_summary");
  const [useLiveAI, setUseLiveAI] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryType[]>([]);

  useEffect(() => {
    fetchInvestors();
    fetchHistory();
    fetchFeatureFlags();
  }, []);

  const fetchInvestors = async () => {
    try {
      const response = await axios.get<InvestorType[]>(`${API}/investors`);
      setInvestors(response.data.slice(0, 20)); // Limit for UI
    } catch {
      toast.error("Failed to fetch investors");
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get<AnalysisHistoryType[]>(
        `${API}/analysis/history`
      );
      setHistory(response.data);
    } catch {
      console.error("Failed to fetch analysis history");
    }
  };

  const fetchFeatureFlags = async () => {
    try {
      const response = await axios.get<{ use_live_ai: boolean }>(
        `${API}/settings/feature-flags`
      );
      setUseLiveAI(response.data.use_live_ai);
    } catch {
      console.error("Failed to fetch feature flags");
    }
  };

  const handleSelectInvestor = (investorId: number) => {
    setSelectedInvestors((prev) =>
      prev.includes(investorId)
        ? prev.filter((id) => id !== investorId)
        : [...prev, investorId]
    );
  };

  const handleRunAnalysis = async () => {
    if (selectedInvestors.length === 0) {
      toast.error("Please select at least one investor");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post<AnalysisResultType>(
        `${API}/analysis/run`,
        {
          investor_ids: selectedInvestors,
          analysis_type: analysisType,
          use_live_ai: useLiveAI,
        }
      );
      setResult(response.data);
      toast.success("Analysis completed successfully!");
      fetchHistory();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (analysisId: number) => {
    try {
      const response = await axios.get<Blob>(
        `${API}/analysis/report/${analysisId}/pdf`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `analysis_${analysisId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("PDF downloaded successfully");
    } catch {
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div data-testid="ai-analysis-page" className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold heading-font text-gray-900">
          AI Analysis
        </h1>
        <p className="text-gray-600 mt-1">
          Generate intelligent insights for your investors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <Card data-testid="analysis-config-card" className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="heading-font">
              Analysis Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-3 block font-semibold">Analysis Type</Label>
              <RadioGroup
                value={analysisType}
                onValueChange={(v) =>
                  setAnalysisType(v as "risk_summary" | "allocation_check")
                }
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem
                    value="risk_summary"
                    id="risk_summary"
                    data-testid="analysis-type-risk"
                  />
                  <Label htmlFor="risk_summary" className="cursor-pointer">
                    Risk Summary
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="allocation_check"
                    id="allocation_check"
                    data-testid="analysis-type-allocation"
                  />
                  <Label htmlFor="allocation_check" className="cursor-pointer">
                    Investment Allocation Check
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="live-ai"
                  checked={useLiveAI}
                  onCheckedChange={(checked) => setUseLiveAI(Boolean(checked))}
                  data-testid="use-live-ai-checkbox"
                />
                <Label htmlFor="live-ai" className="cursor-pointer">
                  Use Live AI (GPT-4o-mini)
                </Label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {useLiveAI
                  ? "Using live AI for analysis"
                  : "Using mock AI for demo"}
              </p>
            </div>

            <Button
              data-testid="run-analysis-button"
              onClick={handleRunAnalysis}
              disabled={loading || selectedInvestors.length === 0}
              className="w-full mt-6"
            >
              <Brain className="h-4 w-4 mr-2" />
              {loading ? "Analyzing..." : "Run Analysis"}
            </Button>
          </CardContent>
        </Card>

        {/* Investor Selection */}
        <Card data-testid="investor-selection-card" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="heading-font">
              Select Investors ({selectedInvestors.length} selected)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {investors.map((investor) => (
                <div
                  key={investor.investor_id}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectInvestor(investor.investor_id)}
                  data-testid={`investor-checkbox-${investor.investor_id}`}
                >
                  <Checkbox
                    checked={selectedInvestors.includes(investor.investor_id)}
                    onCheckedChange={() =>
                      handleSelectInvestor(investor.investor_id)
                    }
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {investor.first_name} {investor.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{investor.email}</p>
                  </div>
                  <Badge variant="outline">{investor.risk_profile}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Results */}
      {result && (
        <Card data-testid="analysis-results-card" className="glass-effect">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="heading-font">Analysis Results</CardTitle>
            <Button
              data-testid="download-pdf-button"
              onClick={() => handleDownloadPDF(result.analysis_id)}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Executive Summary
              </h3>
              <p data-testid="executive-summary" className="text-gray-700">
                {result.executive_summary}
              </p>
            </div>

            {result.action_items.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Action Items</h3>
                <ul data-testid="action-items" className="space-y-2">
                  {result.action_items.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-indigo-600 mt-1">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.risk_alerts.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center">
                  <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                  Risk Alerts
                </h3>
                <div data-testid="risk-alerts" className="space-y-2">
                  {result.risk_alerts.map((alert, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertDescription>{alert}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analysis History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="heading-font">Analysis History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.slice(0, 5).map((analysis) => (
                <div
                  key={analysis.analysis_id}
                  data-testid={`history-item-${analysis.analysis_id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {analysis.analysis_type === "risk_summary"
                          ? "Risk Summary"
                          : "Allocation Check"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {analysis.investor_ids.length} investors analyzed
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownloadPDF(analysis.analysis_id)}
                    variant="outline"
                    size="sm"
                    data-testid={`download-history-${analysis.analysis_id}`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
