import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { TEMPLATE_CATALOG, TemplateId, getTemplateForOwner, setTemplateForOwner } from "@/utils/templates";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

export default function BrandingPage() {
  const { user } = useAuth();
  const ownerId = user?.id ?? "anon";
  const [saved, setSaved] = useState<TemplateId>("classic");
  const [preview, setPreview] = useState<TemplateId>("classic");

  useEffect(() => {
    const current = getTemplateForOwner(ownerId);
    setSaved(current);
    setPreview(current);
  }, [ownerId]);

  const onSave = () => {
    setTemplateForOwner(ownerId, preview);
    setSaved(preview);
    toast("Template saved", { description: `Applied ${preview} to your tenant.` });
  };

  const title = useMemo(() => `Branding Templates | Stampify`, []);

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Choose a pre-made template with a live preview and save for your business." />
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
              <Card key={tpl.id} className={tpl.id === preview ? "ring-2 ring-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{tpl.name}</span>
                    {tpl.id === saved && <span className="text-xs text-muted-foreground">Saved</span>}
                  </CardTitle>
                  <CardDescription>{tpl.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <TemplateMiniPreview id={tpl.id} />
                  <div className="flex gap-2">
                    <Button variant={tpl.id === preview ? "default" : "outline"} size="sm" onClick={() => setPreview(tpl.id)}>Preview</Button>
                    {tpl.id !== saved && tpl.id === preview && (
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
          <TemplateLivePreview id={preview} />
          {preview !== saved && (
            <div className="flex gap-2">
              <Button onClick={onSave}>Save Template</Button>
              <Button variant="outline" onClick={() => setPreview(saved)}>Revert</Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function TemplateMiniPreview({ id }: { id: TemplateId }) {
  const common = "rounded-md border border-border p-3 bg-card";
  switch (id) {
    case "modern":
      return (
        <div className={`${common} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40" />
          <div className="relative space-y-1">
            <div className="h-3 w-24 bg-primary/70 rounded" />
            <div className="h-2 w-40 bg-muted rounded" />
          </div>
        </div>
      );
    case "minimal":
      return (
        <div className={`${common} bg-background`}> 
          <div className="space-y-1">
            <div className="h-3 w-20 bg-foreground/20 rounded" />
            <div className="h-2 w-36 bg-foreground/10 rounded" />
          </div>
        </div>
      );
    case "playful":
      return (
        <div className={`${common} relative overflow-hidden rounded-xl`}>
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-primary/30" />
          <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-secondary/40" />
          <div className="relative space-y-1">
            <div className="h-3 w-24 bg-secondary rounded" />
            <div className="h-2 w-32 bg-primary/60 rounded" />
          </div>
        </div>
      );
    case "classic":
    default:
      return (
        <div className={`${common} shadow-sm`}>
          <div className="space-y-1">
            <div className="h-3 w-24 bg-primary rounded" />
            <div className="h-2 w-40 bg-muted rounded" />
          </div>
        </div>
      );
  }
}

function TemplateLivePreview({ id }: { id: TemplateId }) {
  // This is a contained preview using semantic tokens and layout tweaks per template
  const base = "rounded-xl border border-border bg-card p-6";
  if (id === "modern") {
    return (
      <div className={`${base} relative overflow-hidden`}> 
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/20" />
        <div className="relative space-y-4">
          <h3 className="text-2xl font-bold">Coffee Lovers</h3>
          <p className="text-sm text-muted-foreground">Buy 9 get 1 free</p>
          <div className="h-2 w-full bg-muted rounded">
            <div className="h-full bg-primary rounded" style={{ width: "60%" }} />
          </div>
          <div className="flex gap-2">
            <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Join</button>
            <button className="rounded-md border border-border px-4 py-2">Details</button>
          </div>
        </div>
      </div>
    );
  }
  if (id === "minimal") {
    return (
      <div className={`${base} bg-background`}> 
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight">Coffee Lovers</h3>
          <p className="text-sm text-muted-foreground">Buy 9 get 1 free</p>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-8 rounded border border-dashed border-border" />
            ))}
          </div>
          <button className="rounded-md border border-border px-4 py-2">Get Card</button>
        </div>
      </div>
    );
  }
  if (id === "playful") {
    return (
      <div className={`${base} relative overflow-hidden rounded-2xl`}> 
        <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary/20" />
        <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-secondary/30" />
        <div className="relative space-y-4">
          <h3 className="text-2xl font-extrabold">Coffee Lovers ☕</h3>
          <p className="text-sm text-muted-foreground">Buy 9 get 1 free</p>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-8 rounded-full bg-primary/70" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-8 rounded-full border border-border" />
            ))}
          </div>
          <button className="rounded-full bg-secondary px-5 py-2 text-secondary-foreground">Start</button>
        </div>
      </div>
    );
  }
  // classic
  return (
    <div className={`${base} shadow-sm`}> 
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Coffee Lovers</h3>
        <p className="text-sm text-muted-foreground">Buy 9 get 1 free</p>
        <div className="h-2 w-full bg-muted rounded">
          <div className="h-full bg-primary rounded" style={{ width: "40%" }} />
        </div>
        <div className="flex gap-2">
          <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Collect</button>
          <button className="rounded-md border border-border px-4 py-2">Redeem</button>
        </div>
      </div>
    </div>
  );
}
