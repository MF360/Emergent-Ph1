import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown, Layers, Grid3x3, LayoutDashboard } from "lucide-react";

const Features = () => {
  const [openFeature, setOpenFeature] = useState<number | null>(null);

  const features = [
    {
      title: "CRM & Client Management",
      description:
        "Store and manage investor profiles, track conversations, set reminders, segment clients.",
      expandedDescription:
        "Never lose touch — nurture relationships at scale. Keep all client data in one place, automate follow-ups, and manage every investor with full transparency and organization.",
      icon: <Layers size={24} className="text-cosmic-accent" />,
    },
    {
      title: "AI-Driven Analysis & Insights",
      description:
        "Instantly evaluate portfolios, risk scores, and get investment recommendations.",
      expandedDescription:
        "Make data-backed decisions with AI-powered analytics. Gain insights into portfolio health, performance trends, and client behavior to deliver timely, personalized advice.",
      icon: <Grid3x3 size={24} className="text-cosmic-accent" />,
    },
    {
      title: "Seamless Transaction Engine",
      description:
        "Place buy, sell, and switch orders directly with built-in compliance & security.",
      expandedDescription:
        "Save time, reduce errors, and ensure SEBI/AMFI compliance. Execute transactions effortlessly and track full audit trails for every order — all within MF360.",
      icon: <LayoutDashboard size={24} className="text-cosmic-accent" />,
    },
  ];

  const toggleFeature = (index: number) => {
    setOpenFeature(openFeature === index ? null : index);
  };

  return (
    <section
      id="features"
      className="w-full py-12 md:py-16 px-6 md:px-12 bg-background"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter">
            Complete Distribution Platform
          </h2>
          <p className="text-cosmic-muted text-lg">
            Integrated CRM, analytics, and transaction management designed for
            mutual fund distributors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Collapsible
              key={index}
              open={openFeature === index}
              onOpenChange={() => toggleFeature(index)}
              className={`rounded-xl border ${
                openFeature === index
                  ? "border-cosmic-light/40"
                  : "border-cosmic-light/20"
              } cosmic-gradient transition-all duration-300`}
            >
              <CollapsibleTrigger className="w-full text-left p-6 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-full bg-cosmic-light/10 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-cosmic-muted transition-transform duration-200 ${
                      openFeature === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <h3 className="text-xl font-medium tracking-tighter mb-3">
                  {feature.title}
                </h3>
                <p className="text-cosmic-muted">{feature.description}</p>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 pt-2">
                <div className="pt-3 border-t border-cosmic-light/10">
                  <p className="text-cosmic-muted">
                    {feature.expandedDescription}
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
