import { createClient, getUser } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/app/settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dictionary, getLanguage } from "@/lib/i18n";
import type { Profile } from "@/types/database";

type CustomerAccount = {
  plan_key: string;
  subscription_status: string;
};

export default async function SettingsPage() {
  const language = await getLanguage();
  const copy = dictionary[language];
  const user = await getUser();
  const supabase = await createClient();
  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const { data: customerData } = await supabase.from("customer_accounts").select("*").eq("user_id", user!.id).single();
  const profile = profileData as Profile | null;
  const customer = customerData as CustomerAccount | null;

  if (!profile) return <div className="rounded-lg border bg-card p-8">{copy.settings.profileNotFound}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">{copy.settings.title}</h1>
        <p className="text-muted-foreground">{copy.settings.subtitle}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>{copy.settings.profile}</CardTitle>
            <CardDescription>{copy.settings.profileDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm profile={profile} copy={copy.settings} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{copy.settings.billing}</CardTitle>
            <CardDescription>{copy.settings.billingDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">{copy.settings.plan}</span>
              <span>{customer?.plan_key ?? "free"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">{copy.settings.status}</span>
              <span>{customer?.subscription_status ?? "free"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{copy.settings.credits}</span>
              <span>{profile.credits}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
