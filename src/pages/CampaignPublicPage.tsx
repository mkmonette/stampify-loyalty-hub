import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Campaign, CustomerCampaigns, Rewards, Cards, Businesses, Business } from "@/utils/localDb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stamp, Gift, ArrowRight, CheckCircle2, Mail, Phone, Globe, Facebook, Instagram, Twitter, Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCampaigns } from "@/context/CampaignContext";
import { CampaignRegistrationModal } from "@/components/modals/CampaignRegistrationModal";
import { getBrandingForOwner, BrandingSettings } from "@/utils/templates";
import ThemedCampaignCard from "@/components/campaign/ThemedCampaignCard";
import QRCode from "qrcode";

export default function CampaignPublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { campaigns } = useCampaigns();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const hasJoined = user && campaign ? CustomerCampaigns.hasJoined(user.email, campaign.id) : false;
  const userStamps = user && campaign && hasJoined 
    ? Cards.byUser(user.email).find(c => c.campaignId === campaign.id)?.stamps || 0
    : 0;
  const campaignRewards = campaign ? Rewards.list().filter(r => r.active) : [];

  useEffect(() => {
    console.log('🔍 CampaignPublicPage mounted');
    console.log('🎯 Looking for campaign slug:', slug);
    console.log('📊 Available campaigns:', campaigns);
    console.log('📦 Raw localStorage campaigns:', localStorage.getItem('campaigns'));
    console.log('📦 Raw localStorage businesses:', localStorage.getItem('businesses'));
    
    if (!slug) {
      console.warn('⚠️ No slug provided');
      setLoading(false);
      return;
    }
    
    const found = campaigns.find(c => c.slug === slug);
    console.log('🔎 Found campaign:', found);
    setCampaign(found || null);
    
    if (found) {
      // Load business data from localStorage
      if (found.businessId) {
        const foundBusiness = Businesses.findById(found.businessId);
        setBusiness(foundBusiness || null);
        console.log('🏢 Loaded business from localStorage:', foundBusiness);
      }
      
      // Load branding
      if (found.ownerId) {
        const brandingSettings = getBrandingForOwner(found.ownerId);
        setBranding(brandingSettings);
        console.log('🎨 Loaded branding:', brandingSettings);
      }
    } else {
      console.warn('⚠️ Campaign not found for slug:', slug);
    }
    
    setLoading(false);
  }, [slug, campaigns]);

  // Generate QR code
  useEffect(() => {
    if (campaign) {
      const campaignUrl = `${window.location.origin}/campaigns/${campaign.slug}`;
      QRCode.toDataURL(campaignUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: branding?.colors?.primary || "#000000",
          light: "#FFFFFF"
        }
      }).then(setQrCodeUrl);
    }
  }, [campaign, branding]);

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

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Business Header */}
        {business && (
          <div className="text-center mb-8 pb-8 border-b">
            {business.logo && (
              <img 
                src={business.logo} 
                alt={`${business.name} logo`} 
                className="h-20 w-20 mx-auto mb-4 rounded-full object-cover shadow-lg"
              />
            )}
            <h2 className="text-3xl font-bold mb-2">{business.name}</h2>
            {business.description && (
              <p className="text-muted-foreground">{business.description}</p>
            )}
          </div>
        )}

        {/* Campaign Header */}
        <div className="text-center mb-12">
          {!business && branding?.logoDataUrl && (
            <div className="inline-flex items-center justify-center mb-6">
              <img 
                src={branding.logoDataUrl} 
                alt="Business logo" 
                className="h-24 w-24 rounded-full object-cover shadow-lg"
              />
            </div>
          )}
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {campaign.name}
          </h1>
          
          {campaign.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {campaign.description}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Stamp Card Preview */}
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Stamp className="w-6 h-6 text-primary" />
              Your Loyalty Card
            </h2>
            {branding && (
              <ThemedCampaignCard 
                campaign={campaign}
                branding={branding}
                earnedStamps={userStamps}
                isReadOnly={true}
              />
            )}
          </div>

          {/* QR Code & Info */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Scan to Join
              </CardTitle>
              <CardDescription>
                Use this QR code to join the campaign and start earning stamps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center p-6 bg-muted/30 rounded-xl">
                {qrCodeUrl ? (
                  <>
                    <img 
                      src={qrCodeUrl} 
                      alt="Campaign QR Code" 
                      className="w-48 h-48 rounded-lg shadow-md mb-4"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.download = `${campaign.slug}-qr-code.png`;
                        link.href = qrCodeUrl;
                        link.click();
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>
                  </>
                ) : (
                  <div className="w-48 h-48 bg-background rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-4xl font-mono text-muted-foreground">QR</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Stamps Required</span>
                  <span className="text-xl font-bold text-primary">{campaign.stampsRequired}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    campaign.active 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {campaign.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rewards Section */}
        {campaignRewards.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Available Rewards
              </CardTitle>
              <CardDescription>
                Redeem your stamps for these exclusive rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {campaignRewards.map((reward) => (
                  <div 
                    key={reward.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{reward.name}</h3>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {reward.stampsRequired} stamps
                      </span>
                    </div>
                    {reward.description && (
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact & Social Links */}
        {(campaign.contactEmail || campaign.contactPhone || campaign.socialLinks) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact & Follow Us</CardTitle>
              <CardDescription>Stay connected and reach out anytime</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {campaign.contactEmail && (
                  <a 
                    href={`mailto:${campaign.contactEmail}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{campaign.contactEmail}</span>
                  </a>
                )}
                
                {campaign.contactPhone && (
                  <a 
                    href={`tel:${campaign.contactPhone}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{campaign.contactPhone}</span>
                  </a>
                )}
                
                {campaign.socialLinks?.website && (
                  <a 
                    href={campaign.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">Website</span>
                  </a>
                )}
                
                {campaign.socialLinks?.facebook && (
                  <a 
                    href={campaign.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="text-sm">Facebook</span>
                  </a>
                )}
                
                {campaign.socialLinks?.instagram && (
                  <a 
                    href={campaign.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    <span className="text-sm">Instagram</span>
                  </a>
                )}
                
                {campaign.socialLinks?.twitter && (
                  <a 
                    href={campaign.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="text-sm">Twitter</span>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <div className="text-center space-y-4">
          {hasJoined ? (
            <Card className="border-2 border-green-500/20 bg-green-500/5">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">You're Already In!</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  You've already joined this campaign. Visit your dashboard to view your stamps.
                </p>
                <Link to="/customer">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">Ready to Start Earning?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto group"
                    onClick={() => {
                      CustomerCampaigns.join(user.email, campaign.id);
                      window.location.reload();
                    }}
                  >
                    Join Campaign
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto group"
                    onClick={() => setShowRegistration(true)}
                  >
                    Join Campaign
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Already a Member? Log In
                  </Button>
                </Link>
              </div>
              
              <p className="text-xs text-muted-foreground mt-6">
                By joining, you agree to our terms of service and privacy policy
              </p>
            </>
          )}
        </div>
      </main>

      {campaign && (
        <CampaignRegistrationModal
          open={showRegistration}
          onOpenChange={setShowRegistration}
          campaign={campaign}
        />
      )}
    </div>
  );
}
