import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Clock,
  Users,
  TrendingDown,
  CheckCircle,
} from "lucide-react";

const ProblemStatement = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(5).fill(false));

  const problems = [
    {
      text: "Tired of juggling multiple tools — CRMs, transaction portals, Excel sheets, and endless PDFs?",
      icon: <AlertTriangle size={20} className="text-destructive" />,
    },
    {
      text: "Is your advisory business turning into hours of manual portfolio analysis and report preparation?",
      icon: <Clock size={20} className="text-destructive" />,
    },
    {
      text: "Struggling to personalize recommendations as your client base grows?",
      icon: <Users size={20} className="text-destructive" />,
    },
    {
      text: "Are portfolios going unrebalanced and opportunities slipping away simply because it's too complex to track everything?",
      icon: <TrendingDown size={20} className="text-destructive" />,
    },
    {
      text: "It's time for one intelligent platform that helps you analyze, transact, and engage — effortlessly.",
      icon: <CheckCircle size={20} className="text-primary" />,
    },
  ];

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Animate items with staggered delays
          problems.forEach((_, index) => {
            const timeoutId = setTimeout(() => {
              setVisibleItems(prev => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }, index * 300); // 300ms delay between each item
            timeouts.push(timeoutId);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById("problem-statement");
    if (section) observer.observe(section);

    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section id="problem-statement" className="w-full py-12 md:py-16 px-6 md:px-12 bg-background">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className={`text-center space-y-3 max-w-3xl mx-auto transition-all duration-700 transform ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
          }`}>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
            Everything for smarter distribution
          </h2>
        </div>

        <div className="space-y-6">
          {problems.map((problem, index) => {
            const isEven = index % 2 === 0;
            const isLast = index === 4;

            if (isLast) {
              // Center the final solution statement
              return (
                <div
                  key={index}
                  className={`flex justify-center transition-all duration-500 transform ${visibleItems[index]
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                    }`}
                  style={{
                    transitionDelay: `${index * 300}ms`
                  }}
                >
                  <div className="flex items-start gap-4 p-6 rounded-xl border border-primary/20 bg-primary/5 max-w-2xl">
                    <div className="flex-shrink-0 mt-1 text-primary">
                      {problem.icon}
                    </div>
                    <p className="text-lg leading-relaxed text-primary font-medium">
                      {problem.text}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`flex transition-all duration-500 transform ${isEven ? "justify-start" : "justify-end"
                  } ${visibleItems[index]
                    ? "opacity-100 translate-x-0"
                    : isEven
                      ? "opacity-0 -translate-x-8"
                      : "opacity-0 translate-x-8"
                  }`}
                style={{
                  transitionDelay: `${index * 300}ms`
                }}
              >
                <div className="flex items-start gap-4 p-6 rounded-xl border border-border bg-card max-w-lg">
                  <div className="flex-shrink-0 mt-1 text-destructive">
                    {problem.icon}
                  </div>
                  <p className="text-lg leading-relaxed text-foreground">
                    {problem.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;
