import { Helmet } from "react-helmet-async";
import { useMemo, useState, useEffect } from "react";
import QRCode from "qrcode";
import { QRCodes, QRCodeData } from "@/utils/localDb";
import { useCampaigns } from "@/context/CampaignContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

export default function QRCodesPage() {
  const { campaigns } = useCampaigns();
  const [items, setItems] = useState<QRCodeData[]>([]);
  const [text, setText] = useState("stamp:campaign:coffee");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");
  const [campaignId, setCampaignId] = useState<string>("");
  const [active, setActive] = useState(true);

  const title = useMemo(() => `QR Codes | Stampify`, []);

  useEffect(() => {
    setItems(QRCodes.list());
  }, []);

  const generate = async () => {
    const url = await QRCode.toDataURL(text, { width: 256, margin: 2 });
    setDataUrl(url);
  };

  const save = () => {
    if (!text.trim() || !dataUrl) return;
    QRCodes.add({
      code: text,
      dataUrl,
      purpose,
      campaignId: campaignId || undefined,
      active
    });
    setItems(QRCodes.list());
    setText("stamp:campaign:coffee");
    setDataUrl(null);
    setPurpose("");
    setCampaignId("");
    setActive(true);
  };

  const toggleActive = (id: string, value: boolean) => {
    QRCodes.update(id, { active: value });
    setItems(QRCodes.list());
  };

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Generate QR codes for stamps and rewards." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Generator</CardTitle>
              <CardDescription>Create and save QR codes for your campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payload</Label>
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g., stamp:campaign:coffee" />
              </div>
              <div className="space-y-2">
                <Label>Purpose (Optional)</Label>
                <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g., Coffee stamp QR" />
              </div>
              <div className="space-y-2">
                <Label>Link to Campaign (Optional)</Label>
                <Select value={campaignId} onValueChange={setCampaignId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campaign..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No campaign</SelectItem>
                    {campaigns.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={active} onCheckedChange={setActive} />
                <span className="text-sm">Active</span>
              </div>
              <Button onClick={generate}>Generate Preview</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Review and save your QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {dataUrl ? (
                <div className="space-y-3">
                  <img src={dataUrl} alt="generated qr code for loyalty" className="h-64 w-64 rounded-md border border-border mx-auto" loading="lazy" />
                  <div className="flex gap-2">
                    <Button onClick={save} className="flex-1">Save QR Code</Button>
                    <a href={dataUrl} download="qr.png" className="inline-flex items-center justify-center rounded-md bg-secondary px-3 py-2 text-secondary-foreground hover:opacity-90 transition">Download</a>
                  </div>
                </div>
              ) : (
                <div className="h-64 w-64 rounded-md border border-dashed border-border grid place-items-center text-sm text-muted-foreground mx-auto">No QR yet</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Saved QR Codes</CardTitle>
            <CardDescription>Manage your saved QR codes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Your QR codes library</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Payload</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((qr) => {
                  const linkedCampaign = campaigns.find(c => c.id === qr.campaignId);
                  return (
                    <TableRow key={qr.id}>
                      <TableCell>
                        <img src={qr.dataUrl} alt="QR code" className="h-12 w-12 rounded border" />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{qr.code.substring(0, 30)}...</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {linkedCampaign ? linkedCampaign.name : 'None'}
                      </TableCell>
                      <TableCell className="text-sm">{qr.purpose || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={qr.active} onCheckedChange={(v) => toggleActive(qr.id, v)} />
                          <span className="text-xs text-muted-foreground">{qr.active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => { QRCodes.remove(qr.id); setItems(QRCodes.list()); }}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
