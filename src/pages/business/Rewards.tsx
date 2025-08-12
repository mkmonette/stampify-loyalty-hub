import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Reward, Rewards, seedIfEmpty } from "@/utils/localDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

export default function BusinessRewardsPage() {
  const [items, setItems] = useState<Reward[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [stampsRequired, setStampsRequired] = useState(5);
  const [active, setActive] = useState(true);

  useEffect(() => {
    seedIfEmpty();
    setItems(Rewards.list());
  }, []);

  const add = () => {
    if (!name.trim()) return;
    Rewards.add({ name, description: desc, stampsRequired, active });
    setItems(Rewards.list());
    setName("");
    setDesc("");
    setStampsRequired(5);
    setActive(true);
  };

  const toggleActive = (id: string, value: boolean) => {
    Rewards.update(id, { active: value });
    setItems(Rewards.list());
  };

  const title = useMemo(() => `Rewards | Stampify`, []);

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Manage rewards: define redemption thresholds and availability." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Reward</CardTitle>
            <CardDescription>Define a new reward</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <div className="flex items-center gap-2">
              <Input type="number" min={1} value={stampsRequired} onChange={(e) => setStampsRequired(parseInt(e.target.value || '1'))} />
              <span className="text-sm text-muted-foreground">Stamps Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={active} onCheckedChange={setActive} />
              <span className="text-sm">Active</span>
            </div>
            <Button onClick={add}>Add Reward</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rewards Catalog</CardTitle>
            <CardDescription>Enable/disable or review rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Rewards list</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.stampsRequired} stamps</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={r.active} onCheckedChange={(v) => toggleActive(r.id, v)} />
                        <span className="text-xs text-muted-foreground">{r.active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => { Rewards.remove(r.id); setItems(Rewards.list()); }}>Delete</Button>
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
