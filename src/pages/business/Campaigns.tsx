import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Campaigns, Campaign, CustomerCampaigns, seedIfEmpty } from "@/utils/localDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Copy, ExternalLink, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CampaignsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Campaign[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [stampsRequired, setStampsRequired] = useState(10);
  const [active, setActive] = useState(true);

  useEffect(() => {
    seedIfEmpty();
    setItems(Campaigns.list());
  }, []);

  const add = () => {
    if (!name.trim()) return;
    Campaigns.add({ 
      name, 
      description: desc, 
      stampsRequired, 
      active,
      ownerId: user?.id // Set the current user as the owner
    });
    setItems(Campaigns.list());
    setName("");
    setDesc("");
    setStampsRequired(10);
    setActive(true);
  };

  const toggleActive = (id: string, value: boolean) => {
    Campaigns.update(id, { active: value });
    setItems(Campaigns.list());
  };

  const title = useMemo(() => `Campaigns | Stampify`, []);

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/campaigns/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Campaign link copied to clipboard!");
  };

  const previewCampaign = (slug: string) => {
    window.open(`/campaigns/${slug}`, '_blank');
  };

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Manage loyalty campaigns: create, activate, and configure stamp goals." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Campaign</CardTitle>
            <CardDescription>Define a new loyalty campaign</CardDescription>
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
            <Button onClick={add}>Add Campaign</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Campaigns</CardTitle>
            <CardDescription>Enable/disable or review campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Campaigns and progress</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.stampsRequired} stamps</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{CustomerCampaigns.countByCampaign(c.id)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={c.active} onCheckedChange={(v) => toggleActive(c.id, v)} />
                        <span className="text-xs text-muted-foreground">{c.active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyLink(c.slug)}
                          title="Copy link"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => previewCampaign(c.slug)}
                          title="Preview"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => { Campaigns.remove(c.id); setItems(Campaigns.list()); }}>Delete</Button>
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
