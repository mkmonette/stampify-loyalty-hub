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

  const { rows = 2, cols = 5 } = gridSize || {};
  const totalStamps = rows * cols;
  const earnedStamps = 3;
  const progressPercentage = (earnedStamps / totalStamps) * 100;

  // Classic template has different styling
  if (templateStyle === "classic") {
    const animClass = animationStyle === "fade" ? "animate-fade-in" : "animate-fade-in";
    const layoutClass = layout === "vertical" ? "w-64 min-h-96 max-w-64" : "w-80 min-h-96 max-w-80";
    
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

    const ClassicLogo = () => (
      logoDataUrl ? (
        <img 
          src={logoDataUrl} 
          alt="Business logo" 
          className="h-16 w-16 rounded-full border-2 border-gray-300 object-cover shadow-sm mx-auto" 
        />
      ) : (
        <div 
          className="h-16 w-16 rounded-full border-2 border-gray-300 flex items-center justify-center text-white text-sm font-bold shadow-sm mx-auto" 
          style={{ backgroundColor: primary }}
        >
          LOGO
        </div>
      )
    );

    const bgStyle: React.CSSProperties = backgroundDataUrl
      ? { backgroundImage: `url(${backgroundDataUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { background: "linear-gradient(to bottom right, #fafafa, #ffffff)" };

    return (
      <div 
        className={`rounded-lg bg-white p-6 relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-300 ${animClass} ${layoutClass}`}
        style={bgStyle}
      >
        <div className="relative space-y-5 flex flex-col items-center">
          {/* Logo */}
          <ClassicLogo />
          
          {/* Title & Description */}
          <div className="text-center space-y-1">
            <h3 className="text-xl font-serif font-bold text-gray-800">Stamp Collection Card</h3>
            <p className="text-sm text-gray-600 font-serif">Collect {totalStamps} stamps for rewards</p>
          </div>
          
          {/* Stamp Grid */}
          <div 
            className="grid gap-2 w-full" 
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`, 
              gridTemplateRows: `repeat(${rows}, 1fr)` 
            }}
          >
            {Array.from({ length: totalStamps }, (_, i) => (
              <div 
                key={i} 
                className={`aspect-square ${shapeClass} flex items-center justify-center shadow-sm border border-gray-200 transition-all duration-300`}
                style={{ 
                  backgroundColor: i < earnedStamps ? primary : "#F3F4F6",
                  color: i < earnedStamps ? "white" : "#D1D5DB"
                }}
              >
                {i < earnedStamps ? "★" : ""}
              </div>
            ))}
          </div>
          
          {/* Progress Section */}
          <div className="w-full space-y-2">
            <div className="text-center text-gray-700 font-serif font-medium text-sm">
              {earnedStamps} of {totalStamps} stamps
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500 rounded-full"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: primary
                }}
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 w-full mt-2">
            <button 
              className="flex-1 border border-gray-400 text-gray-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              ★
            </button>
            <button 
              className="flex-1 font-medium py-2 px-4 rounded-md transition-colors duration-200 border"
              style={{ 
                backgroundColor: primary, 
                borderColor: primary,
                color: "white"
              }}
            >
              ⚡
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Modern and other templates
  const animClass =
    animationStyle === "fade" ? "animate-fade-in" :
    animationStyle === "pop-scale" ? "animate-enter" :
    animationStyle === "slide-in" ? "animate-slide-in-right" :
    animationStyle === "glow-pulse" ? "pulse" :
    "animate-enter";

  const layoutClass = layout === "vertical" ? "w-64 min-h-80 max-w-64" : "w-80 min-h-64 max-w-80";
  const paddingClass = layout === "vertical" ? "p-4" : "p-6";
  const styleClass = 
    templateStyle === "minimal" ? "border border-gray-200" :
    templateStyle === "bold" ? "border-4 border-primary shadow-2xl" :
    "";
  
  const baseClass = `rounded-2xl bg-white ${paddingClass} relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${animClass} ${layoutClass} ${styleClass}`;

  const bgStyle: React.CSSProperties = backgroundDataUrl
    ? { backgroundImage: `url(${backgroundDataUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

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
        <Header title="Stamp Collection Card" subtitle={`Collect ${totalStamps} stamps for rewards`} primary="#000" Right={<LogoBadge />} />
        <div 
          className="grid gap-3" 
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`, 
            gridTemplateRows: `repeat(${rows}, 1fr)` 
          }}
        >
          {Array.from({ length: totalStamps }, (_, i) => (
            <div 
              key={i} 
              className={`aspect-square ${shapeClass} flex items-center justify-center shadow-md`} 
              style={{ 
                backgroundColor: i < earnedStamps ? primary : "#E5E7EB",
                color: i < earnedStamps ? "white" : "#9CA3AF"
              }}
            >
              {i < earnedStamps ? "★" : ""}
            </div>
          ))}
        </div>
        <div className="text-center text-gray-600 font-medium">{earnedStamps} of {totalStamps} stamps</div>
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