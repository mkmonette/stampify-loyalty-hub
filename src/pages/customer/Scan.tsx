import { Helmet } from "react-helmet-async";
import { useCallback, useMemo, useState } from "react";
import QRScanner from "@/components/qr/QRScanner";
import { Cards, Redemptions, Rewards } from "@/utils/localDb";
import { useAuth } from "@/context/AuthContext";
import { useCampaigns } from "@/context/CampaignContext";

export default function CustomerScanPage() {
  const { user } = useAuth();
  const { campaigns } = useCampaigns();
  const [last, setLast] = useState<string>("");

  const onDecode = useCallback((text: string) => {
    setLast(text);
    if (!user) return;
    // Very simple demo parser: "stamp:<campaignName>" or "reward:<rewardName>"
    if (text.startsWith('stamp:')) {
      const name = text.split(':')[1];
      const campaign = campaigns.find((c) => c.name.toLowerCase() === name?.toLowerCase());
      if (campaign) {
        const card = Cards.getOrCreate(user.id, campaign.id);
        Cards.addStamp(card.id, 1);
        alert(`Stamp added to ${campaign.name}!`);
      }
    } else if (text.startsWith('reward:')) {
      const name = text.split(':')[1];
      const reward = Rewards.list().find((r) => r.name.toLowerCase() === name?.toLowerCase());
      if (reward) {
        Redemptions.add({ userId: user.id, rewardId: reward.id });
        alert(`Redeemed: ${reward.name}`);
      }
    }
  }, [user, campaigns]);

  const title = useMemo(() => `Scan QR | Stampify`, []);

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Scan QR codes to collect stamps or redeem rewards." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <div className="max-w-xl space-y-4">
        <QRScanner onDecode={onDecode} />
        {last && <div className="text-sm text-muted-foreground">Last: <span className="text-foreground">{last}</span></div>}
      </div>
    </main>
  );
}
