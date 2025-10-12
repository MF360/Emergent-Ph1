import React from "react";
import {
  UserPlus,
  Database,
  Lightbulb,
  MousePointer,
  TrendingUp,
} from "lucide-react";

// Type for each workflow step
export type WorkflowStep = {
  step: number;
  icon: "UserPlus" | "Database" | "Lightbulb" | "MousePointer" | "TrendingUp";
  title: string;
  description: string;
};

type WorkflowSectionProps = {
  data: WorkflowStep[];
};

// Map of icons
const iconMap = {
  UserPlus: UserPlus,
  Database: Database,
  Lightbulb: Lightbulb,
  MousePointer: MousePointer,
  TrendingUp: TrendingUp,
};

const WorkflowSection: React.FC<WorkflowSectionProps> = ({ data }) => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center space-y-6 mb-24">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our seamless, AI-powered workflow.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Desktop Layout - Vertical Timeline */}
          <div className="hidden lg:block relative">
            {/* Central Vertical Line */}
            <div
              className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-0.5 bg-border"
              aria-hidden="true"
            ></div>

            <div className="space-y-20">
              {data.map((step, index) => {
                const IconComponent = iconMap[step.icon];
                const isLeft = index % 2 !== 0; // Odd items on the left

                return (
                  <div key={step.step} className="relative">
                    {/* Content Card Box */}
                    <div
                      className={`w-[calc(50%-4rem)] ${
                        isLeft ? "mr-auto" : "ml-auto"
                      }`}
                    >
                      <div
                        className={`relative bg-card p-6 rounded-xl shadow-md border border-border ${
                          isLeft ? "text-right" : "text-left"
                        }`}
                      >
                        {/* Triangle Pointer */}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-card rotate-45 ${
                            isLeft ? "right-[-8px]" : "left-[-8px]"
                          }`}
                        />
                        {/* UPDATED FONT SIZES */}
                        <h3 className="text-xl font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Horizontal Connecting Line from Center */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-0.5 w-16 bg-border ${
                        isLeft ? "right-1/2" : "left-1/2"
                      }`}
                    ></div>

                    {/* Icon and Step Number on the Timeline */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-card border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold text-primary shadow-lg z-20">
                          {step.step}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Layout (Unchanged) */}
          <div className="lg:hidden space-y-8">
            {data.map((step, index) => {
              const IconComponent = iconMap[step.icon];

              return (
                <div key={step.step} className="flex items-start space-x-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                      <IconComponent className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-card border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold text-primary shadow-lg z-20">
                      {step.step}
                    </div>
                    {index < data.length - 1 && (
                      <div className="absolute top-20 left-1/2 w-0.5 h-12 bg-gradient-to-b from-primary/20 to-accent/20 transform -translate-x-1/2"></div>
                    )}
                  </div>

                  <div className="space-y-2 pt-2">
                    {/* UPDATED FONT SIZES */}
                    <h3 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
