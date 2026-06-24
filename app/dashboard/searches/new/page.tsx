import { createClient, getUser } from "@/lib/supabase/server";
import { NewSearchForm } from "@/components/app/new-search-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dictionary, getLanguage } from "@/lib/i18n";

export default async function NewSearchPage() {
  const language = await getLanguage();
  const copy = dictionary[language];
  const user = await getUser();
  const supabase = await createClient();
  const { data: profileData } = await supabase.from("profiles").select("credits").eq("id", user!.id).single();
  const profile = profileData as { credits: number } | null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">{copy.search.title}</h1>
        <p className="text-muted-foreground">{copy.search.subtitle}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{copy.search.cardTitle}</CardTitle>
          <CardDescription>{copy.search.cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <NewSearchForm credits={profile?.credits ?? 0} copy={copy.search} />
        </CardContent>
      </Card>
    </div>
  );
}
