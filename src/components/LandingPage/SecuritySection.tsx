import React from "react";
import { Card, CardContent } from "../ui/card";
import { Lock, FileCheck, UserCheck, Eye, Shield } from "lucide-react";

// Map icons for dynamic rendering
const iconMap = {
  Lock: Lock,
  FileCheck: FileCheck,
  UserCheck: UserCheck, // Kept for semantic accuracy for "User Verification"
  Eye: Eye,
  Shield: Shield,
} as const;

// Feature type to include colors for individual icon styling
export interface Feature {
  icon: keyof typeof iconMap;
  title: string;
  description: string;
  iconBg: string; // Hex code for icon background
  iconColor: string; // Hex code for icon color
}

// Badge type
export interface Badge {
  name: string;
  description: string;
  fromColor: string;
  toColor: string;
  textColor: string;
}

// Props
interface SecuritySectionProps {
  data?: Feature[];
  badges?: Badge[];
}

// --- CONTENT UPDATED HERE ---
// REVISED default data to match your new screenshot and green icon theme
const defaultFeatures: Feature[] = [
  {
    icon: "Lock",
    title: "Bank-Grade Security",
    description:
      "We safeguard all data with AES-256 encryption, secure HTTPS/TLS communication, and multi-layer authentication — ensuring every client portfolio and transaction remains completely protected.",
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
  },
  {
    icon: "Shield",
    title: "Data Privacy & Protection",
    description:
      "Personal information such as PAN, account numbers, and identifiers are masked. Strict access controls ensure only authorized users can view or modify sensitive data, complying with Indian data protection laws.",
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
  },
  {
    icon: "FileCheck",
    title: "Regulatory Compliance",
    description:
      "Fully integrated with CAMS, KFintech, BSE Star MF, and NSE NMF II — every transaction is audit-ready and traceable. MF360 adheres to SEBI and AMFI standards with automated compliance reporting.",
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
  },
  {
    icon: "Eye",
    title: "Continuous Monitoring",
    description:
      "We ensure 24/7 protection with real-time alerts for unusual activity, periodic security audits, system health checks, and redundant backups to maintain uptime and prevent data loss.",
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
  },
];

// Default badges from previous design
const defaultBadges: Badge[] = [
  {
    name: "SEBI",
    description: "SEBI Registered",
    fromColor: "#e0e7ff",
    toColor: "#e9d5ff",
    textColor: "#4f46e5",
  },
  {
    name: "AMFI",
    description: "AMFI Certified",
    fromColor: "#dcfce7",
    toColor: "#d1fae5",
    textColor: "#16a34a",
  },
  {
    name: "KYC/AML",
    description: "KYC/AML Compliant",
    fromColor: "#f3e8ff",
    toColor: "#fae8ff",
    textColor: "#9333ea",
  },
  {
    name: "ISO",
    description: "ISO 27001",
    fromColor: "#fff7ed",
    toColor: "#ffedd5",
    textColor: "#f97316",
  },
];

const SecuritySection: React.FC<SecuritySectionProps> = ({
  data = defaultFeatures,
  badges = defaultBadges,
}) => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center w-20 h-20 bg-green-100/70 dark:bg-green-500/10 rounded-full mx-auto mb-6">
            <Shield
              className="w-10 h-10 text-green-500 dark:text-green-400"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white">
            Security & Compliance
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Bank-grade security with regulatory compliance built into every
            feature
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
          {data.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Lock;
            return (
              <Card
                key={index}
                className="bg-white dark:bg-card/50 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-xl mx-auto mb-5"
                    style={{ backgroundColor: feature.iconBg }}
                  >
                    <IconComponent
                      className="w-7 h-7"
                      style={{ color: feature.iconColor }}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Compliance Badges Section */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-blue-100/50 dark:shadow-black/50">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              Regulatory Compliance
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Certified and compliant with Indian financial regulations
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {badges.map((badge, i) => (
              <div key={i} className="text-center space-y-3">
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center mx-auto transition-transform hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${badge.fromColor}, ${badge.toColor})`,
                  }}
                >
                  <span
                    className="font-bold text-sm"
                    style={{ color: badge.textColor }}
                  >
                    {badge.name}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {badge.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
