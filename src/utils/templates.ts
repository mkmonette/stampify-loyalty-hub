// Templates catalog and per-tenant (owner) persistence using localStorage
// Note: We treat the Business Admin user as the tenant owner for demo purposes.

export type TemplateId = "classic" | "modern" | "minimal" | "playful";

export type TemplateDef = {
  id: TemplateId;
  name: string;
  description: string;
};

export const TEMPLATE_CATALOG: TemplateDef[] = [
  { id: "classic", name: "Classic", description: "Rounded cards, subtle shadows, balanced spacing." },
  { id: "modern", name: "Modern", description: "Bold headers, gradient accents, larger CTAs." },
  { id: "minimal", name: "Minimal", description: "Clean lines, airy layout, muted accents." },
  { id: "playful", name: "Playful", description: "Soft corners, colorful gradients, upbeat visuals." },
];

type TenantSettings = {
  id: string; // same as ownerUserId (demo)
  ownerUserId: string;
  templateId: TemplateId;
  updatedAt: string;
};

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
  return getSettingsForOwner(ownerUserId)?.templateId ?? "classic";
}

export function setTemplateForOwner(ownerUserId: string, templateId: TemplateId): TenantSettings {
  const items = read();
  const existing = items.find((x) => x.ownerUserId === ownerUserId);
  if (existing) {
    existing.templateId = templateId;
    existing.updatedAt = new Date().toISOString();
    write(items);
    return existing;
  }
  const next: TenantSettings = {
    id: ownerUserId,
    ownerUserId,
    templateId,
    updatedAt: new Date().toISOString(),
  };
  write([next, ...items]);
  return next;
}
