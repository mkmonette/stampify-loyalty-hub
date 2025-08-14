import { TemplateId, BrandingSettings } from "@/utils/templates";
import { Colors } from "@/utils/palettes";

export default function TemplateMiniPreview({ id, colors }: { id: TemplateId; colors?: Colors }) {
  const c = colors;
  const primary = c?.primary ?? "#FF8A00";
  const secondary = c?.secondary ?? "#10B981";
  const accent = c?.accent ?? "#8B5CF6";
  const common = "rounded-xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200";
  
  const HeaderMini = () => (
    <div className="mb-3 flex items-center justify-between">
      <div className="h-1.5 w-12 rounded bg-gray-300" />
      <div className="h-2.5 w-6 rounded bg-blue-500 text-white text-[6px] flex items-center justify-center font-bold">LOGO</div>
    </div>
  );
  
  switch (id) {
    case "grid":
      return (
          <div className={`${common}`}>
            <HeaderMini />
            <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg flex items-center justify-center text-[8px] text-white" style={{ background: i < 3 ? primary : "#E5E7EB" }}>
                {i < 3 ? "★" : ""}
              </div>
            ))}
          </div>
        </div>
      );
    case "circular":
      return (
          <div className={`${common}`}>
            <HeaderMini />
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="12" fill="none" stroke="#E5E7EB" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="12" fill="none" stroke={primary} strokeWidth="2" strokeDasharray="25 75" strokeLinecap="round"/>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[6px] font-bold">6</div>
              </div>
            </div>
        </div>
      );
    case "progress":
      return (
          <div className={`${common}`}>
            <HeaderMini />
            <div className="space-y-1">
              <div className="h-1.5 w-full rounded-full bg-gray-200">
                <div className="h-full rounded-full" style={{ width: "70%", background: primary }} />
              </div>
              <div className="flex justify-between">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-1 h-1 rounded-full" style={{ background: i < 3 ? primary : "#E5E7EB" }} />
                ))}
              </div>
            </div>
        </div>
      );
    case "tiered":
      return (
          <div className={`${common}`}>
            <HeaderMini />
            <div className="space-y-1">
              {["Bronze", "Silver", "Gold"].map((tier, i) => (
                <div key={tier} className={`rounded p-1 text-[6px] font-bold text-white ${i < 2 ? 'bg-green-500' : 'bg-red-500'}`}>
                  {tier} {i < 2 ? '✓' : '🏆'}
                </div>
              ))}
            </div>
        </div>
      );
    case "pathway":
      return (
          <div className={`${common}`}>
            <HeaderMini />
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
            <HeaderMini />
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
            <HeaderMini />
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
            <HeaderMini />
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
            <HeaderMini />
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
            <HeaderMini />
            <div className="space-y-2">
              <div className="flex justify-center gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i < 4 ? primary : "#E5E7EB" }} />
                ))}
              </div>
              <div className="text-center text-[6px] text-gray-500">4 / 6</div>
            </div>
        </div>
      );
  }
}
