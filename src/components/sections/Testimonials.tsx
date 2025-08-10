import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Coffee Shop Owner",
    business: "Brew & Beans Café",
    avatar: "👩‍💼",
    rating: 5,
    comment: "Stampify transformed our customer retention! We've seen a 40% increase in repeat customers since launching our digital loyalty program."
  },
  {
    name: "Mike Chen",
    role: "Restaurant Manager",
    business: "Chen's Kitchen",
    avatar: "👨‍🍳",
    rating: 5,
    comment: "The QR code system is brilliant - customers love how easy it is to collect stamps. Our average order value increased by 25%."
  },
  {
    name: "Emily Rodriguez",
    role: "Boutique Owner",
    business: "Style & Grace",
    avatar: "👩‍💻",
    rating: 5,
    comment: "Beautiful templates and easy customization. Our loyalty program now perfectly matches our brand, and customer engagement is through the roof!"
  },
  {
    name: "David Thompson",
    role: "Franchise Director",
    business: "Quick Bites Chain",
    avatar: "👨‍💼",
    rating: 5,
    comment: "Managing loyalty across 15 locations was a nightmare before Stampify. Now everything is centralized and automated. Game changer!"
  },
  {
    name: "Lisa Park",
    role: "Spa Owner",
    business: "Zen Wellness Spa",
    avatar: "🧘‍♀️",
    rating: 5,
    comment: "The analytics help us understand our customers better. We've optimized our reward structure and seen 60% more program participation."
  },
  {
    name: "James Wilson",
    role: "Bakery Owner",
    business: "Wilson's Fresh Bakes",
    avatar: "👨‍🍳",
    rating: 5,
    comment: "Setup took less than 30 minutes. Our customers immediately embraced the digital stamps, and we're seeing amazing results already."
  }
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent-muted text-accent font-medium mb-4">
            💬 Customer Stories
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Loved by
            <span className="bg-gradient-primary bg-clip-text text-transparent"> 10,000+ Businesses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how businesses like yours are transforming customer loyalty and driving growth with Stampify.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.comment}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-primary font-medium">
                      {testimonial.business}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};