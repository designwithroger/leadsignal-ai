import { BarChart3, CheckCircle2, Coins, MessageSquareText, Search } from "lucide-react";
import { NewSearchForm } from "@/components/app/new-search-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dictionary, getLanguage } from "@/lib/i18n";
import { createClient, getUser } from "@/lib/supabase/server";

export default async function NewSearchPage() {
  const language = await getLanguage();
  const copy = dictionary[language];
  const user = await getUser();
  const supabase = await createClient();
  const { data: profileData } = await supabase.from("profiles").select("credits").eq("id", user!.id).single();
  const profile = profileData as { credits: number } | null;

  const previewItems = [
    { icon: Coins, text: copy.search.previewCredits },
    { icon: Search, text: copy.search.previewFind },
    { icon: BarChart3, text: copy.search.previewSignals },
    { icon: MessageSquareText, text: copy.search.previewOpeners }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge className="mb-3 border-accent/30 bg-accent/10 text-accent">{copy.search.eyebrow}</Badge>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">{copy.search.title}</h1>
          <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">{copy.search.subtitle}</p>
        </div>
        <Badge className="w-fit border-primary/20 bg-primary/10 px-3 py-2 text-primary">
          {profile?.credits ?? 0} {copy.common.credits}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <Card className="bg-card shadow-sm">
          <CardHeader>
            <CardTitle>{copy.search.cardTitle}</CardTitle>
            <CardDescription>{copy.search.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <NewSearchForm credits={profile?.credits ?? 0} copy={copy.search} />
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card className="bg-card shadow-sm">
            <CardHeader>
              <CardTitle>{copy.search.previewTitle}</CardTitle>
              <CardDescription>{copy.search.previewDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {previewItems.map((item) => (
                <div key={item.text} className="flex gap-3 rounded-lg border bg-background p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-accent/5 shadow-sm">
            <CardContent className="flex gap-3 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p className="text-sm leading-6 text-muted-foreground">{copy.search.previewTip}</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
