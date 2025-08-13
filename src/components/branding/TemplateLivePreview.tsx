import { TemplateId } from "@/utils/templates";
import { Colors } from "@/utils/palettes";

type Props = {
  id: TemplateId;
  colors?: Colors;
  logoDataUrl?: string;
  backgroundDataUrl?: string;
  animationStyle?: "subtle-bounce" | "fade" | "pop-scale" | "slide-in" | "glow-pulse";
};

export default function TemplateLivePreview({ id, colors, logoDataUrl, backgroundDataUrl, animationStyle = "fade" }: Props) {
  const c = colors;
  const primary = c?.primary ?? "#6C5CE7";
  const secondary = c?.secondary ?? "#00B894";
  const accent = c?.accent ?? "#FDCB6E";

  const animClass =
    animationStyle === "fade" ? "animate-fade-in" :
    animationStyle === "pop-scale" ? "animate-enter" :
    animationStyle === "slide-in" ? "animate-slide-in-right" :
    animationStyle === "glow-pulse" ? "pulse" :
    "animate-enter"; // subtle-bounce fallback

  const baseClass = `rounded-xl border border-border bg-card p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow ${animClass}`;

  const bgStyle: React.CSSProperties = backgroundDataUrl
    ? { backgroundImage: `url(${backgroundDataUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  const LogoBadge = () => (
    logoDataUrl ? (
      <img src={logoDataUrl} alt="Business logo preview" className="h-10 w-10 rounded-full border border-border object-cover" />
    ) : (
      <div className="rounded-md border border-border bg-muted px-2 py-1 text-[10px] font-medium text-foreground/80">LOGO</div>
    )
  );

  if (id === "grid") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-4">
          <Header title="Coffee Lovers" subtitle="Collect 10 stamps" primary={primary} Right={<LogoBadge />} />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-10 rounded border border-border" style={{ background: i < 4 ? primary : undefined, boxShadow: i < 4 ? `0 0 0 2px ${accent} inset` : undefined }} />
            ))}
          </div>
          <Actions primary={primary} />
        </div>
      </div>
    );
  }

  if (id === "circular") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-4">
          <Header title="Tea Club" subtitle="Buy 8 get 1 free" primary={primary} Right={<LogoBadge />} />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-10 w-10 rounded-full border border-border" style={{ background: i < 6 ? secondary : undefined, boxShadow: i < 6 ? `0 0 0 2px ${accent} inset` : undefined }} />
            ))}
          </div>
          <Actions primary={primary} />
        </div>
      </div>
    );
  }

  if (id === "progress") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-4">
          <Header title="Smoothie Streak" subtitle="Reach 100% to redeem" primary={primary} Right={<LogoBadge />} />
          <div className="h-3 w-full rounded bg-muted">
            <div className="h-full rounded" style={{ width: "60%", background: primary }} />
          </div>
          <Actions primary={primary} />
        </div>
      </div>
    );
  }

  if (id === "tiered") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-4">
          <Header title="Tiered Tastes" subtitle="Bronze → Silver → Gold" primary={primary} Right={<LogoBadge />} />
          <div className="flex gap-3 items-end">
            <div className="h-8 w-14 rounded" style={{ background: accent }} />
            <div className="h-12 w-14 rounded" style={{ background: secondary }} />
            <div className="h-16 w-14 rounded" style={{ background: primary }} />
          </div>
          <Actions primary={primary} />
        </div>
      </div>
    );
  }

  if (id === "pathway") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-4">
          <Header title="Pathway Perks" subtitle="Follow the path to rewards" primary={primary} Right={<LogoBadge />} />
          <div className="relative h-16">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded bg-muted" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 w-8 rounded-full border border-border" style={{ background: i < 3 ? secondary : undefined }} />
              ))}
            </div>
          </div>
          <Actions primary={primary} />
        </div>
      </div>
    );
  }

  if (id === "honeycomb") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-4">
          <Header title="Honey Rewards" subtitle="Fill the comb" primary={primary} Right={<LogoBadge />} />
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-8 w-8 rotate-45 rounded border border-border" style={{ background: i < 5 ? secondary : undefined }} />
            ))}
          </div>
          <Actions primary={primary} />
        </div>
      </div>
    );
  }

  if (id === "star") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-4">
          <Header title="Star Seekers" subtitle="Collect stars" primary={primary} Right={<LogoBadge />} />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" className="h-8 w-8" style={{ fill: i < 6 ? accent : "transparent", stroke: primary }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <Actions primary={primary} />
        </div>
      </div>
    );
  }

  if (id === "barcode") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-4">
          <Header title="Scan & Unlock" subtitle="Scan QR to progress" primary={primary} Right={<LogoBadge />} />
          <div className="flex items-end gap-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-0.5" style={{ height: 8 + ((i * 7) % 12), background: i % 2 ? primary : secondary }} />
            ))}
          </div>
          <Actions primary={primary} />
        </div>
      </div>
    );
  }

  if (id === "puzzle") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-4">
          <Header title="Puzzle Perks" subtitle="Complete the picture" primary={primary} Right={<LogoBadge />} />
          <div className="grid grid-cols-4 gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-10 rounded border border-border" style={{ background: i < 5 ? secondary : undefined }} />
            ))}
          </div>
          <Actions primary={primary} />
        </div>
      </div>
    );
  }

  // minimal
  return (
    <div className={baseClass} style={bgStyle}>
      <div className="relative space-y-4">
        <Header title="Minimal Moments" subtitle="Simple progress" primary={primary} Right={<LogoBadge />} />
        <div className="h-2 w-full rounded bg-muted">
          <div className="h-full rounded" style={{ width: "40%", background: primary }} />
        </div>
        <Actions primary={primary} />
      </div>
    </div>
  );
}

function Header({ title, subtitle, primary, Right }: { title: string; subtitle: string; primary: string; Right?: React.ReactNode }) {
  return (
    <header className="flex items-start justify-between">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold" style={{ color: primary }}>{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {Right ? <div className="ml-4 shrink-0">{Right}</div> : null}
    </header>
  );
}

function Actions({ primary }: { primary: string }) {
  return (
    <div className="flex gap-2">
      <button className="rounded-md px-4 py-2 text-primary-foreground hover-scale" style={{ background: primary }}>Collect</button>
      <button className="rounded-md border border-border bg-background px-4 py-2 hover-scale">Details</button>
    </div>
  );
}
