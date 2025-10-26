import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { ArrowRight, Mail, Phone, Building } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  firmName: string;
  phone: string;
  clientCount: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    firmName: "",
    phone: "",
    clientCount: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Thank you for your interest! We will contact you soon.");
    setFormData({
      name: "",
      email: "",
      firmName: "",
      phone: "",
      clientCount: "",
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/30 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Ready to Transform Your Distribution Business?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join leading mutual fund distributors who have streamlined their
            operations with MF360
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Form */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Schedule a Demo
                  </h3>
                  <p className="text-gray-600">
                    See how MF360 can transform your business
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      required
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@company.com"
                      required
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firm Name
                    </label>
                    <Input
                      type="text"
                      name="firmName"
                      value={formData.firmName}
                      onChange={handleInputChange}
                      placeholder="Your firm name"
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91-XXXXX-XXXXX"
                      className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Clients You Manage
                  </label>
                  <select
                    name="clientCount"
                    value={formData.clientCount}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select range</option>
                    <option value="1-50">1-50 clients</option>
                    <option value="51-200">51-200 clients</option>
                    <option value="201-500">201-500 clients</option>
                    <option value="500+">500+ clients</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  Schedule Demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. No spam, unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="space-y-6 text-white">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">What you'll get:</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    title: "Early Access Invitation",
                    description:
                      "Be the first to try MF360 before public launch",
                    bg: "bg-green-500",
                  },
                  {
                    icon: Phone,
                    title: "Personal Demo Session",
                    description:
                      "One-on-one walkthrough tailored to your needs",
                    bg: "bg-blue-500",
                  },
                  {
                    icon: Building,
                    title: "Special Launch Pricing",
                    description: "Exclusive discounts for early adopters",
                    bg: "bg-purple-500",
                  },
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 ${benefit.bg} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <benefit.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">{benefit.title}</div>
                      <div className="text-blue-100 text-sm">
                        {benefit.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Already on the waitlist</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
