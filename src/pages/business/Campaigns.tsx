import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Campaigns, Campaign, CustomerCampaigns, seedIfEmpty, Businesses, Business } from "@/utils/localDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Copy, ExternalLink, Users, Eye, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCampaigns } from "@/context/CampaignContext";
import ThemedCampaignCard from "@/components/campaign/ThemedCampaignCard";
import { getBrandingForOwner } from "@/utils/templates";

export default function CampaignsPage() {
  const { user } = useAuth();
  const { campaigns, refreshCampaigns } = useCampaigns();
  const [business, setBusiness] = useState<Business | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [stampsRequired, setStampsRequired] = useState(10);
  const [active, setActive] = useState(true);
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    console.log('🔍 Campaigns page mounted');
    console.log('📦 Current localStorage campaigns:', localStorage.getItem('campaigns'));
    console.log('📦 Current localStorage businesses:', localStorage.getItem('businesses'));
    
    seedIfEmpty();
    
    // Fix campaigns without ownerId
    const allCampaigns = Campaigns.list();
    const businesses = Businesses.list();
    let fixed = false;
    
    allCampaigns.forEach(campaign => {
      if (!campaign.ownerId) {
        // Try to get ownerId from linked business
        const linkedBusiness = businesses.find(b => b.id === campaign.businessId);
        const newOwnerId = linkedBusiness?.ownerId || user?.id || 'demo-business-admin';
        
        console.log(`🔧 Fixing campaign ${campaign.name} - setting ownerId to ${newOwnerId}`);
        Campaigns.update(campaign.id, { ownerId: newOwnerId });
        fixed = true;
      }
    });
    
    if (fixed) {
      console.log('✅ Fixed campaigns with missing ownerId');
    }
    
    refreshCampaigns();
    
    console.log('📊 After seed - Campaigns from context:', campaigns);
    console.log('📊 After seed - localStorage campaigns:', localStorage.getItem('campaigns'));
    
    // Load or create business for current user
    if (user) {
      console.log('👤 Current user:', user);
      const businesses = Businesses.list().filter(b => b.ownerId === user.id);
      console.log('🏢 Businesses for user:', businesses);
      
      if (businesses.length > 0) {
        setBusiness(businesses[0]);
        console.log('✅ Using existing business:', businesses[0]);
      } else {
        // Create default business for this user
        const newBusiness = Businesses.add({
          name: `${user.email}'s Business`,
          description: 'Your loyalty program business',
          logo: '/placeholder.svg',
          template: 'modern',
          colors: {
            primary: '#8B4513',
            background: '#FFF8F0'
          },
          ownerId: user.id
        });
        setBusiness(newBusiness);
        console.log('✅ Created new business:', newBusiness);
      }
    }
  }, [user]);

  const add = () => {
    if (!name.trim()) return;
    
    if (editingCampaign) {
      // Update existing campaign - preserve ownerId
      Campaigns.update(editingCampaign.id, {
        name,
        description: desc,
        stampsRequired,
        active,
        businessId: business?.id,
        ownerId: editingCampaign.ownerId || user?.id
      });
      toast.success("Campaign updated successfully!");
      setEditingCampaign(null);
    } else {
      // Create new campaign
      console.log('➕ Adding new campaign:', { name, desc, stampsRequired, active, businessId: business?.id, ownerId: user?.id });
      
      const newCampaign = Campaigns.add({ 
        businessId: business?.id,
        name, 
        description: desc, 
        stampsRequired, 
        active,
        ownerId: user?.id
      });
      
      console.log('✅ Campaign added:', newCampaign);
      console.log('📦 LocalStorage after add:', localStorage.getItem('campaigns'));
      toast.success("Campaign created and saved to localStorage!");
    }
    
    refreshCampaigns();
    setName("");
    setDesc("");
    setStampsRequired(10);
    setActive(true);
  };

  const startEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setName(campaign.name);
    setDesc(campaign.description || "");
    setStampsRequired(campaign.stampsRequired);
    setActive(campaign.active);
  };

  const cancelEdit = () => {
    setEditingCampaign(null);
    setName("");
    setDesc("");
    setStampsRequired(10);
    setActive(true);
  };

  const toggleActive = (id: string, value: boolean) => {
    Campaigns.update(id, { active: value });
    refreshCampaigns();
  };

  const title = useMemo(() => `Campaigns | Stampify`, []);

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/campaigns/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Campaign link copied to clipboard!");
  };

  const openPreview = (campaign: Campaign) => {
    setPreviewCampaign(campaign);
  };

  const openInNewTab = (slug: string) => {
    window.open(`/campaigns/${slug}`, '_blank');
  };

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Manage loyalty campaigns: create, activate, and configure stamp goals." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="grid gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Existing Campaigns</CardTitle>
            <CardDescription>Enable/disable or review campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <Table>
                <TableCaption>Campaigns and progress</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead className="text-right">Manage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">/campaigns/{c.slug}</code>
                      </TableCell>
                      <TableCell>{c.stampsRequired} stamps</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{CustomerCampaigns.countByCampaign(c.id)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={c.active} onCheckedChange={(v) => toggleActive(c.id, v)} />
                          <Badge variant={c.active ? "default" : "secondary"}>
                            {c.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openPreview(c)}
                                title="Live Preview"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Live Preview</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openInNewTab(c.slug)}
                                title="Open in new tab"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open in new tab</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => copyLink(c.slug)}
                                title="Copy link"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy public campaign link</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => startEdit(c)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => { Campaigns.remove(c.id); refreshCampaigns(); }}>Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{editingCampaign ? "Edit Campaign" : "Create Campaign"}</CardTitle>
            <CardDescription>{editingCampaign ? "Update your loyalty campaign" : "Define a new loyalty campaign"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <div className="flex items-center gap-2">
              <Input type="number" min={1} value={stampsRequired} onChange={(e) => setStampsRequired(parseInt(e.target.value || '1'))} />
              <span className="text-sm text-muted-foreground">Stamps Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={active} onCheckedChange={setActive} />
              <span className="text-sm">Active</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={add} className="flex-1">{editingCampaign ? "Update Campaign" : "Add Campaign"}</Button>
              {editingCampaign && (
                <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Preview Modal */}
      <Dialog open={!!previewCampaign} onOpenChange={(open) => !open && setPreviewCampaign(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Campaign Preview</DialogTitle>
            <DialogDescription>
              This is how customers will see your campaign page at{" "}
              <code className="text-xs bg-muted px-2 py-1 rounded">
                /campaigns/{previewCampaign?.slug}
              </code>
            </DialogDescription>
          </DialogHeader>
          
          {previewCampaign && business && (
            <div className="mt-4 border rounded-lg p-6 bg-muted/50">
              <ThemedCampaignCard
                campaign={previewCampaign}
                branding={getBrandingForOwner(previewCampaign.ownerId || business.ownerId)}
                earnedStamps={0}
                isReadOnly={true}
              />
              
              <div className="mt-6 flex items-center justify-between p-4 bg-background rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Public Campaign Link</p>
                  <code className="text-xs text-muted-foreground">
                    {window.location.origin}/campaigns/{previewCampaign.slug}
                  </code>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyLink(previewCampaign.slug)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => openInNewTab(previewCampaign.slug)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
