import { Card, CardContent } from "@/components/ui/card";
import { 
  Stamp, 
  Gift, 
  Users, 
  QrCode, 
  Palette, 
  BarChart3,
  Smartphone,
  Shield,
  Zap
} from "lucide-react";

const features = [
  {
    icon: Stamp,
    title: "Digital Loyalty Stamps",
    description: "Replace traditional paper cards with beautiful digital stamp collections that customers love."
  },
  {
    icon: Gift,
    title: "Flexible Rewards",
    description: "Create custom rewards, discounts, and incentives that drive repeat business and engagement."
  },
  {
    icon: Users,
    title: "Smart Referrals",
    description: "Turn customers into brand ambassadors with automated referral programs and bonus rewards."
  },
  {
    icon: QrCode,
    title: "QR Code Integration",
    description: "Seamless stamp collection with QR codes - no apps required for customers to participate."
  },
  {
    icon: Palette,
    title: "Custom Templates",
    description: "Choose from beautiful pre-designed templates or create your own branded loyalty cards."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track customer behavior, reward redemption, and ROI with detailed analytics and insights."
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Perfect experience across all devices with responsive design and mobile-first approach."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee and data protection compliance."
  },
  {
    icon: Zap,
    title: "Instant Setup",
    description: "Launch your loyalty program in minutes with our intuitive setup wizard and guided onboarding."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-gradient-feature">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-muted text-primary font-medium mb-4">
            ✨ Powerful Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need for
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Customer Loyalty</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build lasting relationships with your customers using our comprehensive suite of loyalty tools and features.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};