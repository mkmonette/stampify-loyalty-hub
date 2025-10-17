import { Campaign } from "@/utils/localDb";
import { BrandingSettings } from "@/utils/templates";
import { getPalette } from "@/utils/palettes";
import { Gift } from "lucide-react";

type Props = {
  campaign: Campaign;
  branding: BrandingSettings;
  earnedStamps?: number;
  isReadOnly?: boolean;
};

export default function ThemedCampaignCard({ 
  campaign, 
  branding, 
  earnedStamps = 0,
  isReadOnly = true 
}: Props) {
  const colors = branding.paletteName 
    ? getPalette(branding.paletteName as any) 
    : branding.colors;
  
  const primary = colors?.primary ?? "#3B82F6";
  const secondary = colors?.secondary ?? "#10B981";
  const accent = colors?.accent ?? "#F59E0B";
  
  const { rows = 2, cols = 5 } = branding.gridSize || {};
  const totalStamps = campaign.stampsRequired || (rows * cols);
  const progressPercentage = (earnedStamps / totalStamps) * 100;
  
  const templateStyle = branding.templateStyle || "modern";
  const layout = branding.layout || "horizontal";
  const shape = branding.stampShape || "rounded-square";
  const radius = branding.cornerRadius || "medium";
  
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
  
  const layoutClass = layout === "vertical" ? "w-64 max-w-64" : "w-80 max-w-80";
  
  const Logo = () => (
    branding.logoDataUrl ? (
      <img 
        src={branding.logoDataUrl} 
        alt="Business logo" 
        className="h-16 w-16 rounded-full border-2 object-cover shadow-sm" 
        style={{ borderColor: primary }}
      />
    ) : (
      <div 
        className="h-16 w-16 rounded-full border-2 flex items-center justify-center text-white text-sm font-bold shadow-sm" 
        style={{ backgroundColor: primary, borderColor: primary }}
      >
        LOGO
      </div>
    )
  );
  
  const bgStyle: React.CSSProperties = branding.backgroundDataUrl
    ? { backgroundImage: `url(${branding.backgroundDataUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : templateStyle === "bold"
    ? { background: `linear-gradient(135deg, ${primary}, ${secondary})` }
    : { background: "linear-gradient(to bottom right, hsl(var(--background)), hsl(var(--muted)))" };
  
  // Bold Template
  if (templateStyle === "bold") {
    return (
      <div 
        className={`rounded-xl bg-gradient-to-br p-6 shadow-xl hover:shadow-2xl transition-all duration-300 ${layoutClass}`}
        style={bgStyle}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Gift className="w-6 h-6 text-white" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-[Poppins] font-extrabold text-white tracking-wide">
              {campaign.name}
            </h3>
            {campaign.description && (
              <p className="text-white/90 text-sm font-medium">
                {campaign.description}
              </p>
            )}
          </div>
          
          <div 
            className="grid gap-3 w-full py-4" 
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
            }}
          >
            {Array.from({ length: totalStamps }, (_, i) => {
              const isEarned = i < earnedStamps;
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center transition-all duration-300 ${shapeClass} ${
                    isEarned 
                      ? 'bg-white text-primary shadow-lg scale-105' 
                      : 'bg-white/20 text-white/40 border-2 border-white/30'
                  }`}
                  style={isEarned ? { color: primary } : {}}
                >
                  <span className="text-2xl font-bold">{isEarned ? '✓' : i + 1}</span>
                </div>
              );
            })}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-white text-sm font-semibold">
              <span>{earnedStamps} of {totalStamps} stamps</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Modern Template (default)
  if (templateStyle === "modern") {
    return (
      <div 
        className={`rounded-xl bg-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 border ${layoutClass}`}
        style={bgStyle}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div 
              className="px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: secondary }}
            >
              Active
            </div>
          </div>
          
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold" style={{ color: primary }}>
              {campaign.name}
            </h3>
            {campaign.description && (
              <p className="text-sm text-muted-foreground">
                {campaign.description}
              </p>
            )}
          </div>
          
          <div 
            className="grid gap-2 w-full py-2" 
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
            }}
          >
            {Array.from({ length: totalStamps }, (_, i) => {
              const isEarned = i < earnedStamps;
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center transition-all duration-300 ${shapeClass} ${
                    isEarned 
                      ? 'shadow-md scale-105' 
                      : 'border-2 opacity-40'
                  }`}
                  style={isEarned 
                    ? { backgroundColor: primary, color: 'white' } 
                    : { borderColor: primary, color: primary }
                  }
                >
                  <span className="text-lg font-bold">{isEarned ? '✓' : i + 1}</span>
                </div>
              );
            })}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span>{earnedStamps} of {totalStamps} stamps</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%`, backgroundColor: primary }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Classic Template
  if (templateStyle === "classic") {
    return (
      <div 
        className={`rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-all duration-300 border-2 ${layoutClass}`}
        style={{ ...bgStyle, borderColor: primary }}
      >
        <div className="space-y-5 flex flex-col items-center">
          <Logo />
          
          <div className="text-center space-y-1">
            <h3 className="text-xl font-serif font-bold text-gray-800">{campaign.name}</h3>
            {campaign.description && (
              <p className="text-sm text-gray-600 font-serif">{campaign.description}</p>
            )}
          </div>
          
          <div 
            className="grid gap-2 w-full" 
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
            }}
          >
            {Array.from({ length: totalStamps }, (_, i) => {
              const isEarned = i < earnedStamps;
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center transition-all duration-300 ${shapeClass} border-2 ${
                    isEarned 
                      ? 'shadow-md' 
                      : 'opacity-30'
                  }`}
                  style={isEarned 
                    ? { backgroundColor: primary, borderColor: primary, color: 'white' } 
                    : { borderColor: primary, color: primary }
                  }
                >
                  <span className="text-base font-serif font-bold">{isEarned ? '✓' : i + 1}</span>
                </div>
              );
            })}
          </div>
          
          <div className="w-full space-y-1">
            <p className="text-center text-sm font-serif text-gray-600">
              {earnedStamps} of {totalStamps} stamps collected
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%`, backgroundColor: primary }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Minimal Template
  return (
    <div 
      className={`rounded-lg bg-background p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${layoutClass}`}
      style={bgStyle}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Logo />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-medium" style={{ color: primary }}>
            {campaign.name}
          </h3>
          {campaign.description && (
            <p className="text-xs text-muted-foreground">
              {campaign.description}
            </p>
          )}
        </div>
        
        <div 
          className="grid gap-2 w-full" 
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
          }}
        >
          {Array.from({ length: totalStamps }, (_, i) => {
            const isEarned = i < earnedStamps;
            return (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center transition-all duration-200 ${shapeClass} ${
                  isEarned ? '' : 'opacity-20'
                }`}
                style={isEarned 
                  ? { backgroundColor: primary, color: 'white' } 
                  : { border: `1px solid ${primary}`, color: primary }
                }
              >
                <span className="text-sm font-medium">{isEarned ? '•' : ''}</span>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{earnedStamps}/{totalStamps}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
      </div>
    </div>
  );
}