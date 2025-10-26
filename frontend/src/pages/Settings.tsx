import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import axios from "axios";
import { toast } from "sonner";
import { RefreshCw, Database, Sparkles } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
const API = `${BACKEND_URL}/api`;

// Types
interface FeatureFlagsType {
  use_live_ai: boolean;
  allow_csv_import: boolean;
}

export default function Settings() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagsType>({
    use_live_ai: false,
    allow_csv_import: true,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [reseedLoading, setReseedLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  const fetchFeatureFlags = async () => {
    try {
      const response = await axios.get<FeatureFlagsType>(
        `${API}/settings/feature-flags`
      );
      setFeatureFlags(response.data);
    } catch {
      toast.error("Failed to fetch settings");
    }
  };

  const handleSaveFlags = async () => {
    setLoading(true);
    try {
      await axios.put(`${API}/settings/feature-flags`, featureFlags);
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleReseedData = async () => {
    if (
      !window.confirm(
        "Are you sure you want to regenerate seed data? This will delete all existing investors."
      )
    ) {
      return;
    }

    setReseedLoading(true);
    try {
      await axios.post(`${API}/settings/reseed-data`);
      toast.success("Seed data regenerated successfully");
    } catch {
      toast.error("Failed to regenerate seed data");
    } finally {
      setReseedLoading(false);
    }
  };

  return (
    <div data-testid="settings-page" className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold heading-font text-gray-900">
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your application settings and preferences
        </p>
      </div>

      {/* Feature Flags */}
      <Card data-testid="feature-flags-card">
        <CardHeader>
          <CardTitle className="heading-font flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-indigo-600" />
            Feature Flags
          </CardTitle>
          <CardDescription>
            Control which features are enabled in the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="live-ai" className="font-medium">
                Use Live AI
              </Label>
              <p className="text-sm text-gray-500">
                Enable live AI analysis using GPT-4o-mini. When disabled, uses
                mock AI for demonstrations.
              </p>
            </div>
            <Switch
              id="live-ai"
              data-testid="live-ai-switch"
              checked={featureFlags.use_live_ai}
              onCheckedChange={(checked) =>
                setFeatureFlags({
                  ...featureFlags,
                  use_live_ai: Boolean(checked),
                })
              }
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-1">
              <Label htmlFor="csv-import" className="font-medium">
                Allow CSV Import
              </Label>
              <p className="text-sm text-gray-500">
                Enable CSV import functionality for bulk investor upload.
              </p>
            </div>
            <Switch
              id="csv-import"
              data-testid="csv-import-switch"
              checked={featureFlags.allow_csv_import}
              onCheckedChange={(checked) =>
                setFeatureFlags({
                  ...featureFlags,
                  allow_csv_import: Boolean(checked),
                })
              }
            />
          </div>

          <div className="pt-4">
            <Button
              data-testid="save-flags-button"
              onClick={handleSaveFlags}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seed Data Management */}
      <Card data-testid="seed-data-card">
        <CardHeader>
          <CardTitle className="heading-font flex items-center">
            <Database className="h-5 w-5 mr-2 text-indigo-600" />
            Seed Data Management
          </CardTitle>
          <CardDescription>
            Manage dummy investor data for testing and demonstration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Regenerating seed data will delete all existing investors and
              create 50 new dummy investors with realistic data. This action
              cannot be undone.
            </AlertDescription>
          </Alert>

          <Button
            data-testid="reseed-data-button"
            onClick={handleReseedData}
            disabled={reseedLoading}
            variant="destructive"
            className="w-full"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${reseedLoading ? "animate-spin" : ""}`}
            />
            {reseedLoading ? "Regenerating..." : "Regenerate Seed Data"}
          </Button>
        </CardContent>
      </Card>

      {/* API Information */}
      <Card>
        <CardHeader>
          <CardTitle className="heading-font">API Information</CardTitle>
          <CardDescription>
            REST API endpoints for third-party integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-mono text-gray-700">
              GET /api/investors
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Fetch all investors with optional filters
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-mono text-gray-700">
              POST /api/analysis
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Run AI analysis on selected investors
            </p>
          </div>
          <div className="text-sm text-gray-600 mt-4">
            <p className="font-medium mb-2">Authentication:</p>
            <p>Include Bearer token in Authorization header:</p>
            <code className="block mt-2 p-2 bg-gray-50 rounded text-xs">
              Authorization: Bearer YOUR_TOKEN_HERE
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Instructions for Switching to Real LLM */}
      <Card>
        <CardHeader>
          <CardTitle className="heading-font">
            How to Switch to Real LLM
          </CardTitle>
          <CardDescription>
            Steps to integrate your own AI provider
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <div>
            <p className="font-medium mb-2">
              1. Using Emergent LLM Key (Current Setup):
            </p>
            <p className="text-gray-600 ml-4">
              The app is already configured to use the Emergent Universal Key.
              Simply toggle "Use Live AI" above to enable it.
            </p>
          </div>
          <div>
            <p className="font-medium mb-2">2. Using Your Own OpenAI Key:</p>
            <ul className="list-disc ml-8 text-gray-600 space-y-1">
              <li>
                Update EMERGENT_LLM_KEY in backend/.env with your OpenAI API key
              </li>
              <li>
                Restart the backend service: sudo supervisorctl restart backend
              </li>
              <li>Enable "Use Live AI" from Feature Flags</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">3. Model Configuration:</p>
            <p className="text-gray-600 ml-4">
              Current model: gpt-4o-mini. To change, modify the model name in
              /app/backend/server.py at line with .with_model("openai",
              "MODEL_NAME")
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
