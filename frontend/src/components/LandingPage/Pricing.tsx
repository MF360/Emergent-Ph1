import { Check, Star } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Custom",
      description:
        "Perfect for individual MFDs starting their distribution business",
      features: [
        "Up to 50 clients",
        "Basic CRM & portfolio tracking",
        "Standard analytics dashboard",
        "Transaction management",
        "Email support",
      ],
      buttonText: "Contact Sales Team",
      popular: false,
    },
    {
      name: "Professional",
      price: "Custom",
      description: "Ideal for growing MFDs managing multiple client portfolios",
      features: [
        "Up to 500 clients",
        "AI-powered recommendations",
        "Advanced analytics & insights",
        "Automated notifications",
        "Lead capture & management",
        "Priority support",
        "Custom reports",
      ],
      buttonText: "Contact Sales Team",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description:
        "For large distribution firms with extensive client networks",
      features: [
        "Unlimited clients",
        "White-label platform",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced compliance tools",
        "Multi-user access",
        "24/7 premium support",
      ],
      buttonText: "Contact Sales Team",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Flexible pricing to scale with your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group transition-all duration-500 border-0 flex flex-col rounded-2xl ${
                plan.popular
                  ? "bg-gradient-to-b from-blue-50 to-white shadow-xl scale-105 hover:scale-110"
                  : "bg-card shadow-lg hover:shadow-xl hover:-translate-y-2"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="p-8 space-y-6 flex flex-col flex-grow">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground">{plan.description}</p>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Custom pricing
                    </div>
                  </div>
                </div>

                <div className="flex-grow space-y-4 pt-6 border-t border-border">
                  <div className="text-sm font-semibold text-foreground">
                    What's included:
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start space-x-3 text-left"
                      >
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className={`w-full py-3 text-lg rounded-xl transition-all duration-300 mt-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            All plans include 24/7 support and regular updates
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ Free setup & migration</span>
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
