import { createClient, getUser } from "@/lib/supabase/server";
import { NewSearchForm } from "@/components/app/new-search-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewSearchPage() {
  const user = await getUser();
  const supabase = await createClient();
  const { data: profileData } = await supabase.from("profiles").select("credits").eq("id", user!.id).single();
  const profile = profileData as { credits: number } | null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">New search</h1>
        <p className="text-muted-foreground">Find local businesses and analyze the outreach opportunity.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Search criteria</CardTitle>
          <CardDescription>Quantity is capped at 25 for the MVP to keep searches fast.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewSearchForm credits={profile?.credits ?? 0} />
        </CardContent>
      </Card>
    </div>
  );
}
