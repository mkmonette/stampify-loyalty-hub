import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Referrals } from "@/utils/localDb";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BusinessReferralsPage() {
  const { user } = useAuth();
  const [code, setCode] = useState<string>("");
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    const ref = Referrals.ensureForUser(user.id);
    setCode(ref.code);
    setCount(ref.referredCount);
  }, [user]);

  const simulate = () => {
    const ref = Referrals.ensureForUser(user!.id);
    Referrals.increment(ref.id, 1);
    setCount(Referrals.ensureForUser(user!.id).referredCount);
  };

  const title = useMemo(() => `Referrals | Stampify`, []);

  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Track referral code usage and growth." />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>

      <Card>
        <CardHeader>
          <CardTitle>Referral Program</CardTitle>
          <CardDescription>Share your code to invite new customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Your code:</span>
            <span className="font-mono text-foreground">{code}</span>
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(code)}>Copy</Button>
          </div>
          <div className="text-sm text-muted-foreground">Referred count: <span className="text-foreground font-medium">{count}</span></div>
          <Button onClick={simulate}>Simulate Referral</Button>
        </CardContent>
      </Card>
    </main>
  );
}
