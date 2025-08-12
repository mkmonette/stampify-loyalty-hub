import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function QRCodesPage() {
  const [text, setText] = useState("stamp:campaign:coffee");
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const title = useMemo(() => `QR Codes | Stampify`, []);

  const generate = async () => {
    const url = await QRCode.toDataURL(text, { width: 256, margin: 2 });
    setDataUrl(url);
  };

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Generate QR codes for stamps and rewards." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Generator</CardTitle>
            <CardDescription>Encode any text payload</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Payload (e.g., stamp:campaign:coffee)" />
            <Button onClick={generate}>Generate</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Download or share</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dataUrl ? (
              <div className="space-y-2">
                <img src={dataUrl} alt="generated qr code for loyalty" className="h-64 w-64 rounded-md border border-border" loading="lazy" />
                <a href={dataUrl} download="qr.png" className="inline-flex items-center rounded-md bg-secondary px-3 py-2 text-secondary-foreground hover:opacity-90 transition">Download</a>
              </div>
            ) : (
              <div className="h-64 w-64 rounded-md border border-dashed border-border grid place-items-center text-sm text-muted-foreground">No QR yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
