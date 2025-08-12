import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Reward, Rewards, Redemptions } from "@/utils/localDb";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CustomerRewardsPage() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    setRewards(Rewards.list().filter((r) => r.active));
  }, []);

  const redeem = (rewardId: string) => {
    if (!user) return;
    Redemptions.add({ userId: user.id, rewardId });
    alert('Redeemed! (demo)');
  };

  const title = useMemo(() => `Rewards | Stampify`, []);

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Browse rewards and redeem your loyalty points." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rewards.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle>{r.name}</CardTitle>
              <CardDescription>{r.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">Requires {r.stampsRequired} stamps</div>
              <Button onClick={() => redeem(r.id)}>Redeem</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
