import { TemplateId } from "@/utils/templates";
import { Colors } from "@/utils/palettes";

export default function TemplateMiniPreview({ 
  id, 
  colors, 
  gridSize, 
  stampShape, 
  cornerRadius 
}: { 
  id: TemplateId; 
  colors?: Colors;
  gridSize?: { rows: number; cols: number };
  stampShape?: "square" | "circle" | "rounded-square";
  cornerRadius?: "none" | "small" | "medium" | "large";
}) {
  const primary = colors?.primary ?? "#3B82F6";
  const secondary = colors?.secondary ?? "#10B981";
  const accent = colors?.accent ?? "#F59E0B";
  
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

  const HeaderMini = () => (
    <div className="mb-3 flex items-center justify-between">
      <div className="h-1.5 w-12 rounded bg-gray-300" />
      <div className="h-2.5 w-6 rounded bg-blue-500 text-white text-[6px] flex items-center justify-center font-bold">LOGO</div>
    </div>
  );

  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <HeaderMini />
      <div 
        className="grid gap-1" 
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`, 
          gridTemplateRows: `repeat(${rows}, 1fr)` 
        }}
      >
        {Array.from({ length: rows * cols }, (_, i) => (
          <div 
            key={i} 
            className={`aspect-square ${shapeClass} flex items-center justify-center text-[8px] text-white`} 
            style={{ backgroundColor: i < 3 ? primary : "#E5E7EB" }}
          >
            {i < 3 ? "★" : ""}
          </div>
        ))}
      </div>
    </div>
  );
}