import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown, Layers, Grid3x3, LayoutDashboard } from "lucide-react";

const Features = () => {
  const [openFeature, setOpenFeature] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(3).fill(false));

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Animate items with staggered delays after heading animation
          const headingDelay = setTimeout(() => {
            features.forEach((_, index) => {
              const itemDelay = setTimeout(() => {
                setVisibleItems(prev => {
                  const newVisible = [...prev];
                  newVisible[index] = true;
                  return newVisible;
                });
              }, index * 200); // 200ms delay between each item
              timeouts.push(itemDelay);
            });
          }, 300); // Wait 300ms after heading starts animating
          timeouts.push(headingDelay);
          observer.disconnect();
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the heading is visible
    );

    const headingElement = document.querySelector("#features .text-center");
    if (headingElement) observer.observe(headingElement);

    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
      if (headingElement) observer.unobserve(headingElement);
    };
  }, []);

  const features = [
    {
      title: "CRM & Client Management",
      description:
        "Store and manage investor profiles, track conversations, set reminders, segment clients.",
      expandedDescription:
        "Never lose touch — nurture relationships at scale. Keep all client data in one place, automate follow-ups, and manage every investor with full transparency and organization.",
      icon: <Layers size={24} className="text-primary" />,
    },
    {
      title: "AI-Driven Analysis & Insights",
      description:
        "Instantly evaluate portfolios, risk scores, and get investment recommendations.",
      expandedDescription:
        "Make data-backed decisions with AI-powered analytics. Gain insights into portfolio health, performance trends, and client behavior to deliver timely, personalized advice.",
      icon: <Grid3x3 size={24} className="text-primary" />,
    },
    {
      title: "Seamless Transaction Engine",
      description:
        "Place buy, sell, and switch orders directly with built-in compliance & security.",
      expandedDescription:
        "Save time, reduce errors, and ensure SEBI/AMFI compliance. Execute transactions effortlessly and track full audit trails for every order — all within MF360.",
      icon: <LayoutDashboard size={24} className="text-primary" />,
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
        <div className={`text-center space-y-3 max-w-3xl mx-auto transition-all duration-700 transform ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
        }`}>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
            Complete Distribution Platform
          </h2>
          <p className="text-muted-foreground text-lg">
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
                  ? "border-primary/40"
                  : "border-border"
              } bg-card transition-all duration-300 transform ${
                visibleItems[index]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              } transition-all duration-500 ease-out`}
              style={{
                transitionDelay: `${index * 200}ms`
              }}
            >
              <CollapsibleTrigger className="w-full text-left p-6 flex flex-col">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                      openFeature === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <h3 className="text-xl font-medium tracking-tighter mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6 pt-2">
                <div className="pt-3 border-t border-border">
                  <p className="text-muted-foreground">
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
