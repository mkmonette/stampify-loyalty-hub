import { TemplateId } from "@/utils/templates";
import { Colors } from "@/utils/palettes";

type Props = {
  id: TemplateId;
  colors?: Colors;
  logoDataUrl?: string;
  backgroundDataUrl?: string;
  animationStyle?: "subtle-bounce" | "fade" | "pop-scale" | "slide-in" | "glow-pulse";
  layout?: "horizontal" | "vertical";
  templateStyle?: "modern" | "classic" | "minimal" | "bold";
  gridSize?: { rows: number; cols: number };
  stampShape?: "square" | "circle" | "rounded-square";
  cornerRadius?: "none" | "small" | "medium" | "large";
};

export default function TemplateLivePreview({ 
  id, 
  colors, 
  logoDataUrl, 
  backgroundDataUrl, 
  animationStyle = "fade", 
  layout = "horizontal", 
  templateStyle = "modern",
  gridSize,
  stampShape,
  cornerRadius
}: Props) {
  const primary = colors?.primary ?? "#3B82F6";
  const secondary = colors?.secondary ?? "#10B981";
  const accent = colors?.accent ?? "#F59E0B";

  const animClass =
    animationStyle === "fade" ? "animate-fade-in" :
    animationStyle === "pop-scale" ? "animate-enter" :
    animationStyle === "slide-in" ? "animate-slide-in-right" :
    animationStyle === "glow-pulse" ? "pulse" :
    "animate-enter"; // subtle-bounce fallback

  const layoutClass = layout === "vertical" ? "w-64 min-h-80 max-w-64" : "w-80 min-h-64 max-w-80";
  const paddingClass = layout === "vertical" ? "p-4" : "p-6";
  const styleClass = 
    templateStyle === "classic" ? "border-2 border-gray-300" :
    templateStyle === "minimal" ? "border border-gray-200" :
    templateStyle === "bold" ? "border-4 border-primary shadow-2xl" :
    ""; // modern default
  
  const baseClass = `rounded-2xl bg-white ${paddingClass} relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${animClass} ${layoutClass} ${styleClass}`;

  const bgStyle: React.CSSProperties = backgroundDataUrl
    ? { backgroundImage: `url(${backgroundDataUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  const { rows = 2, cols = 5 } = gridSize || {};
  const shape = stampShape || "rounded-square";
  const radius = cornerRadius || "medium";
  
  const radiusClass = {
    none: "rounded-none",
    small: "rounded-sm",
    medium: "rounded-md",
    large: "rounded-lg"
  }[radius];
  
  const shapeClass = {
    square: "rounded-none",
    circle: "rounded-full",
    "rounded-square": radiusClass
  }[shape];

  const LogoBadge = () => (
    logoDataUrl ? (
      <img src={logoDataUrl} alt="Business logo preview" className="h-12 w-12 rounded-lg border-2 border-white/20 object-cover shadow-md" />
    ) : (
      <div className="h-12 w-12 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md" style={{ backgroundColor: primary }}>
        LOGO
      </div>
    )
  );

  return (
    <div className={baseClass} style={bgStyle}>
      <div className="relative space-y-6">
        <Header title="Stamp Collection Card" subtitle={`Collect ${rows * cols} stamps for rewards`} primary="#000" Right={<LogoBadge />} />
        <div 
          className="grid gap-3" 
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`, 
            gridTemplateRows: `repeat(${rows}, 1fr)` 
          }}
        >
          {Array.from({ length: rows * cols }, (_, i) => (
            <div 
              key={i} 
              className={`aspect-square ${shapeClass} flex items-center justify-center shadow-md`} 
              style={{ 
                backgroundColor: i < 3 ? primary : "#E5E7EB",
                color: i < 3 ? "white" : "#9CA3AF"
              }}
            >
              {i < 3 ? "★" : ""}
            </div>
          ))}
        </div>
        <div className="text-center text-gray-600 font-medium">3 of {rows * cols} stamps</div>
        <Actions primary={primary} />
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