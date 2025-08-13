import { TemplateId, BrandingSettings } from "@/utils/templates";
import { Colors } from "@/utils/palettes";

export default function TemplateMiniPreview({ id, colors }: { id: TemplateId; colors?: Colors }) {
  const c = colors;
  const primary = c?.primary ?? "hsl(var(--primary))";
  const secondary = c?.secondary ?? "hsl(var(--secondary))";
  const accent = c?.accent ?? "hsl(var(--accent))";
  const common = "rounded-md border border-border p-3 bg-card";

  switch (id) {
    case "grid":
      return (
        <div className={`${common}`}>
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-3 rounded" style={{ background: i < 4 ? primary : "hsl(var(--muted))" }} />
            ))}
          </div>
        </div>
      );
    case "circular":
      return (
        <div className={`${common}`}>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-3 w-3 rounded-full" style={{ background: i < 3 ? secondary : "hsl(var(--muted))" }} />
            ))}
          </div>
        </div>
      );
    case "progress":
      return (
        <div className={`${common}`}>
          <div className="h-2 w-full rounded bg-muted">
            <div className="h-full rounded" style={{ width: "60%", background: primary }} />
          </div>
        </div>
      );
    case "tiered":
      return (
        <div className={`${common}`}>
          <div className="flex gap-1 items-end">
            <div className="h-2 w-6 rounded" style={{ background: accent }} />
            <div className="h-3 w-6 rounded" style={{ background: secondary }} />
            <div className="h-4 w-6 rounded" style={{ background: primary }} />
          </div>
        </div>
      );
    case "pathway":
      return (
        <div className={`${common}`}>
          <div className="relative h-6">
            <div className="absolute inset-y-0 left-0 right-0 my-2 rounded bg-muted" />
            <div className="absolute top-1/2 -translate-y-1/2 left-1 flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-3 w-3 rounded-full" style={{ background: i < 2 ? primary : "hsl(var(--muted))" }} />
              ))}
            </div>
          </div>
        </div>
      );
    case "honeycomb":
      return (
        <div className={`${common}`}>
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-3 w-3 rotate-45 rounded" style={{ background: i < 3 ? secondary : "hsl(var(--muted))" }} />
            ))}
          </div>
        </div>
      );
    case "star":
      return (
        <div className={`${common}`}>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" className="h-3 w-3" style={{ fill: i < 2 ? accent : "hsl(var(--muted))" }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        </div>
      );
    case "barcode":
      return (
        <div className={`${common}`}>
          <div className="flex items-end gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-0.5" style={{ height: 4 + (i % 3), background: primary }} />
            ))}
          </div>
        </div>
      );
    case "puzzle":
      return (
        <div className={`${common}`}>
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-3 rounded" style={{ background: i < 3 ? secondary : "hsl(var(--muted))" }} />
            ))}
          </div>
        </div>
      );
    case "minimal":
    default:
      return (
        <div className={`${common}`}>
          <div className="space-y-1">
            <div className="h-3 w-20 rounded" style={{ background: primary }} />
            <div className="h-2 w-32 rounded bg-muted" />
          </div>
        </div>
      );
  }
}
