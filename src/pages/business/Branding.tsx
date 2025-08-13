import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { TEMPLATE_CATALOG, TemplateId, getBrandingForOwner, setBrandingForOwner, BrandingSettings } from "@/utils/templates";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import TemplateMiniPreview from "@/components/branding/TemplateMiniPreview";
import TemplateLivePreview from "@/components/branding/TemplateLivePreview";
import PalettePicker from "@/components/branding/PalettePicker";
import ImageUploader from "@/components/branding/ImageUploader";
import { PaletteName, getPalette } from "@/utils/palettes";

export default function BrandingPage() {
  const { user } = useAuth();
  const ownerId = user?.id ?? "anon";
  const [saved, setSaved] = useState<BrandingSettings>({ id: ownerId, ownerUserId: ownerId, templateId: "grid", updatedAt: new Date().toISOString() });
  const [preview, setPreview] = useState<BrandingSettings>({ id: ownerId, ownerUserId: ownerId, templateId: "grid", updatedAt: new Date().toISOString() });

  useEffect(() => {
    const current = getBrandingForOwner(ownerId);
    setSaved(current);
    setPreview(current);
  }, [ownerId]);

  const onSave = () => {
    const next = setBrandingForOwner(ownerId, preview);
    setSaved(next);
    setPreview(next);
    toast("Branding saved", { description: `Applied ${next.templateId} to your tenant.` });
  };

  const title = useMemo(() => `Branding Templates | Stampify`, []);

  const effectiveColors = () => preview.colors ?? getPalette(preview.paletteName as PaletteName) ?? undefined;


  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Choose from 9+ loyalty card templates, customize colors, logo, and background with live preview." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Templates</h1>
            <p className="text-sm text-muted-foreground">Pick a look and feel. Changes are saved per tenant.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {TEMPLATE_CATALOG.map((tpl) => (
              <Card key={tpl.id} className={tpl.id === preview.templateId ? "ring-2 ring-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{tpl.name}</span>
                    {tpl.id === saved.templateId && <span className="text-xs text-muted-foreground">Saved</span>}
                  </CardTitle>
                  <CardDescription>{tpl.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <TemplateMiniPreview id={tpl.id as TemplateId} colors={effectiveColors()} />
                  <div className="flex gap-2">
                    <Button variant={tpl.id === preview.templateId ? "default" : "outline"} size="sm" onClick={() => setPreview({ ...preview, templateId: tpl.id as TemplateId })}>Preview</Button>
                    {tpl.id !== saved.templateId && tpl.id === preview.templateId && (
                      <Button size="sm" onClick={onSave}>Save</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Live Preview</h2>
          <TemplateLivePreview id={preview.templateId as TemplateId} colors={effectiveColors()} logoDataUrl={preview.logoDataUrl} backgroundDataUrl={preview.backgroundDataUrl} animationStyle={preview.animationStyle as any} />
          {preview.templateId !== saved.templateId || preview.logoDataUrl !== saved.logoDataUrl || preview.backgroundDataUrl !== saved.backgroundDataUrl || JSON.stringify(preview.colors) !== JSON.stringify(saved.colors) || preview.paletteName !== saved.paletteName || preview.animationStyle !== saved.animationStyle ? (
            <div className="flex gap-2">
              <Button onClick={onSave}>Save Settings</Button>
              <Button variant="outline" onClick={() => setPreview(saved)}>Revert</Button>
            </div>
          ) : null}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customize</h3>
            <PalettePicker
              paletteName={preview.paletteName as any}
              colors={preview.colors as any}
              onPaletteChange={(name) => setPreview((p) => ({ ...p, paletteName: name }))}
              onColorsChange={(colors) => setPreview((p) => ({ ...p, colors }))}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ImageUploader label="Logo" value={preview.logoDataUrl} onChange={(v) => setPreview((p) => ({ ...p, logoDataUrl: v }))} />
              <ImageUploader label="Background" value={preview.backgroundDataUrl} onChange={(v) => setPreview((p) => ({ ...p, backgroundDataUrl: v }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Animation Style</label>
              <select className="w-full rounded-md border border-border bg-background p-2" value={preview.animationStyle ?? "fade"} onChange={(e) => setPreview((p) => ({ ...p, animationStyle: e.target.value as any }))}>
                <option value="subtle-bounce">Subtle Bounce</option>
                <option value="fade">Fade In / Out</option>
                <option value="pop-scale">Pop Scale</option>
                <option value="slide-in">Slide In</option>
                <option value="glow-pulse">Glow Pulse</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

