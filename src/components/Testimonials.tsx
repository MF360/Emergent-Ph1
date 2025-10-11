const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "MF360 transformed how I manage my 200+ clients. The AI insights help me give better recommendations, and my AUM has grown 35% in just six months.",
      author: "Rajesh Kumar",
      position: "Senior Mutual Fund Distributor, Mumbai",
      avatar: "bg-cosmic-light/30",
    },
    {
      quote:
        "The CRM and automated reminders mean I never miss a client follow-up. Portfolio analytics are instant, and my clients love the personalized reports.",
      author: "Priya Sharma",
      position: "Independent Financial Advisor",
      avatar: "bg-cosmic-light/20",
    },
    {
      quote:
        "Transaction processing is fast, compliant, and effortless. The dashboard gives me real-time insights into revenue and client performance — exactly what MFDs need.",
      author: "Amit Patel",
      position: "Wealth Manager, Bangalore",
      avatar: "bg-cosmic-light/40",
    },
  ];

  return (
    <section className="w-full py-20 px-6 md:px-12 bg-card relative overflow-hidden">
      {/* Subtle background grid for depth */}
      <div className="absolute inset-0 cosmic-grid opacity-20"></div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
            Trusted by Mutual Fund Distributors
          </h2>
          <p className="text-muted-foreground text-lg">
            Real stories from distributors who simplified their operations and
            grew with MF360.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-border bg-background/80 backdrop-blur-sm hover:border-border/60 transition-all duration-300"
            >
              <div className="mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-primary inline-block mr-1">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-lg mb-8 text-foreground/90 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div
                  className={`h-12 w-12 rounded-full ${testimonial.avatar} bg-muted`}
                ></div>
                <div>
                  <h4 className="font-medium text-foreground">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
