import { PALETTES, PaletteName, Colors } from "@/utils/palettes";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Props = {
  paletteName?: PaletteName;
  colors?: Colors;
  onPaletteChange: (name: PaletteName) => void;
  onColorsChange: (colors: Colors) => void;
};

export default function PalettePicker({ paletteName, colors, onPaletteChange, onColorsChange }: Props) {
  const selected = paletteName && PALETTES[paletteName];
  const effective = colors ?? selected;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Color Palette</Label>
          <Select value={paletteName} onValueChange={(v) => onPaletteChange(v as PaletteName)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a palette" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(PALETTES) as PaletteName[]).map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selected && (
            <div className="mt-2 flex gap-2">
              {([selected.primary, selected.secondary, selected.accent] as string[]).map((hex, i) => (
                <div key={i} className="h-6 w-6 rounded border" style={{ background: hex }} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Custom Colors (override)</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input type="color" aria-label="Primary color" value={effective?.primary ?? "#6C5CE7"}
              onChange={(e) => onColorsChange({ ...(effective ?? { secondary: "#00B894", accent: "#FDCB6E" }), primary: e.target.value })} />
            <Input type="color" aria-label="Secondary color" value={effective?.secondary ?? "#00B894"}
              onChange={(e) => onColorsChange({ ...(effective ?? { primary: "#6C5CE7", accent: "#FDCB6E" }), secondary: e.target.value })} />
            <Input type="color" aria-label="Accent color" value={effective?.accent ?? "#FDCB6E"}
              onChange={(e) => onColorsChange({ ...(effective ?? { primary: "#6C5CE7", secondary: "#00B894" }), accent: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}
