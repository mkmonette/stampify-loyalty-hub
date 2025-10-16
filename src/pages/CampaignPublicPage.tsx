import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Campaigns, Campaign } from "@/utils/localDb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stamp, Gift, ArrowRight } from "lucide-react";

export default function CampaignPublicPage() {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessSlug) {
      setLoading(false);
      return;
    }
    
    const found = Campaigns.findBySlug(businessSlug);
    setCampaign(found || null);
    setLoading(false);
  }, [businessSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading campaign...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <Helmet>
          <title>Campaign Not Found | Stampify</title>
          <meta name="description" content="The campaign you're looking for could not be found." />
        </Helmet>
        
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Campaign Not Found</CardTitle>
            <CardDescription>
              The campaign page you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Helmet>
        <title>{campaign.name} | Stampify</title>
        <meta name="description" content={campaign.description || `Join ${campaign.name} loyalty campaign and start collecting stamps for rewards!`} />
        <link rel="canonical" href={`${window.location.origin}/campaigns/${campaign.slug}`} />
      </Helmet>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Stamp className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {campaign.name}
          </h1>
          
          {campaign.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {campaign.description}
            </p>
          )}
        </div>

        {/* Campaign Info Card */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Campaign Details
            </CardTitle>
            <CardDescription>
              Start collecting stamps to earn exclusive rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Stamps Required</span>
              <span className="text-2xl font-bold text-primary">{campaign.stampsRequired}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Campaign Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                campaign.active 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {campaign.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* QR Code Placeholder */}
            <div className="mt-6 p-8 bg-muted/30 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-border">
              <div className="w-48 h-48 bg-background rounded-lg flex items-center justify-center mb-4 shadow-sm">
                <span className="text-4xl font-mono text-muted-foreground">QR</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Scan this QR code at participating locations to collect stamps
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Ready to Start Earning?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto group">
                Join Campaign
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Already a Member? Log In
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            By joining, you agree to our terms of service and privacy policy
          </p>
        </div>
      </main>
    </div>
  );
}
