import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Coins,
  Copy,
  Gauge,
  Radar,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { CopyButton } from "@/components/app/copy-button";
import { LanguageSelector } from "@/components/app/language-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dictionary, getLanguage } from "@/lib/i18n";

export default async function LandingPage() {
  const language = await getLanguage();
  const copy = dictionary[language];
  const stepIcons = [Search, Radar, BarChart3, Send];
  const audienceIcons = [Users, ClipboardList, Gauge, Sparkles];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)]">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-5">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <Radar className="h-4 w-4" />
            </span>
            LeadSignal AI
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSelector language={language} copy={copy.common} />
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/login">{copy.nav.signIn}</Link>
            </Button>
            <Button asChild className="hidden sm:inline-flex bg-primary hover:bg-[#1E40AF]">
              <Link href="/signup">{copy.nav.startFree}</Link>
            </Button>
          </div>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pb-24 lg:pt-16">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1 text-sm text-muted-foreground shadow-sm">
              <ShieldCheck className="h-4 w-4 text-accent" />
              {copy.landing.badge}
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
                {copy.landing.headline}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                {copy.landing.subhead}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="default" className="bg-primary hover:bg-[#1E40AF]">
                <Link href="/signup">
                  {copy.landing.createAccount}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-card">
                <a href="#sample-leads">{copy.landing.viewSampleLeads}</a>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="rounded-md border bg-background p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-foreground">{copy.landing.searchExampleTitle}</div>
                  <div className="text-xs text-muted-foreground">{copy.landing.searchExampleSubtitle}</div>
                </div>
                <Badge className="border-accent/30 bg-accent/10 text-accent hover:bg-accent/10">
                  {copy.landing.livePreview}
                </Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {copy.landing.searchExample.map(([label, value]) => (
                  <div key={label} className="rounded-md border bg-card p-3">
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="mt-1 text-sm font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {copy.landing.sampleLeads.map((lead) => (
                <div key={lead.name} className="rounded-md border bg-card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{lead.offer}</div>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border bg-primary/10 text-lg font-semibold text-primary">
                      {lead.score}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {lead.signals.map((signal) => (
                      <Badge key={signal} className="bg-background text-muted-foreground">
                        {signal}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="sample-leads" className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <Badge className="mb-3 bg-background">
                {copy.landing.sampleEyebrow}
              </Badge>
              <h2 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
                {copy.landing.sampleTitle}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">{copy.landing.sampleSubtitle}</p>
            </div>
            <div className="grid min-w-72 gap-2 rounded-lg border bg-background p-3 text-sm">
              {copy.landing.searchExample.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {copy.landing.sampleLeads.map((lead) => (
              <article key={lead.name} className="rounded-lg border bg-card p-5 shadow-sm">
                <div className="grid gap-5 lg:grid-cols-[0.75fr_1fr_1fr_auto] lg:items-start">
                  <div>
                    <div className="text-sm text-muted-foreground">{copy.results.business}</div>
                    <h3 className="mt-1 font-semibold text-foreground">{lead.name}</h3>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-md border bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      <Gauge className="h-4 w-4" />
                      {copy.results.score}: {lead.score}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">{copy.results.signals}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {lead.signals.map((signal) => (
                        <Badge key={signal} className="bg-background text-muted-foreground">
                          {signal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">{copy.results.recommendedOffer}</div>
                    <p className="mt-1 font-medium text-foreground">{lead.offer}</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{lead.opener}</p>
                  </div>

                  <CopyButton text={lead.opener} label={copy.landing.copyButton} copiedLabel={copy.landing.copiedButton}>
                    <Copy className="h-4 w-4" />
                  </CopyButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-normal text-foreground">{copy.landing.howTitle}</h2>
          <p className="mt-3 leading-7 text-muted-foreground">{copy.landing.howSubtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {copy.landing.steps.map(([title, body], index) => {
            const Icon = stepIcons[index];
            return (
              <div key={title} className="rounded-lg border bg-card p-5 shadow-sm">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm text-muted-foreground">0{index + 1}</div>
                <h3 className="mt-1 font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-normal text-foreground">{copy.landing.signalsTitle}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{copy.landing.signalsSubtitle}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {copy.landing.signalsDetected.map((signal) => (
              <div key={signal} className="flex items-center gap-3 rounded-lg border bg-background p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm font-medium">{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-normal text-foreground">{copy.landing.whoTitle}</h2>
          <p className="mt-3 leading-7 text-muted-foreground">{copy.landing.whoSubtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {copy.landing.audiences.map(([title, body], index) => {
            const Icon = audienceIcons[index];
            return (
              <div key={title} className="rounded-lg border bg-card p-5 shadow-sm">
                <Icon className="mb-5 h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[0.78fr_1fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-semibold tracking-normal text-foreground">{copy.landing.benefitsTitle}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{copy.landing.benefitsSubtitle}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {copy.landing.benefits.map(([title, body]) => (
              <div key={title} className="rounded-lg border bg-background p-5">
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[0.8fr_1fr] lg:items-center">
        <div>
          <h2 className="text-3xl font-semibold tracking-normal text-foreground">{copy.landing.pricingTitle}</h2>
          <p className="mt-3 leading-7 text-muted-foreground">{copy.landing.pricingSubtitle}</p>
          <p className="mt-4 text-sm text-muted-foreground">{copy.landing.pricingNote}</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="text-4xl font-semibold leading-none text-foreground">25</div>
              <div className="mt-1 text-sm text-muted-foreground">{copy.common.credits}</div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {copy.landing.pricingBullets.map((item) => (
              <div key={item} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <Button asChild className="mt-6 w-full bg-primary hover:bg-[#1E40AF] sm:w-auto">
            <Link href="/signup">
              {copy.landing.createAccount}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="border-t bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <Badge className="mb-4 bg-card">
            {copy.landing.finalEyebrow}
          </Badge>
          <h2 className="text-3xl font-semibold tracking-normal text-foreground sm:text-5xl">
            {copy.landing.finalCtaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">{copy.landing.finalCtaSubtitle}</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="bg-primary hover:bg-[#1E40AF]">
              <Link href="/signup">
                {copy.landing.createAccount}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-card">
              <a href="#sample-leads">{copy.landing.viewSampleLeads}</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
