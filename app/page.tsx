import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, Mail, Radar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const features = [
    { Icon: Building2, title: "Places search", copy: "Find businesses by niche, city, country, and quantity." },
    { Icon: Radar, title: "Signal analysis", copy: "Detect HTTPS, metadata, forms, social links, analytics, pixels, and schema." },
    { Icon: Mail, title: "Personalized openers", copy: "Generate concise reasons to contact and outreach starters." }
  ];

  return (
    <main className="min-h-screen">
      <section className="grain border-b">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Radar className="h-4 w-4" />
            </span>
            LeadSignal AI
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Start free</Link>
            </Button>
          </div>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-md border bg-white/70 px-3 py-1 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Local lead research with credits built in
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl">
                LeadSignal AI
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Search local businesses, analyze their marketing gaps, score the opportunity, and generate outreach openers in one focused workflow.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="default">
                <Link href="/signup">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">Open dashboard</Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
              alt="Team reviewing local business opportunities"
              width={1200}
              height={800}
              className="h-56 w-full object-cover sm:h-72"
              priority
            />
            <div className="grid gap-3 p-4">
              {[
                ["Opportunity score", "82", "Missing form, no schema, weak CTA"],
                ["Recommended offer", "Fast conversion audit", "Clear reason to contact"],
                ["Openers generated", "3", "Ready for email or LinkedIn"]
              ].map(([label, value, note]) => (
                <div key={label} className="grid grid-cols-[1fr_auto] gap-4 rounded-md border bg-background p-3">
                  <div>
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">{note}</div>
                  </div>
                  <div className="text-xl font-semibold text-primary">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-12 md:grid-cols-3">
        {features.map(({ Icon, title, copy }) => (
          <div key={title} className="rounded-lg border bg-card p-5">
            <Icon className="mb-4 h-5 w-5 text-primary" />
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
