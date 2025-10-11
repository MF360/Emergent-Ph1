import React from "react";
import { UserPlus, Database, Lightbulb, MousePointer } from "lucide-react";

// Type for each workflow step
export type WorkflowStep = {
  step: number;
  icon: "UserPlus" | "Database" | "Lightbulb" | "MousePointer";
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
};

const WorkflowSection: React.FC<WorkflowSectionProps> = ({ data }) => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes with our simple 4-step process
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:block relative">
            {/* Connection Line */}
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-green-400/20"></div>

            <div className="grid grid-cols-4 gap-8">
              {data.map((step, index) => {
                const IconComponent = iconMap[step.icon];
                const isEven = index % 2 === 0;

                return (
                  <div key={step.step} className="relative">
                    {/* Step Indicator */}
                    <div
                      className={`flex flex-col items-center ${
                        isEven ? "mb-8" : "mt-8"
                      }`}
                    >
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300 relative z-10">
                          <IconComponent className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div className={`absolute -top-4 -right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg z-20 ${
                          !isEven
                            ? 'bg-primary text-primary-foreground border-2 border-primary'
                            : 'bg-accent text-accent-foreground border-2 border-accent'
                        }`}>
                          {step.step}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div
                      className={`text-center space-y-3 ${
                        isEven ? "" : "mt-16"
                      }`}
                    >
                      <h3 className="text-lg font-bold text-foreground">
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

          {/* Mobile Layout */}
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
                    <h3 className="text-lg font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
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
