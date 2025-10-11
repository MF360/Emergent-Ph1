import React from "react";
import { Card, CardContent } from "./ui/card";
import { Lock, FileCheck, UserCheck, Eye, Shield } from "lucide-react";

// Map icons for dynamic rendering
const iconMap = {
  Lock: Lock,
  FileCheck: FileCheck,
  UserCheck: UserCheck,
  Eye: Eye,
  Shield: Shield,
} as const;

// Feature type
export interface Feature {
  icon: keyof typeof iconMap;
  title: string;
  description: string;
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
  data: Feature[];
  badges?: Badge[];
}

// Default badges
const defaultBadges: Badge[] = [
  { name: "SEBI", description: "SEBI Registered", fromColor: "blue-100", toColor: "purple-100", textColor: "blue-600" },
  { name: "AMFI", description: "AMFI Certified", fromColor: "green-100", toColor: "blue-100", textColor: "green-600" },
  { name: "KYC/AML", description: "KYC/AML Compliant", fromColor: "purple-100", toColor: "pink-100", textColor: "purple-600" },
  { name: "ISO", description: "ISO 27001", fromColor: "orange-100", toColor: "red-100", textColor: "orange-600" },
];

const SecuritySection: React.FC<SecuritySectionProps> = ({ data, badges = defaultBadges }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mx-auto">
            <Shield className="w-10 h-10 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">Security & Compliance</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bank-grade security with regulatory compliance built into every feature
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {data.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Lock;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border border-border bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl mx-auto group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Compliance Badges */}
        <div className="bg-card rounded-2xl p-8 shadow-lg max-w-4xl mx-auto border border-border">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-2">Regulatory Compliance</h3>
            <p className="text-muted-foreground">Certified and compliant with Indian financial regulations</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {badges.map((badge, i) => (
              <div key={i} className="text-center space-y-2">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto bg-gradient-to-br from-primary/10 to-accent/10"
                >
                  <span className="font-bold text-xs text-primary">
                    {badge.name}
                  </span>
                </div>
                <div className="text-sm font-semibold text-muted-foreground">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
