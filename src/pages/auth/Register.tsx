import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { Role, getDashboardPathForRole } from "@/utils/roles";

const schema = z.object({
  name: z.string().max(80).optional(),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["super-admin", "business-admin", "customer"]).default("business-admin"),
});

type FormValues = z.infer<typeof schema>;

export default function Register() {
  const { user, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate(getDashboardPathForRole(user.role), { replace: true });
    }
  }, [user, navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", role: "business-admin" as Role },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      const created = await registerUser({ email: values.email, password: values.password, role: values.role as Role, name: values.name });
      
      // If customer, redirect to first active campaign
      if (created.role === 'customer') {
        const { Campaigns } = await import('@/utils/localDb');
        const campaigns = Campaigns.list();
        const firstActive = campaigns.find(c => c.active);
        
        if (firstActive) {
          navigate(`/campaigns/${firstActive.slug}`, { replace: true });
          return;
        }
      }
      
      navigate(getDashboardPathForRole(created.role), { replace: true });
    } catch (e: any) {
      setError(e?.message ?? "Registration failed");
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account | Stampify</title>
        <meta name="description" content="Create your Stampify account as Super Admin, Business Admin, or Customer to start earning rewards." />
        <link rel="canonical" href={`${window.location.origin}/register`} />
      </Helmet>
      <main className="min-h-[calc(100vh-4rem)] pt-24 pb-16 px-4">
        <section className="mx-auto w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Create your account</h1>
          <p className="text-muted-foreground mb-6">Choose a role and get started.</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Your name" autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super-admin">Super Admin</SelectItem>
                          <SelectItem value="business-admin">Business Admin</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-destructive text-sm">{error}</p>}

              <Button type="submit" className="w-full">Create Account</Button>
            </form>
          </Form>

          <p className="text-sm text-muted-foreground mt-6">
            Already have an account? {" "}
            <Link to="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </section>
      </main>
    </>
  );
}
