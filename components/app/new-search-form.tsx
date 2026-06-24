"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Copy } from "@/lib/i18n";

export function NewSearchForm({ credits, copy }: { credits: number; copy: Copy["search"] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function onSubmit(formData: FormData) {
    setError("");
    const payload = {
      niche: formData.get("niche"),
      city: formData.get("city"),
      country: formData.get("country"),
      quantity: Number(formData.get("quantity")),
      offerType: formData.get("offerType"),
      language: formData.get("language"),
      tone: formData.get("tone")
    };

    startTransition(() => {
      void (async () => {
        const response = await fetch("/api/searches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const json = await response.json();

        if (!response.ok) {
          setError(typeof json.error === "string" ? json.error : copy.formError);
          return;
        }

        router.push(`/dashboard/searches/${json.searchId}`);
        router.refresh();
      })();
    });
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={copy.niche} name="niche" placeholder={copy.nichePlaceholder} />
        <Field label={copy.city} name="city" placeholder="Austin" />
        <Field label={copy.country} name="country" placeholder="United States" defaultValue="United States" />
        <div className="space-y-2">
          <Label htmlFor="quantity">{copy.quantity}</Label>
          <Input id="quantity" name="quantity" type="number" min={1} max={Math.min(25, credits)} defaultValue={Math.min(10, credits)} required />
          <p className="text-xs text-muted-foreground">{credits} {copy.creditsAvailable}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="offerType">{copy.offerType}</Label>
          <Select id="offerType" name="offerType" defaultValue="website_audit">
            <option value="website_audit">{copy.offers.website_audit}</option>
            <option value="seo">{copy.offers.seo}</option>
            <option value="ads">{copy.offers.ads}</option>
            <option value="social_media">{copy.offers.social_media}</option>
            <option value="automation">{copy.offers.automation}</option>
            <option value="custom">{copy.offers.custom}</option>
          </Select>
        </div>
        <Field label={copy.language} name="language" defaultValue="English" />
        <Field label={copy.tone} name="tone" defaultValue="friendly" />
      </div>
      {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      <Button disabled={isPending || credits < 1}>
        <Search className="h-4 w-4" />
        {isPending ? copy.starting : copy.run}
      </Button>
    </form>
  );
}

function Field(props: { label: string; name: string; placeholder?: string; defaultValue?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.name}>{props.label}</Label>
      <Input id={props.name} name={props.name} placeholder={props.placeholder} defaultValue={props.defaultValue} required />
    </div>
  );
}
