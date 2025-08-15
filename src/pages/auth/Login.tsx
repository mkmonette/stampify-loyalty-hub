import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import { getDashboardPathForRole } from "@/utils/roles";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } } as any;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate(getDashboardPathForRole(user.role), { replace: true });
    }
  }, [user, navigate]);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const loggedIn = await login(values.email, values.password);
      const to = location.state?.from ?? getDashboardPathForRole(loggedIn.role);
      navigate(to, { replace: true });
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Stampify</title>
        <meta name="description" content="Login to Stampify to access your dashboard and manage loyalty rewards." />
        <link rel="canonical" href={`${window.location.origin}/login`} />
      </Helmet>
      <main className="min-h-[calc(100vh-4rem)] pt-24 pb-16 px-4">
        <section className="mx-auto w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Log In</h1>
          <p className="text-muted-foreground mb-6">Access your dashboard.</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-destructive text-sm">{error}</p>}

              <Button type="submit" className="w-full">Log In</Button>
            </form>
          </Form>

          <div className="mt-6 space-y-3">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm font-medium text-foreground mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Super Admin: super@demo.com / demo123</div>
                <div>Business Admin: business@demo.com / demo123</div>
                <div>Customer: customer@demo.com / demo123</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Don't have an account? {" "}
              <Link to="/register" className="text-primary hover:underline">Create one</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}