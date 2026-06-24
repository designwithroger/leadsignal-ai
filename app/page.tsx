import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, Mail, Radar, ShieldCheck } from "lucide-react";
import { LanguageSelector } from "@/components/app/language-selector";
import { Button } from "@/components/ui/button";
import { dictionary, getLanguage } from "@/lib/i18n";

export default async function LandingPage() {
  const language = await getLanguage();
  const copy = dictionary[language];
  const features = [
    { Icon: Building2, title: copy.landing.features[0][0], copy: copy.landing.features[0][1] },
    { Icon: Radar, title: copy.landing.features[1][0], copy: copy.landing.features[1][1] },
    { Icon: Mail, title: copy.landing.features[2][0], copy: copy.landing.features[2][1] }
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
            <LanguageSelector language={language} copy={copy.common} />
            <Button asChild variant="ghost">
              <Link href="/login">{copy.nav.signIn}</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">{copy.nav.startFree}</Link>
            </Button>
          </div>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-md border bg-white/70 px-3 py-1 text-sm text-muted-foreground">
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
                <Link href="/login">{copy.landing.openDashboard}</Link>
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
