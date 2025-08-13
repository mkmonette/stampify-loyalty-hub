export type PaletteName =
  | "Modern Pastels"
  | "Earthy Tones"
  | "Bold Contrast"
  | "Muted Jewel Tones"
  | "Ocean Breeze";

export type Colors = {
  primary: string;
  secondary: string;
  accent: string;
  background?: string;
  foreground?: string;
};

export const PALETTES: Record<PaletteName, Colors> = {
  "Modern Pastels": {
    primary: "#D8A7B1", // dusty rose
    secondary: "#A3B18A", // sage green
    accent: "#E3C567", // soft mustard
    background: "#FAF3E0", // cream
    foreground: "#2F2F2F",
  },
  "Earthy Tones": {
    primary: "#E07A5F", // terracotta
    secondary: "#6B8F71", // olive
    accent: "#E3B23C", // mustard
    background: "#E6CCB2", // warm beige
    foreground: "#3A2F28", // deep brown-ish
  },
  "Bold Contrast": {
    primary: "#4169E1", // royal blue
    secondary: "#FF6F61", // coral red
    accent: "#FFC107", // sunflower
    background: "#FFFFFF",
    foreground: "#333333", // charcoal gray
  },
  "Muted Jewel Tones": {
    primary: "#0F52BA", // sapphire
    secondary: "#9B111E", // ruby
    accent: "#9966CC", // amethyst
    background: "#0B0B0B", // onyx
    foreground: "#F5F5F5",
  },
  "Ocean Breeze": {
    primary: "#008080", // teal
    secondary: "#9FE2BF", // seafoam green
    accent: "#F4E1C1", // sandy beige
    background: "#1B3B6F", // navy-ish
    foreground: "#F7FAFC", // soft white
  },
};

export function getPalette(name?: PaletteName | null) {
  return name ? PALETTES[name] : undefined;
}
