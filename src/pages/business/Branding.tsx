import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { getBrandingForOwner, setBrandingForOwner, BrandingSettings } from "@/utils/templates";
import { Campaigns } from "@/utils/localDb";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import TemplateLivePreview from "@/components/branding/TemplateLivePreview";
import PalettePicker from "@/components/branding/PalettePicker";
import ImageUploader from "@/components/branding/ImageUploader";
import { PaletteName, getPalette } from "@/utils/palettes";
import { Palette, Grid, Layout, Volume2, Sparkles, Settings } from "lucide-react";

export default function BrandingPage() {
  const { user } = useAuth();
  const ownerId = user?.id ?? "anon";
  const [saved, setSaved] = useState<BrandingSettings>({ id: ownerId, ownerUserId: ownerId, templateId: "grid", updatedAt: new Date().toISOString() });
  const [preview, setPreview] = useState<BrandingSettings>({ id: ownerId, ownerUserId: ownerId, templateId: "grid", updatedAt: new Date().toISOString() });
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const current = getBrandingForOwner(ownerId);
    setSaved(current);
    setPreview(current);
    setCampaigns(Campaigns.list().map(c => ({ id: c.id, name: c.name })));
  }, [ownerId]);

  const onSave = () => {
    const next = setBrandingForOwner(ownerId, preview);
    setSaved(next);
    setPreview(next);
    toast("Stamp card customized successfully!", { description: "Your changes have been saved." });
  };

  const title = useMemo(() => `Stamp Card Designer | Stampify`, []);
  const effectiveColors = () => preview.colors ?? getPalette(preview.paletteName as PaletteName) ?? undefined;
  const hasChanges = JSON.stringify(preview) !== JSON.stringify(saved);

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Design your custom stamp card with modern tools - customize layout, colors, animations, and link to campaigns." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Stamp Card Designer</h1>
          <p className="text-muted-foreground">Create a beautiful, customized stamp card for your loyalty program</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Live Preview Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Live Preview</h2>
            </div>
            
            <div className="flex justify-center">
              <TemplateLivePreview 
                id="grid"
                colors={effectiveColors()} 
                logoDataUrl={preview.logoDataUrl} 
                backgroundDataUrl={preview.backgroundDataUrl} 
                animationStyle={preview.animationStyle as any} 
                layout={preview.layout as any} 
                templateStyle={preview.templateStyle as any}
                gridSize={preview.gridSize}
                stampShape={preview.stampShape}
                cornerRadius={preview.cornerRadius}
              />
            </div>

            {hasChanges && (
              <div className="flex gap-3 justify-center">
                <Button onClick={onSave} size="lg" className="px-8">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setPreview(saved)}>
                  Reset
                </Button>
              </div>
            )}
          </section>

          {/* Customization Panel */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Customization</h2>
            </div>

            <div className="space-y-6">
              {/* Grid Layout */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid className="h-4 w-4" />
                    Grid Layout
                  </CardTitle>
                  <CardDescription>Configure your stamp grid dimensions and style</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Orientation</Label>
                      <Select value={preview.layout ?? "horizontal"} onValueChange={(value) => setPreview(p => ({ ...p, layout: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="horizontal">Horizontal</SelectItem>
                          <SelectItem value="vertical">Vertical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Template Style</Label>
                      <Select value={preview.templateStyle ?? "modern"} onValueChange={(value) => setPreview(p => ({ ...p, templateStyle: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="modern">Modern</SelectItem>
                          <SelectItem value="classic">Classic</SelectItem>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Rows</Label>
                      <Select value={preview.gridSize?.rows?.toString() ?? "2"} onValueChange={(value) => setPreview(p => ({ ...p, gridSize: { ...p.gridSize, rows: parseInt(value), cols: p.gridSize?.cols ?? 5 } }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Columns</Label>
                      <Select value={preview.gridSize?.cols?.toString() ?? "5"} onValueChange={(value) => setPreview(p => ({ ...p, gridSize: { rows: p.gridSize?.rows ?? 2, cols: parseInt(value) } }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Stamp Shape</Label>
                      <Select value={preview.stampShape ?? "rounded-square"} onValueChange={(value) => setPreview(p => ({ ...p, stampShape: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="rounded-square">Rounded</SelectItem>
                          <SelectItem value="circle">Circle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Corner Radius</Label>
                    <Select value={preview.cornerRadius ?? "medium"} onValueChange={(value) => setPreview(p => ({ ...p, cornerRadius: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Colors & Branding
                  </CardTitle>
                  <CardDescription>Choose colors and upload your brand assets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PalettePicker
                    paletteName={preview.paletteName as any}
                    colors={preview.colors as any}
                    onPaletteChange={(name) => setPreview(p => ({ ...p, paletteName: name }))}
                    onColorsChange={(colors) => setPreview(p => ({ ...p, colors }))}
                  />
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ImageUploader label="Logo" value={preview.logoDataUrl} onChange={(v) => setPreview(p => ({ ...p, logoDataUrl: v }))} />
                    <ImageUploader label="Background" value={preview.backgroundDataUrl} onChange={(v) => setPreview(p => ({ ...p, backgroundDataUrl: v }))} />
                  </div>
                </CardContent>
              </Card>

              {/* Effects & Sounds */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Effects & Interactions
                  </CardTitle>
                  <CardDescription>Add animations and sounds to enhance user experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Animation Style</Label>
                      <Select value={preview.animationStyle ?? "fade"} onValueChange={(value) => setPreview(p => ({ ...p, animationStyle: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subtle-bounce">Subtle Bounce</SelectItem>
                          <SelectItem value="fade">Fade In/Out</SelectItem>
                          <SelectItem value="pop-scale">Pop Scale</SelectItem>
                          <SelectItem value="slide-in">Slide In</SelectItem>
                          <SelectItem value="glow-pulse">Glow Pulse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Volume2 className="h-3 w-3" />
                        Stamp Sound
                      </Label>
                      <Select value={preview.stampSound ?? "pop"} onValueChange={(value) => setPreview(p => ({ ...p, stampSound: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="ding">Ding</SelectItem>
                          <SelectItem value="swoosh">Swoosh</SelectItem>
                          <SelectItem value="chime">Chime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Celebration Animation</Label>
                    <Select value={preview.celebrationAnimation ?? "confetti"} onValueChange={(value) => setPreview(p => ({ ...p, celebrationAnimation: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confetti">Confetti</SelectItem>
                        <SelectItem value="fireworks">Fireworks</SelectItem>
                        <SelectItem value="sparkles">Sparkles</SelectItem>
                        <SelectItem value="bounce">Bounce</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Linking */}
              <Card>
                <CardHeader>
                  <CardTitle>Link to Campaign</CardTitle>
                  <CardDescription>Connect this template to a specific loyalty campaign</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Select Campaign</Label>
                    <Select value={preview.linkedCampaignId ?? ""} onValueChange={(value) => setPreview(p => ({ ...p, linkedCampaignId: value || undefined }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a campaign..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No campaign linked</SelectItem>
                        {campaigns.map(campaign => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}