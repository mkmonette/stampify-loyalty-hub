import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Campaigns, Cards, Redemptions, Rewards } from "@/utils/localDb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BusinessAnalyticsPage() {
  const [metrics, setMetrics] = useState({ campaigns: 0, rewards: 0, cards: 0, redemptions: 0 });

  useEffect(() => {
    setMetrics({
      campaigns: Campaigns.list().length,
      rewards: Rewards.list().length,
      cards: Cards.list().length,
      redemptions: Redemptions.list().length,
    });
  }, []);

  const title = useMemo(() => `Analytics | Stampify`, []);

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Business analytics: campaigns, rewards, and redemptions." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat title="Campaigns" value={metrics.campaigns} />
        <Stat title="Rewards" value={metrics.rewards} />
        <Stat title="Loyalty Cards" value={metrics.cards} />
        <Stat title="Redemptions" value={metrics.redemptions} />
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
