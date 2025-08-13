import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ImageUploader({ label, value, onChange }: { label: string; value?: string; onChange: (dataUrl?: string) => void }) {
  const onFile = async (file?: File | null) => {
    if (!file) return onChange(undefined);
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <Input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
        {value && <img src={value} alt={`${label} preview`} className="h-10 w-10 rounded border object-cover" />}
      </div>
    </div>
  );
}
