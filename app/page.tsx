import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, CheckCircle2, Coins, ListChecks, Mail, Radar, Search, Send, ShieldCheck, Users } from "lucide-react";
import { LanguageSelector } from "@/components/app/language-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dictionary, getLanguage } from "@/lib/i18n";

export default async function LandingPage() {
  const language = await getLanguage();
  const copy = dictionary[language];
  const features = [
    { Icon: Building2, title: copy.landing.features[0][0], copy: copy.landing.features[0][1] },
    { Icon: Radar, title: copy.landing.features[1][0], copy: copy.landing.features[1][1] },
    { Icon: Mail, title: copy.landing.features[2][0], copy: copy.landing.features[2][1] }
  ];
  const stepIcons = [Search, Radar, ListChecks, Send];

  return (
    <main className="min-h-screen">
      <section className="grain border-b">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Radar className="h-4 w-4" />
            </span>
            LeadSignal AI
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSelector language={language} copy={copy.common} />
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/login">{copy.nav.signIn}</Link>
            </Button>
            <Button asChild className="hidden sm:inline-flex">
              <Link href="/signup">{copy.nav.startFree}</Link>
            </Button>
          </div>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-md border bg-white/75 px-3 py-1 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {copy.landing.badge}
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl">
                {copy.landing.headline}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                {copy.landing.subhead}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="default">
                <Link href="/signup">
                  {copy.landing.createAccount}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href="#sample-leads">{copy.landing.viewSampleLeads}</a>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
              alt={copy.landing.imageAlt}
              width={1200}
              height={800}
              className="h-56 w-full object-cover sm:h-72"
              priority
            />
            <div className="grid gap-3 p-4">
              {[
                [copy.landing.statScore, "82", copy.landing.statScoreNote],
                [copy.landing.statOffer, language === "es" ? "Auditoría rápida" : "Fast conversion audit", copy.landing.statOfferNote],
                [copy.landing.statOpeners, "3", copy.landing.statOpenersNote]
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
        {features.map(({ Icon, title, copy: featureCopy }) => (
          <div key={title} className="rounded-lg border bg-card p-5">
            <Icon className="mb-4 h-5 w-5 text-primary" />
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{featureCopy}</p>
          </div>
        ))}
      </section>

      <section id="sample-leads" className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-6 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-normal">{copy.landing.sampleTitle}</h2>
            <p className="mt-2 text-muted-foreground">{copy.landing.sampleSubtitle}</p>
          </div>
          <div className="overflow-hidden rounded-lg border bg-background">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead className="border-b bg-muted/60 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">{copy.results.business}</th>
                    <th className="px-4 py-3">{copy.results.score}</th>
                    <th className="px-4 py-3">{copy.results.signals}</th>
                    <th className="px-4 py-3">{copy.results.recommendedOffer}</th>
                    <th className="px-4 py-3">{copy.lead.outreachOpeners}</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.landing.sampleLeads.map((lead) => (
                    <tr key={lead.name} className="border-b last:border-0">
                      <td className="px-4 py-4 align-top">
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.niche}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <Badge className="border-accent/30 bg-accent/10 text-accent">{lead.score}</Badge>
                      </td>
                      <td className="max-w-52 px-4 py-4 align-top text-muted-foreground">{lead.signals}</td>
                      <td className="max-w-52 px-4 py-4 align-top">{lead.offer}</td>
                      <td className="max-w-80 px-4 py-4 align-top text-muted-foreground">{lead.opener}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-normal">{copy.landing.howTitle}</h2>
          <p className="mt-2 text-muted-foreground">{copy.landing.howSubtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {copy.landing.steps.map(([title, body], index) => {
            const Icon = stepIcons[index];
            return (
              <div key={title} className="rounded-lg border bg-card p-5">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm text-muted-foreground">0{index + 1}</div>
                <h3 className="mt-1 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-normal">{copy.landing.whoTitle}</h2>
            <p className="mt-2 text-muted-foreground">{copy.landing.whoSubtitle}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {copy.landing.audiences.map(([title, body]) => (
              <div key={title} className="rounded-lg border bg-background p-5">
                <Users className="mb-4 h-5 w-5 text-primary" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[0.8fr_1fr] lg:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal">{copy.landing.pricingTitle}</h2>
          <p className="mt-2 text-muted-foreground">{copy.landing.pricingSubtitle}</p>
          <p className="mt-4 text-sm text-muted-foreground">{copy.landing.pricingNote}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="text-3xl font-semibold">25</div>
              <div className="text-sm text-muted-foreground">{copy.common.credits}</div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {copy.landing.pricingBullets.map((item) => (
              <div key={item} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <Button asChild className="mt-6 w-full sm:w-auto">
            <Link href="/signup">
              {copy.landing.createAccount}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
