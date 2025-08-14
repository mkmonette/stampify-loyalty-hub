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
  const primary = c?.primary ?? "#FF8A00";
  const secondary = c?.secondary ?? "#10B981";
  const accent = c?.accent ?? "#8B5CF6";

  const animClass =
    animationStyle === "fade" ? "animate-fade-in" :
    animationStyle === "pop-scale" ? "animate-enter" :
    animationStyle === "slide-in" ? "animate-slide-in-right" :
    animationStyle === "glow-pulse" ? "pulse" :
    "animate-enter"; // subtle-bounce fallback

  const baseClass = `rounded-2xl bg-white p-8 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${animClass}`;

  const bgStyle: React.CSSProperties = backgroundDataUrl
    ? { backgroundImage: `url(${backgroundDataUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  const LogoBadge = () => (
    logoDataUrl ? (
      <img src={logoDataUrl} alt="Business logo preview" className="h-12 w-12 rounded-lg border-2 border-white/20 object-cover shadow-md" />
    ) : (
      <div className="h-12 w-12 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md" style={{ backgroundColor: primary }}>
        LOGO
      </div>
    )
  );

  if (id === "grid") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-6">
          <Header title="Classic Grid" subtitle="Traditional grid layout" primary="#000" Right={<LogoBadge />} />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i} 
                className="aspect-square rounded-xl flex items-center justify-center shadow-md" 
                style={{ 
                  backgroundColor: i < 3 ? primary : "#E5E7EB",
                  color: i < 3 ? "white" : "#9CA3AF"
                }}
              >
                {i < 3 ? "★" : ""}
              </div>
            ))}
          </div>
          <div className="text-center text-gray-600 font-medium">3 of 4 stamps</div>
          <Actions primary={primary} />
        </div>
      </div>
    );
  }

  if (id === "circular") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-6">
          <Header title="Circular Progress" subtitle="Modern circular design" primary="#000" Right={<LogoBadge />} />
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="8"/>
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="none" 
                  stroke={primary} 
                  strokeWidth="8"
                  strokeDasharray={`${Math.PI * 100 * 0.6} ${Math.PI * 100}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">6</div>
                  <div className="text-sm text-gray-500">of 10</div>
                </div>
              </div>
            </div>
          </div>
          <Actions primary={secondary} />
        </div>
      </div>
    );
  }

  if (id === "progress") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-6">
          <Header title="Progress Bar" subtitle="Clean progress tracking" primary="#000" Right={<LogoBadge />} />
          <div className="space-y-4">
            <div className="text-right text-sm text-gray-500 font-medium">Progress 7 / 10</div>
            <div className="h-3 w-full rounded-full bg-gray-200">
              <div className="h-full rounded-full" style={{ width: "70%", backgroundColor: primary }} />
            </div>
            <div className="flex justify-between items-center">
              {[3, 5, 7, 10].map((num, i) => (
                <div key={num} className="flex flex-col items-center">
                  <div 
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: i < 3 ? primary : "#E5E7EB" }}
                  />
                  <div className="text-xs mt-1 text-gray-500">{num}</div>
                </div>
              ))}
            </div>
          </div>
          <Actions primary={accent} />
        </div>
      </div>
    );
  }

  if (id === "tiered") {
    return (
      <div className={baseClass} style={bgStyle}>
        <div className="relative space-y-6">
          <Header title="Tiered Rewards" subtitle="Multi-level progression" primary="#000" Right={<LogoBadge />} />
          <div className="space-y-3">
            {[
              { name: "Bronze Tier", stamps: "3 stamps required", completed: true, color: "#CD7F32" },
              { name: "Silver Tier", stamps: "6 stamps required", completed: true, color: "#C0C0C0" },
              { name: "Gold Tier", stamps: "9 stamps required", completed: false, color: "#FFD700" }
            ].map((tier, i) => (
              <div 
                key={tier.name}
                className={`rounded-xl p-4 border-2 ${tier.completed ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: tier.color }}
                    >
                      {tier.completed ? "✓" : "🏆"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{tier.name}</div>
                      <div className="text-sm text-gray-600">{tier.stamps}</div>
                    </div>
                  </div>
                  {tier.completed && <div className="text-green-600">✓</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-gray-600 font-medium">Current: 6 stamps</div>
          <Actions primary="#DC2626" />
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
      <div className="relative space-y-6">
        <Header title="Minimal Clean" subtitle="Simple elegance" primary="#000" Right={<LogoBadge />} />
        <div className="flex justify-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i} 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: i < 4 ? primary : "#E5E7EB" }}
            />
          ))}
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800">4 / 6</div>
          <div className="text-sm text-gray-500">stamps collected</div>
        </div>
        <Actions primary="#374151" />
      </div>
    </div>
  );
}

function Header({ title, subtitle, primary, Right }: { title: string; subtitle: string; primary: string; Right?: React.ReactNode }) {
  return (
    <header className="flex items-start justify-between">
      <div className="space-y-1">
        <h3 className="text-xl font-bold" style={{ color: primary }}>{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      {Right ? <div className="ml-4 shrink-0">{Right}</div> : null}
    </header>
  );
}

function Actions({ primary }: { primary: string }) {
  return (
    <div className="flex gap-3">
      <button 
        className="flex-1 rounded-xl px-4 py-3 text-white font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
      >
        ★
      </button>
      <button 
        className="flex-1 rounded-xl px-4 py-3 text-white font-medium transition-colors"
        style={{ backgroundColor: primary }}
      >
        ⚡
      </button>
    </div>
  );
}
