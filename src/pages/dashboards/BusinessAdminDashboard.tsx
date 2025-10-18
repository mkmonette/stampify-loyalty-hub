import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Users, 
  Gift, 
  QrCode,
  Plus,
  Eye,
  TrendingUp,
  Stamp,
  Settings
} from "lucide-react";
import { useCampaigns } from "@/context/CampaignContext";
import { useAuth } from "@/context/AuthContext";
import { CustomerCampaigns, Cards } from "@/utils/localDb";

export const BusinessAdminDashboard = () => {
  const { campaigns } = useCampaigns();
  const { user } = useAuth();
  
  // Calculate real stats from campaigns
  const userCampaigns = campaigns.filter(c => c.ownerId === user?.id);
  const totalCustomers = userCampaigns.reduce((sum, c) => sum + CustomerCampaigns.countByCampaign(c.id), 0);
  const totalStamps = Cards.list().reduce((sum, card) => sum + card.stamps, 0);
  const activeCampaignsCount = userCampaigns.filter(c => c.active).length;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Business Dashboard</h1>
                <p className="text-muted-foreground">Manage your loyalty programs and customers</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-primary text-primary">
                Coffee Corner Inc.
              </Badge>
              <Badge className="bg-accent text-accent-foreground">Pro Plan</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Across {activeCampaignsCount} active campaign{activeCampaignsCount !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Stamps Collected
              </CardTitle>
              <Stamp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalStamps}</div>
              <p className="text-xs text-muted-foreground">
                Total stamps collected
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rewards Redeemed
              </CardTitle>
              <Gift className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">342</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent">+12%</span> conversion rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Program Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$12,450</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent">+27%</span> customer lifetime value
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start bg-gradient-primary text-white border-0">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Program
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Program Settings
                </Button>
              </CardContent>
            </Card>

            {/* Active Programs */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Active Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userCampaigns.length > 0 ? (
                    userCampaigns.slice(0, 3).map((campaign) => (
                      <div key={campaign.id} className="p-3 bg-gradient-feature rounded-lg">
                        <h4 className="font-medium text-foreground">{campaign.name}</h4>
                        <p className="text-sm text-muted-foreground">{campaign.description || `Collect ${campaign.stampsRequired} stamps`}</p>
                        <Badge className="mt-2 bg-accent text-accent-foreground text-xs">
                          {CustomerCampaigns.countByCampaign(campaign.id)} members
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No active campaigns yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Customer Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { customer: "Sarah M.", action: "Collected 5th stamp", program: "Coffee Loyalty", time: "2 minutes ago", type: "stamp" },
                    { customer: "Mike R.", action: "Redeemed free coffee", program: "Coffee Loyalty", time: "15 minutes ago", type: "reward" },
                    { customer: "Emma L.", action: "Joined VIP Program", program: "VIP Program", time: "1 hour ago", type: "join" },
                    { customer: "David K.", action: "Collected 3 stamps", program: "Coffee Loyalty", time: "2 hours ago", type: "stamp" },
                    { customer: "Lisa P.", action: "Referred a friend", program: "Coffee Loyalty", time: "3 hours ago", type: "referral" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          activity.type === 'stamp' ? 'bg-primary' :
                          activity.type === 'reward' ? 'bg-accent' :
                          activity.type === 'join' ? 'bg-secondary' :
                          'bg-warning'
                        }`}>
                          {activity.type === 'stamp' && <Stamp className="w-4 h-4 text-white" />}
                          {activity.type === 'reward' && <Gift className="w-4 h-4 text-white" />}
                          {activity.type === 'join' && <Users className="w-4 h-4 text-white" />}
                          {activity.type === 'referral' && <TrendingUp className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{activity.customer}</p>
                          <p className="text-sm text-muted-foreground">{activity.action} • {activity.program}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
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