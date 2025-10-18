import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Rewards, Cards, Redemptions, Referrals } from "@/utils/localDb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCampaigns } from "@/context/CampaignContext";

export default function SuperAdminAnalyticsPage() {
  const { campaigns } = useCampaigns();
  const [metrics, setMetrics] = useState({ campaigns: 0, rewards: 0, cards: 0, redemptions: 0, referrals: 0 });

  useEffect(() => {
    setMetrics({
      campaigns: campaigns.length,
      rewards: Rewards.list().length,
      cards: Cards.list().length,
      redemptions: Redemptions.list().length,
      referrals: Referrals.list().reduce((acc, r) => acc + r.referredCount, 0),
    });
  }, [campaigns]);

  const title = useMemo(() => `Analytics | Stampify`, []);

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Super admin analytics overview across tenants." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Stat title="Campaigns" value={metrics.campaigns} />
        <Stat title="Rewards" value={metrics.rewards} />
        <Stat title="Cards" value={metrics.cards} />
        <Stat title="Redemptions" value={metrics.redemptions} />
        <Stat title="Referrals" value={metrics.referrals} />
      </div>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Current total</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}
