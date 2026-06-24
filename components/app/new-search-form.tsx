"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function NewSearchForm({ credits }: { credits: number }) {
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
        setError(typeof json.error === "string" ? json.error : "Please check the form and try again.");
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
        <Field label="Niche" name="niche" placeholder="Dentists, med spas, roofers" />
        <Field label="City" name="city" placeholder="Austin" />
        <Field label="Country" name="country" placeholder="United States" defaultValue="United States" />
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" min={1} max={Math.min(25, credits)} defaultValue={Math.min(10, credits)} required />
          <p className="text-xs text-muted-foreground">{credits} credits available. Each analyzed lead costs 1 credit.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="offerType">Offer type</Label>
          <Select id="offerType" name="offerType" defaultValue="website_audit">
            <option value="website_audit">Website audit</option>
            <option value="seo">SEO</option>
            <option value="ads">Paid ads</option>
            <option value="social_media">Social media</option>
            <option value="automation">Automation</option>
            <option value="custom">Custom</option>
          </Select>
        </div>
        <Field label="Language" name="language" defaultValue="English" />
        <Field label="Tone" name="tone" defaultValue="friendly" />
      </div>
      {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      <Button disabled={isPending || credits < 1}>
        <Search className="h-4 w-4" />
        {isPending ? "Finding and analyzing leads..." : "Run search"}
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
