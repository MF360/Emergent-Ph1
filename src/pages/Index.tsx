import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";
import DashboardPreview from "../components/DashboardPreview";
import DifferentiatorSection from "../components/DifferentiatorSection";
import WorkflowSection, {
  type WorkflowStep,
} from "../components/WorkflowSection";
import SecuritySection, { type Feature } from "../components/SecuritySection";

// Define the type locally since it's only used here
type DifferentiatorItem = {
  icon: "Zap" | "Layers" | "Target" | "Shield" | "TrendingUp";
  title: string;
  description: string;
};

// Define the data array matching DifferentiatorItem type
const differentiatorData: DifferentiatorItem[] = [
  {
    icon: "Zap",
    title: "Fast Analysis",
    description: "Analyze mutual fund portfolios quickly and efficiently.",
  },
  {
    icon: "Layers",
    title: "Multi-Portfolio Support",
    description: "Manage multiple client portfolios in one place.",
  },
  {
    icon: "Target",
    title: "Precise Recommendations",
    description: "Get accurate investment recommendations based on data.",
  },
  {
    icon: "Shield",
    title: "Secure & Compliant",
    description: "Your data is protected with enterprise-grade security.",
  },
  {
    icon: "TrendingUp",
    title: "Growth Tracking",
    description: "Monitor client portfolio performance over time.",
  },
];

// Workflow Section Data
const workflowData: WorkflowStep[] = [
  {
    step: 1,
    icon: "UserPlus",
    title: "Sign Up",
    description: "Create your account in minutes.",
  },
  {
    step: 2,
    icon: "Database",
    title: "Add Portfolio",
    description: "Add client portfolios effortlessly.",
  },
  {
    step: 3,
    icon: "Lightbulb",
    title: "Analyze",
    description: "Get actionable insights quickly.",
  },
  {
    step: 4,
    icon: "MousePointer",
    title: "Invest",
    description: "Make informed investment decisions.",
  },
];

const securityFeatures: Feature[] = [
  {
    icon: "Lock",
    title: "Bank-Grade Security",
    description: "All data is encrypted and securely stored.",
  },
  {
    icon: "FileCheck",
    title: "Regulatory Compliance",
    description: "Compliant with SEBI, AMFI, and KYC/AML regulations.",
  },
  {
    icon: "UserCheck",
    title: "User Verification",
    description: "Ensure your clients are verified and secure.",
  },
  {
    icon: "Eye",
    title: "Audit Logging",
    description: "Keep track of all activity for transparency.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
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
        <Testimonials />
        <DashboardPreview />
        <SecuritySection data={securityFeatures} />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
