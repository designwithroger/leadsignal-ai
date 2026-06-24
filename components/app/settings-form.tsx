"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/browser";

export function SettingsForm({ profile }: { profile: { id: string; full_name: string | null; company_name: string | null } }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setMessage("");
    startTransition(() => {
      void (async () => {
      const { error } = await createClient()
        .from("profiles")
        .update({
          full_name: String(formData.get("fullName") ?? ""),
          company_name: String(formData.get("companyName") ?? ""),
          updated_at: new Date().toISOString()
        })
        .eq("id", profile.id);

      setMessage(error ? error.message : "Settings saved.");
      })();
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" defaultValue={profile.full_name ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company</Label>
        <Input id="companyName" name="companyName" defaultValue={profile.company_name ?? ""} />
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Button disabled={isPending}>{isPending ? "Saving..." : "Save settings"}</Button>
    </form>
  );
}
