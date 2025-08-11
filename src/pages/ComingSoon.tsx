import { Helmet } from "react-helmet-async";

export default function ComingSoon({ title, description }: { title: string; description?: string }) {
  const desc = description ?? `${title} is coming soon. Stay tuned!`;
  return (
    <main className="min-h-[calc(100vh-3rem)] p-6">
      <Helmet>
        <title>{title} | Stampify</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`${window.location.origin}${window.location.pathname}`} />
      </Helmet>
      <section className="mx-auto max-w-3xl text-center py-16">
        <h1 className="text-3xl font-bold text-foreground mb-3">{title}</h1>
        <p className="text-muted-foreground mb-8">{desc}</p>
        <div className="mx-auto h-40 w-full max-w-lg rounded-xl border border-dashed border-border flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Coming Soon</span>
        </div>
      </section>
    </main>
  );
}
