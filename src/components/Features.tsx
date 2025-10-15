import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown, Users, Brain, ArrowRightLeft } from "lucide-react";

const Features = () => {
  const [openFeature, setOpenFeature] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(3).fill(false)
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Animate items with staggered delays after heading animation
          setTimeout(() => {
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => {
                  const newVisible = [...prev];
                  newVisible[index] = true;
                  return newVisible;
                });
              }, index * 200); // 200ms delay between each item
            });
          }, 300); // Wait 300ms after heading starts animating
          observer.disconnect();
        }
      },
      { threshold: 0.5 } // Trigger when 50% of the heading is visible
    );

    const headingElement = document.querySelector("#solutions .text-center");
    if (headingElement) observer.observe(headingElement);

    return () => {
      if (headingElement) observer.unobserve(headingElement);
    };
  }, []);

  const features = [
    {
      title: "CRM & Client Management",
      description:
        "Store and manage investor profiles, track conversations, set reminders, segment clients.",
      expandedDescription: [
        "Centralized client profiles with AUM and SIP tracking",
        "Automated follow-ups, alerts, and renewal reminders",
        "Lead management and segmentation based on goals or risk profiles",
        "Integrated communication tools including email and WhatsApp",
      ],
      icon: <Users size={24} className="text-indigo-600" />,
    },
    {
      title: "AI-Driven Analysis & Insights",
      description:
        "Instantly evaluate portfolios, risk scores, investment recommendations, performance trends.",
      expandedDescription: [
        "Real-time analysis leveraging CAMS and KFintech data",
        "Detects portfolio overlap, underperformance, and risk mismatches",
        "Provides data-driven recommendations for rebalancing, SIP adjustments, and fund switches",
        "Conversational AI for instant portfolio insights and queries",
      ],
      icon: <Brain size={24} className="text-indigo-600" />,
    },
    {
      title: "Seamless Transaction Engine",
      description:
        "Place buy, sell, switch orders directly from platform with compliance & security.",
      expandedDescription: [
        "Direct integration with BSE Star MF and NSE NMF II platforms",
        "Supports SIPs, lump-sum investments, redemptions, and fund switches",
        "Real-time tracking of order status and fund updates",
        "Comprehensive compliance logs and client reporting tools",
      ],
      icon: <ArrowRightLeft size={24} className="text-indigo-600" />,
    },
  ];

  const toggleFeature = (index: number) => {
    setOpenFeature(openFeature === index ? null : index);
  };

  return (
    <section
      id="solutions"
      className="w-full py-12 md:py-16 px-6 md:px-12 bg-background"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <div
          className={`text-center space-y-3 max-w-3xl mx-auto transition-all duration-700 transform ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-95"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
            Everything You Need to Scale Your Distribution Business
          </h2>
          <p className="text-muted-foreground text-lg">
            Stop juggling multiple tools. One intelligent platform that handles CRM, analytics, and transactions — designed specifically for mutual fund distributors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Collapsible
              key={index}
              open={openFeature === index}
              onOpenChange={() => toggleFeature(index)}
              className={`rounded-xl border ${
                openFeature === index ? "border-indigo-400/40" : "border-border"
              } bg-card transition-all duration-300 transform ${
                visibleItems[index]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              } transition-all duration-500 ease-out`}
              style={{
                transitionDelay: `${index * 200}ms`,
              }}
            >
              <CollapsibleTrigger className="w-full text-left p-6">
                <div className="flex justify-between items-start">
                  <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
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
              <CollapsibleContent className="px-6 pb-6 pt-0">
                <div className="pt-4 border-t border-border">
                  <ul className="space-y-3">
                    {feature.expandedDescription.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-[6px] h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></span>
                        <span className="text-muted-foreground text-sm">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
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
