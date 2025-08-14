// Templates catalog and per-tenant (owner) persistence using localStorage
// Note: We treat the Business Admin user as the tenant owner for demo purposes.

export type TemplateId =
  | "grid"
  | "circular"
  | "progress"
  | "tiered"
  | "minimal"
  | "pathway"
  | "honeycomb"
  | "star"
  | "barcode"
  | "puzzle"
  // legacy ids kept for backward-compat
  | "classic"
  | "modern"
  | "minimal" // already included above, kept for compatibility
  | "playful";

export type TemplateDef = {
  id: TemplateId;
  name: string;
  description: string;
};

export const TEMPLATE_CATALOG: TemplateDef[] = [
  { id: "grid", name: "Grid Template", description: "Stamp grid with squares; classic punch-card feel." },
  { id: "circular", name: "Circular Template", description: "Row of circles for each stamp." },
  { id: "progress", name: "Progress Bar Template", description: "Linear progress toward reward." },
  { id: "tiered", name: "Tiered Template", description: "Multi-step tiers unlocking better rewards." },
  { id: "minimal", name: "Minimal Template", description: "Clean lines and lots of whitespace." },
  { id: "pathway", name: "Pathway Template", description: "A path with milestones leading to reward." },
  { id: "honeycomb", name: "Hexagonal Honeycomb Template", description: "Hex cells fill as you earn stamps." },
  { id: "star", name: "Star Progress Template", description: "Collect stars to redeem rewards." },
  { id: "barcode", name: "Barcode / QR Code Unlock Template", description: "Unlock via code scans; bars as progress." },
  { id: "puzzle", name: "Puzzle Piece Template", description: "Assemble pieces to complete the card." },
];

type TenantSettings = {
  id: string; // same as ownerUserId (demo)
  ownerUserId: string;
  templateId: TemplateId;
  layout?: "horizontal" | "vertical";
  // Customization
  paletteName?: string; // Named palette selection
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logoDataUrl?: string; // base64 data URL for logo
  backgroundDataUrl?: string; // base64 data URL for background image
  animationStyle?: "subtle-bounce" | "fade" | "pop-scale" | "slide-in" | "glow-pulse";
  templateStyle?: "modern" | "classic" | "minimal" | "bold";
  stampSound?: "none" | "pop" | "ding" | "swoosh" | "chime";
  celebrationAnimation?: "confetti" | "fireworks" | "sparkles" | "bounce" | "none";
  updatedAt: string;
};

export type BrandingSettings = TenantSettings;

const LS_KEY = "db_tenant_settings";

function read(): TenantSettings[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as TenantSettings[]) : [];
  } catch {
    return [];
  }
}

function write(items: TenantSettings[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

export function getSettingsForOwner(ownerUserId: string): TenantSettings | null {
  return read().find((x) => x.ownerUserId === ownerUserId) ?? null;
}

export function getTemplateForOwner(ownerUserId: string): TemplateId {
  return getSettingsForOwner(ownerUserId)?.templateId ?? "grid";
}

export function setTemplateForOwner(ownerUserId: string, templateId: TemplateId): TenantSettings {
  return setBrandingForOwner(ownerUserId, { templateId });
}

export function getBrandingForOwner(ownerUserId: string): TenantSettings {
  const existing = getSettingsForOwner(ownerUserId);
  if (existing) return existing;
  // default settings
  return {
    id: ownerUserId,
    ownerUserId,
    templateId: "grid",
    layout: "horizontal",
    paletteName: undefined,
    colors: undefined,
    logoDataUrl: undefined,
    backgroundDataUrl: undefined,
    animationStyle: "fade",
    templateStyle: "modern",
    stampSound: "pop",
    celebrationAnimation: "confetti",
    updatedAt: new Date().toISOString(),
  };
}

export function setBrandingForOwner(ownerUserId: string, patch: Partial<TenantSettings>): TenantSettings {
  const items = read();
  const idx = items.findIndex((x) => x.ownerUserId === ownerUserId);
  if (idx >= 0) {
    const merged: TenantSettings = { ...items[idx], ...patch, updatedAt: new Date().toISOString() } as TenantSettings;
    items[idx] = merged;
    write(items);
    return merged;
  }
  const next: TenantSettings = {
    id: ownerUserId,
    ownerUserId,
    templateId: patch.templateId ?? "grid",
    layout: patch.layout ?? "horizontal",
    paletteName: patch.paletteName,
    colors: patch.colors,
    logoDataUrl: patch.logoDataUrl,
    backgroundDataUrl: patch.backgroundDataUrl,
    animationStyle: patch.animationStyle ?? "fade",
    templateStyle: patch.templateStyle ?? "modern",
    stampSound: patch.stampSound ?? "pop",
    celebrationAnimation: patch.celebrationAnimation ?? "confetti",
    updatedAt: new Date().toISOString(),
  };
  write([next, ...items]);
  return next;
}
