import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Cards, Campaigns, LoyaltyCard } from "@/utils/localDb";
import { useAuth } from "@/context/AuthContext";
import { Card as UICard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CustomerLoyaltyCardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<LoyaltyCard[]>([]);

  useEffect(() => {
    if (!user) return;
    setCards(Cards.byUser(user.id));
  }, [user]);

  const campaigns = Campaigns.list();

  const createCard = (campaignId: string) => {
    if (!user) return;
    Cards.getOrCreate(user.id, campaignId);
    setCards(Cards.byUser(user.id));
  };

  const title = useMemo(() => `Loyalty Cards | Stampify`, []);

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="View and manage your loyalty cards and stamp progress." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((camp) => {
          const card = cards.find((c) => c.campaignId === camp.id);
          const progress = card ? Math.min(100, Math.round((card.stamps / camp.stampsRequired) * 100)) : 0;
          return (
            <UICard key={camp.id}>
              <CardHeader>
                <CardTitle>{camp.name}</CardTitle>
                <CardDescription>{camp.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">Goal: {camp.stampsRequired} stamps</div>
                <div className="h-2 w-full rounded bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                </div>
                {card ? (
                  <div className="text-sm text-muted-foreground">Stamps: <span className="text-foreground font-medium">{card.stamps}</span></div>
                ) : (
                  <Button onClick={() => createCard(camp.id)}>Get Card</Button>
                )}
              </CardContent>
            </UICard>
          );
        })}
      </div>
    </main>
  );
}
