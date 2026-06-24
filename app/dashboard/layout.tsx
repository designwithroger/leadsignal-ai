import Link from "next/link";
import { BarChart3, Plus, Radar, Settings } from "lucide-react";
import { SignOutButton } from "@/components/app/sign-out-button";
import { createClient, getUser } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const supabase = await createClient();
  const { data: profileData } = user
    ? await supabase.from("profiles").select("credits").eq("id", user.id).single()
    : { data: null };
  const profile = profileData as { credits: number } | null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Radar className="h-4 w-4" />
            </span>
            LeadSignal AI
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-md border bg-card px-3 py-2 text-sm sm:inline-flex">
              {profile?.credits ?? 0} credits
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
          <nav className="grid gap-1 rounded-lg border bg-card p-2">
            <NavItem href="/dashboard" icon={<BarChart3 className="h-4 w-4" />} label="Dashboard" />
            <NavItem href="/dashboard/new-search" icon={<Plus className="h-4 w-4" />} label="New search" />
            <NavItem href="/dashboard/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted">
      {icon}
      {label}
    </Link>
  );
}
