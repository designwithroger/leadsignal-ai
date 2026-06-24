"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Copy } from "@/lib/i18n";

export function AuthForm({
  mode,
  copy,
  commonCopy
}: {
  mode: "login" | "signup";
  copy: Copy["auth"];
  commonCopy: Copy["common"];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setError("");
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const supabase = createClient();

    startTransition(() => {
      void (async () => {
      const next = searchParams.get("next") ?? "/dashboard";
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
              }
            });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      router.push(next);
      router.refresh();
      })();
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{copy.email}</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{copy.password}</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" minLength={8} required />
      </div>
      {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      <Button className="w-full" disabled={isPending}>
        {isPending ? commonCopy.loading : mode === "login" ? copy.signIn : copy.createAccount}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? copy.newUser : copy.existingUser}{" "}
        <Link className="font-medium text-primary" href={mode === "login" ? "/signup" : "/login"}>
          {mode === "login" ? copy.createAccount : copy.signIn}
        </Link>
      </p>
    </form>
  );
}
