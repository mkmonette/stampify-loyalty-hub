import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, Zap, Crown, Building } from "lucide-react";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "Free",
    period: "forever",
    description: "Perfect for small businesses just getting started",
    features: [
      "Up to 100 customers",
      "1 loyalty program",
      "Basic templates",
      "QR code generation",
      "Email support",
      "Basic analytics"
    ],
    cta: "Get Started Free",
    popular: false,
    variant: "outline" as const
  },
  {
    name: "Professional",
    icon: Crown,
    price: "$29",
    period: "per month",
    description: "Ideal for growing businesses with multiple locations",
    features: [
      "Up to 2,500 customers",
      "5 loyalty programs",
      "Custom templates",
      "Advanced QR features",
      "Priority support",
      "Advanced analytics",
      "Referral programs",
      "Custom branding",
      "API access"
    ],
    cta: "Start Free Trial",
    popular: true,
    variant: "default" as const
  },
  {
    name: "Enterprise",
    icon: Building,
    price: "Custom",
    period: "pricing",
    description: "For large businesses with complex needs",
    features: [
      "Unlimited customers",
      "Unlimited programs",
      "White-label solution",
      "Multi-tenant support",
      "Dedicated support",
      "Custom integrations",
      "Advanced reporting",
      "SLA guarantee",
      "Training & onboarding"
    ],
    cta: "Contact Sales",
    popular: false,
    variant: "secondary" as const
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-feature">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-muted text-secondary font-medium mb-4">
            💰 Simple Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Choose Your
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Perfect Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no long-term contracts. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-card border-border hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-primary shadow-glow scale-105' : 'hover:-translate-y-1'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-4 ${
                  plan.popular ? 'bg-gradient-primary' : 'bg-muted'
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground ml-1">
                    {plan.period}
                  </span>
                </div>
                
                <p className="text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <Button 
                  className={`w-full mb-6 ${
                    plan.popular 
                      ? 'bg-gradient-primary text-white border-0 hover:shadow-glow' 
                      : plan.variant === 'secondary'
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : plan.variant}
                  size="lg"
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-4 h-4 text-accent mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Need a custom solution? We're here to help.
          </p>
          <Button variant="outline" size="lg">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
};