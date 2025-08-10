import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Stamp, 
  Gift, 
  Star, 
  Coffee,
  Award,
  Users,
  MapPin,
  Clock
} from "lucide-react";

export const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Stamp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Loyalty Cards</h1>
                <p className="text-muted-foreground">Track your stamps and rewards</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-accent text-accent-foreground">
                <Star className="w-3 h-3 mr-1" />
                Gold Member
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Stamps
              </CardTitle>
              <Stamp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">47</div>
              <p className="text-xs text-muted-foreground">
                Across all programs
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rewards Earned
              </CardTitle>
              <Gift className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent">3</span> available to use
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Savings Total
              </CardTitle>
              <Award className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$247</div>
              <p className="text-xs text-muted-foreground">
                This year
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Programs
              </CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">5</div>
              <p className="text-xs text-muted-foreground">
                Loyalty programs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Loyalty Cards */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-foreground mb-6">Active Loyalty Cards</h2>
            
            <div className="space-y-6">
              {/* Coffee Corner Card */}
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Coffee className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground">Coffee Corner Inc.</CardTitle>
                        <p className="text-sm text-muted-foreground">Buy 10, get 1 free</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-500 text-white">8/10</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress to next reward</span>
                        <span className="font-medium text-foreground">2 stamps needed</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    
                    {/* Stamp Grid */}
                    <div className="grid grid-cols-5 gap-2">
                      {[...Array(10)].map((_, index) => (
                        <div 
                          key={index}
                          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center ${
                            index < 8 
                              ? 'bg-orange-500 border-orange-500' 
                              : 'bg-white border-orange-200 border-dashed'
                          }`}
                        >
                          {index < 8 && <Stamp className="w-4 h-4 text-white" />}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        123 Main St, Downtown
                      </div>
                      <Button size="sm" variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Other Loyalty Cards */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground">Style & Grace Boutique</CardTitle>
                        <p className="text-sm text-muted-foreground">Spend $500, get $50 off</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-500 text-white">$320/$500</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress to reward</span>
                        <span className="font-medium text-foreground">$180 to go</span>
                      </div>
                      <Progress value={64} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        Last visit: 3 days ago
                      </div>
                      <Button size="sm" variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-50">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Available Rewards & Activity */}
          <div className="lg:col-span-1">
            {/* Available Rewards */}
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-accent" />
                  Available Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gradient-feature rounded-lg">
                    <h4 className="font-medium text-foreground">Free Coffee</h4>
                    <p className="text-sm text-muted-foreground">Coffee Corner Inc.</p>
                    <Badge className="mt-2 bg-accent text-accent-foreground text-xs">Expires in 7 days</Badge>
                  </div>
                  <div className="p-3 bg-gradient-feature rounded-lg">
                    <h4 className="font-medium text-foreground">20% Off Next Purchase</h4>
                    <p className="text-sm text-muted-foreground">Zen Wellness Spa</p>
                    <Badge className="mt-2 bg-secondary text-secondary-foreground text-xs">Valid until used</Badge>
                  </div>
                  <div className="p-3 bg-gradient-feature rounded-lg">
                    <h4 className="font-medium text-foreground">Free Dessert</h4>
                    <p className="text-sm text-muted-foreground">Wilson's Fresh Bakes</p>
                    <Badge className="mt-2 bg-warning text-warning-foreground text-xs">Expires tomorrow</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Collected stamp", location: "Coffee Corner", time: "2 hours ago" },
                    { action: "Redeemed reward", location: "Zen Wellness", time: "1 day ago" },
                    { action: "Joined program", location: "Quick Bites", time: "3 days ago" },
                    { action: "Collected 3 stamps", location: "Wilson's Bakes", time: "1 week ago" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.location} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
