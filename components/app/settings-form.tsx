"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/browser";
import type { Copy } from "@/lib/i18n";

export function SettingsForm({
  profile,
  copy
}: {
  profile: { id: string; full_name: string | null; company_name: string | null };
  copy: Copy["settings"];
}) {
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

      setMessage(error ? error.message : copy.saved);
      })();
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">{copy.fullName}</Label>
        <Input id="fullName" name="fullName" defaultValue={profile.full_name ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyName">{copy.company}</Label>
        <Input id="companyName" name="companyName" defaultValue={profile.company_name ?? ""} />
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Button disabled={isPending}>{isPending ? copy.saving : copy.save}</Button>
    </form>
  );
}
