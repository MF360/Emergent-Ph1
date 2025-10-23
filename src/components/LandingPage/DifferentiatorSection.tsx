import React from "react";
import { Zap, Layers, Target, Shield, TrendingUp } from "lucide-react";

type DifferentiatorItem = {
  icon: "Zap" | "Layers" | "Target" | "Shield" | "TrendingUp";
  title: string;
  description: string;
};

type DifferentiatorSectionProps = {
  data: DifferentiatorItem[];
};

const iconMap = {
  Zap: Zap,
  Layers: Layers,
  Target: Target,
  Shield: Shield,
  TrendingUp: TrendingUp,
};

const DifferentiatorSection: React.FC<DifferentiatorSectionProps> = ({
  data,
}) => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Why Choose MF360?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built specifically for mutual fund distributors with cutting-edge
            technology and domain expertise
          </p>
        </div>

        {/* Differentiator Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {data.map((item, index) => {
            const IconComponent = iconMap[item.icon];
            return (
              <div
                key={index}
                className="group relative bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-border hover:-translate-y-1"
              >
                {/* Hover Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative space-y-4">
                  <div className="flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-indigo-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Stats */}
        <div className="mt-16 bg-card rounded-2xl p-8 shadow-lg max-w-4xl mx-auto border border-border">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                70%
              </div>
              <div className="text-sm text-muted-foreground">
                Reduce Analysis Time
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                2x
              </div>
              <div className="text-sm text-muted-foreground">
                Client Engagement
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                95%
              </div>
              <div className="text-sm text-muted-foreground">
                User Satisfaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifferentiatorSection;
