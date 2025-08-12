import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Coupon, Coupons } from "@/utils/localDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

export default function CouponsPage() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(10);
  const [expiresAt, setExpiresAt] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    setItems(Coupons.list());
  }, []);

  const add = () => {
    if (!code.trim()) return;
    Coupons.add({ code, discount, expiresAt: expiresAt || undefined, active });
    setItems(Coupons.list());
    setCode("");
    setDiscount(10);
    setExpiresAt("");
    setActive(true);
  };

  const toggleActive = (id: string, value: boolean) => {
    Coupons.update(id, { active: value });
    setItems(Coupons.list());
  };

  const title = useMemo(() => `Coupons | Stampify`, []);

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Manage coupons: codes, discounts, and expirations." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Coupon</CardTitle>
            <CardDescription>Generate promotional codes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
            <div className="flex items-center gap-2">
              <Input type="number" min={0} max={100} value={discount} onChange={(e) => setDiscount(parseInt(e.target.value || '0'))} />
              <span className="text-sm text-muted-foreground">% Discount</span>
            </div>
            <div className="flex items-center gap-2">
              <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
              <span className="text-sm text-muted-foreground">Expires</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={active} onCheckedChange={setActive} />
              <span className="text-sm">Active</span>
            </div>
            <Button onClick={add}>Add Coupon</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coupons</CardTitle>
            <CardDescription>Manage availability</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Coupons list</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.code}</TableCell>
                    <TableCell>{c.discount}%</TableCell>
                    <TableCell>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={c.active} onCheckedChange={(v) => toggleActive(c.id, v)} />
                        <span className="text-xs text-muted-foreground">{c.active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => { Coupons.remove(c.id); setItems(Coupons.list()); }}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
