import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
// import DashboardPreview from "../components/DashboardPreview";
import DifferentiatorSection from "../components/DifferentiatorSection";
import WorkflowSection, {
  type WorkflowStep,
} from "../components/WorkflowSection";
import SecuritySection, { type Feature } from "../components/SecuritySection";
import ProblemStatement from "../components/ProblemStatement";

// Define the type locally since it's only used here
type DifferentiatorItem = {
  icon: "Zap" | "Layers" | "Target" | "Shield" | "TrendingUp";
  title: string;
  description: string;
};

// Differentiator Data
const differentiatorData = [
  {
    icon: "Layers",
    title: "Unified Platform",
    description:
      "CRM, AI analytics & transactions — all in one seamless experience.",
  },
  {
    icon: "Zap",
    title: "AI-Powered Insights",
    description:
      "Turns live data into actionable recommendations — fast, accurate & efficient.",
  },
  {
    icon: "Target",
    title: "Smart Client Management",
    description:
      "Purpose-built CRM for MFDs — track AUM, SIPs & client engagement effortlessly.",
  },
  {
    icon: "TrendingUp",
    title: "Scalable & Future-Ready",
    description:
      "From solo IFAs to large distributors — easy onboarding, modular architecture & automation-ready growth.",
  },
  {
    icon: "Shield",
    title: "Compliance & Security First",
    description:
      "Bank-grade encryption, data masking & secure infrastructure ensure complete data protection.",
  },
] as const satisfies DifferentiatorItem[];

// Workflow Section Data
const workflowData = [
  {
    step: 1,
    icon: "UserPlus",
    title: "Sign Up",
    description:
      "Create your MF360 account and get started within minutes — no complex setup required.",
  },
  {
    step: 2,
    icon: "Database",
    title: "Integration",
    description:
      "Connect seamlessly with CAMS, KFintech, BSE Star MF, and NSE NMF II for unified data access.",
  },
  {
    step: 3,
    icon: "Lightbulb",
    title: "AI Analysis",
    description:
      "Leverage AI to analyze portfolios, detect overlaps, assess risk, and recommend actionable insights.",
  },
  {
    step: 4,
    icon: "MousePointer",
    title: "CRM Dashboard",
    description:
      "Manage clients, leads, and AUM — track engagement, performance, and transactions in one place.",
  },
  {
    step: 5,
    icon: "Database",
    title: "Transaction",
    description:
      "Execute SIPs, lumpsum investments, switches, and redemptions securely and instantly.",
  },
  {
    step: 6,
    icon: "Lightbulb",
    title: "Reports",
    description:
      "Generate professional, client-ready reports with visual analytics and personalized insights.",
  },
  {
    step: 7,
    icon: "TrendingUp",
    title: "Growth & Scale",
    description:
      "Expand effortlessly with automation-ready tools, AI recommendations, and modular scaling.",
  },
] as const satisfies WorkflowStep[];

// --- CHANGES ARE HERE ---
// Security Features - Updated with color properties
const securityFeatures: Feature[] = [
  {
    icon: "Lock",
    title: "Bank-Grade Security",
    description: "All data is encrypted and securely stored.",
    iconBg: "#f0fdf4", // <-- ADDED
    iconColor: "#16a34a", // <-- ADDED
  },
  {
    icon: "FileCheck",
    title: "Regulatory Compliance",
    description: "Compliant with SEBI, AMFI, and KYC/AML regulations.",
    iconBg: "#f0fdf4", // <-- ADDED
    iconColor: "#16a34a", // <-- ADDED
  },
  {
    icon: "UserCheck",
    title: "User Verification",
    description: "Ensure your clients are verified and secure.",
    iconBg: "#f0fdf4", // <-- ADDED
    iconColor: "#16a34a", // <-- ADDED
  },
  {
    icon: "Eye",
    title: "Audit Logging",
    description: "Keep track of all activity for transparency.",
    iconBg: "#f0fdf4", // <-- ADDED
    iconColor: "#16a34a", // <-- ADDED
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <ProblemStatement />
        <Features />
        <DifferentiatorSection data={differentiatorData} />

        {/* Visual Separator */}
        <div className="relative py-16 bg-background">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-4xl mx-auto px-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-background px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <div className="h-2 w-2 rounded-full bg-accent"></div>
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <WorkflowSection data={workflowData} />
        {/* <Testimonials /> */}
        {/* <DashboardPreview /> */}
        <SecuritySection data={securityFeatures} />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
