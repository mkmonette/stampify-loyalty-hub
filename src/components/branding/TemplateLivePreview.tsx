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

  // Classic template - elegant, traditional design
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
          <ClassicLogo />
          
          <div className="text-center space-y-1">
            <h3 className="text-xl font-serif font-bold text-gray-800">Stamp Collection Card</h3>
            <p className="text-sm text-gray-600 font-serif">Collect {totalStamps} stamps for rewards</p>
          </div>
          
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

  // Minimal template - clean, airy design with focus on simplicity
  if (templateStyle === "minimal") {
    const animClass = animationStyle === "fade" ? "animate-fade-in" : 
                      animationStyle === "pop-scale" ? "animate-scale-in" : "";
    const layoutClass = layout === "vertical" ? "w-64 min-h-96 max-w-64" : "w-80 min-h-80 max-w-80";
    
    const MinimalLogo = () => (
      logoDataUrl ? (
        <img 
          src={logoDataUrl} 
          alt="Logo" 
          className="h-8 w-8 rounded object-cover" 
        />
      ) : (
        <div 
          className="h-8 w-8 rounded flex items-center justify-center text-white text-[10px] font-semibold" 
          style={{ backgroundColor: primary }}
        >
          LG
        </div>
      )
    );

    const bgStyle: React.CSSProperties = backgroundDataUrl
      ? { backgroundImage: `url(${backgroundDataUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { backgroundColor: "#ffffff" };

    return (
      <div 
        className={`bg-white p-4 sm:p-6 relative overflow-hidden transition-all duration-300 ${animClass} ${layoutClass}`}
        style={bgStyle}
      >
        <div className="relative space-y-6">
          {/* Logo in top-right */}
          <div className="flex justify-end">
            <MinimalLogo />
          </div>
          
          {/* Title & Description */}
          <div className="text-center space-y-1">
            <h3 className="text-lg font-sans font-semibold text-gray-900">Stamp Collection Card</h3>
            <p className="text-xs text-gray-500">Collect {totalStamps} stamps for rewards</p>
          </div>
          
          {/* Stamp Grid - always circular for minimal */}
          <div 
            className="grid gap-3 w-full" 
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`, 
              gridTemplateRows: `repeat(${rows}, 1fr)` 
            }}
          >
            {Array.from({ length: totalStamps }, (_, i) => (
              <div 
                key={i} 
                className="aspect-square rounded-full flex items-center justify-center transition-all duration-200"
                style={{ 
                  backgroundColor: i < earnedStamps ? primary : "#F3F4F6",
                  color: i < earnedStamps ? "white" : "transparent"
                }}
              >
                {i < earnedStamps ? "★" : ""}
              </div>
            ))}
          </div>
          
          {/* Minimal Progress */}
          <div className="w-full space-y-2">
            <div className="text-center text-gray-600 text-sm font-sans">
              {earnedStamps} / {totalStamps}
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: primary
                }}
              />
            </div>
          </div>
          
          {/* Flat Buttons */}
          <div className="flex gap-2 w-full">
            <button 
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              ★
            </button>
            <button 
              className="flex-1 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-white"
              style={{ 
                backgroundColor: primary
              }}
            >
              ⚡
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Bold template - vibrant, dynamic design with strong contrast
  if (templateStyle === "bold") {
    const animClass = animationStyle === "fade" ? "animate-fade-in" : 
                      animationStyle === "pop-scale" ? "animate-scale-in" : 
                      animationStyle === "glow-pulse" ? "pulse" : "animate-scale-in";
    const layoutClass = layout === "vertical" ? "w-64 min-h-96 max-w-64" : "w-80 min-h-96 max-w-80";
    
    const shape = stampShape || "circle";
    const radius = cornerRadius || "large";
    
    const radiusClass = {
      none: "rounded-none",
      small: "rounded-sm",
      medium: "rounded-md",
      large: "rounded-lg"
    }[radius];
    
    const shapeClass = {
      square: radiusClass,
      circle: "rounded-full",
      "rounded-square": radiusClass
    }[shape];

    const BoldLogo = () => (
      logoDataUrl ? (
        <div className="relative">
          <div className="absolute inset-0 rounded-xl blur-md opacity-60" style={{ backgroundColor: accent }} />
          <img 
            src={logoDataUrl} 
            alt="Business logo" 
            className="relative h-14 w-14 rounded-xl border-4 border-white object-cover shadow-xl" 
          />
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-0 rounded-xl blur-md opacity-60" style={{ backgroundColor: accent }} />
          <div 
            className="relative h-14 w-14 rounded-xl border-4 border-white flex items-center justify-center text-white text-xs font-black shadow-xl" 
            style={{ backgroundColor: primary }}
          >
            LOGO
          </div>
        </div>
      )
    );

    const bgStyle: React.CSSProperties = backgroundDataUrl
      ? { backgroundImage: `url(${backgroundDataUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { 
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
        };

    return (
      <div 
        className={`rounded-2xl p-6 relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 ring-2 ring-white/20 ${animClass} ${layoutClass}`}
        style={bgStyle}
      >
        <div className="relative space-y-5 flex flex-col">
          {/* Logo in top-left */}
          <div className="flex justify-start">
            <BoldLogo />
          </div>
          
          {/* Title & Description */}
          <div className="text-center space-y-2">
            <h3 className="text-white text-2xl font-extrabold tracking-wide drop-shadow-lg font-sans">
              Stamp Collection Card
            </h3>
            <p className="text-white/90 text-sm font-semibold">
              Collect {totalStamps} stamps for rewards
            </p>
          </div>
          
          {/* Stamp Grid - larger with glow effects */}
          <div 
            className="grid gap-3 w-full" 
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`, 
              gridTemplateRows: `repeat(${rows}, 1fr)` 
            }}
          >
            {Array.from({ length: totalStamps }, (_, i) => (
              <div 
                key={i} 
                className={`aspect-square ${shapeClass} flex items-center justify-center text-2xl transition-all duration-300 ${
                  i < earnedStamps ? "shadow-xl scale-105 animate-pulse" : "shadow-md"
                }`}
                style={{ 
                  backgroundColor: i < earnedStamps ? "white" : "rgba(255, 255, 255, 0.2)",
                  color: i < earnedStamps ? primary : "rgba(255, 255, 255, 0.4)",
                  border: i < earnedStamps ? "none" : "2px solid rgba(255, 255, 255, 0.3)"
                }}
              >
                {i < earnedStamps ? "★" : ""}
              </div>
            ))}
          </div>
          
          {/* Vibrant Progress */}
          <div className="w-full space-y-3">
            <div className="text-center text-white font-bold text-base drop-shadow-md">
              {earnedStamps} of {totalStamps} stamps
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full transition-all duration-500 rounded-full shadow-lg"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: "white",
                  boxShadow: `0 0 20px ${accent}`
                }}
              />
            </div>
          </div>
          
          {/* Bold Buttons */}
          <div className="flex gap-3 w-full mt-2">
            <button 
              className="flex-1 bg-white font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg text-lg"
              style={{ 
                color: primary
              }}
            >
              ★
            </button>
            <button 
              className="flex-1 font-bold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg text-lg"
              style={{ 
                backgroundColor: accent,
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
  
  const baseClass = `rounded-2xl bg-white ${paddingClass} relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${animClass} ${layoutClass}`;

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