import Link from "next/link";
import { BarChart3, Download, ListChecks, Plus, Radar, Search, Settings, Users } from "lucide-react";
import { AccountMenu } from "@/components/app/account-menu";
import { LanguageSelector } from "@/components/app/language-selector";
import { Badge } from "@/components/ui/badge";
import { createClient, getUser } from "@/lib/supabase/server";
import { dictionary, getLanguage } from "@/lib/i18n";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const language = await getLanguage();
  const copy = dictionary[language];
  const user = await getUser();
  const supabase = await createClient();
  const { data: profileData } = user
    ? await supabase.from("profiles").select("credits").eq("id", user.id).single()
    : { data: null };
  const profile = profileData as { credits: number } | null;

  const navItems = [
    { href: "/dashboard", label: copy.nav.dashboard, icon: BarChart3 },
    { href: "/dashboard/searches", label: copy.nav.searches, icon: Search },
    { href: "/dashboard/searches/new", label: copy.nav.newSearch, icon: Plus },
    { href: "/dashboard/leads", label: copy.nav.leads, icon: Users },
    { href: "/dashboard/exports", label: copy.nav.exports, icon: Download },
    { href: "/dashboard/settings", label: copy.nav.settings, icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b px-5 py-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Radar className="h-4 w-4" />
              </span>
              LeadSignal AI
            </Link>
          </div>
          <nav className="grid gap-1 p-3">
            {navItems.map((item) => (
              <NavItem key={item.href} href={item.href} icon={<item.icon className="h-4 w-4" />} label={item.label} />
            ))}
          </nav>
          <div className="mt-auto border-t p-4">
            <div className="rounded-lg border bg-background p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">{copy.dashboard.creditsRemaining}</span>
                <Badge>{profile?.credits ?? 0}</Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{copy.dashboard.creditsNote}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold lg:hidden">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Radar className="h-4 w-4" />
                </span>
                LeadSignal AI
              </Link>
              <ButtonLink href="/dashboard/searches/new" label={copy.nav.newSearch} />
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector language={language} copy={copy.common} />
              <Badge className="hidden bg-card px-3 py-2 text-sm sm:inline-flex">
                {profile?.credits ?? 0} {copy.common.credits}
              </Badge>
              <AccountMenu
                email={user?.email}
                accountLabel={copy.dashboard.account}
                settingsLabel={copy.nav.settings}
                signOutLabel={copy.nav.signOut}
                menuLabel={copy.dashboard.accountMenu}
              />
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t px-4 py-2 lg:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">{children}</main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
      {icon}
      {label}
    </Link>
  );
}

function ButtonLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="hidden h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:inline-flex">
      <Plus className="h-4 w-4" />
      {label}
    </Link>
  );
}
