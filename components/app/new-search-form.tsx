"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { Copy } from "@/lib/i18n";

type FieldErrors = Partial<Record<"niche" | "city" | "country" | "quantity", string>>;

export function NewSearchForm({ credits, copy }: { credits: number; copy: Copy["search"] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPending, startTransition] = useTransition();
  const quantityMax = Math.max(1, Math.min(25, credits));

  async function onSubmit(formData: FormData) {
    setError("");
    setDraftSaved(false);

    const payload = {
      niche: String(formData.get("niche") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      country: String(formData.get("country") ?? "").trim(),
      quantity: Number(formData.get("quantity")),
      offerType: formData.get("offerType"),
      language: formData.get("language"),
      tone: formData.get("tone")
    };

    const validationErrors = validatePayload(payload, credits, copy);
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setError(copy.formError);
      return;
    }

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

  function saveDraft() {
    setError("");
    setDraftSaved(true);
  }

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={copy.niche} name="niche" placeholder={copy.nichePlaceholder} error={fieldErrors.niche} />
        <Field label={copy.city} name="city" placeholder="Miami" error={fieldErrors.city} />
        <Field label={copy.country} name="country" placeholder="United States" defaultValue="United States" error={fieldErrors.country} />
        <div className="space-y-2">
          <Label htmlFor="quantity">{copy.quantity}</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            max={quantityMax}
            defaultValue={Math.min(10, quantityMax)}
            aria-invalid={Boolean(fieldErrors.quantity)}
            required
          />
          <p className={fieldErrors.quantity ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
            {fieldErrors.quantity ?? `${credits} ${copy.creditsAvailable}`}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="offerType">{copy.offerType}</Label>
          <Select id="offerType" name="offerType" defaultValue="website_audit">
            <option value="website_audit">{copy.offers.website_redesign}</option>
            <option value="seo">{copy.offers.seo}</option>
            <option value="ads">{copy.offers.google_ads}</option>
            <option value="ads">{copy.offers.meta_ads}</option>
            <option value="custom">{copy.offers.branding}</option>
            <option value="social_media">{copy.offers.social_media}</option>
            <option value="automation">{copy.offers.automation}</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">{copy.language}</Label>
          <Select id="language" name="language" defaultValue="English">
            <option value="English">English</option>
            <option value="Español">Español</option>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tone">{copy.tone}</Label>
          <Select id="tone" name="tone" defaultValue="Professional">
            <option value="Professional">{copy.tones.professional}</option>
            <option value="Friendly">{copy.tones.friendly}</option>
            <option value="Direct">{copy.tones.direct}</option>
            <option value="Premium">{copy.tones.premium}</option>
          </Select>
        </div>
      </div>

      {error ? <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
      {draftSaved ? <p className="rounded-md border border-accent/30 bg-accent/10 p-3 text-sm text-accent">{copy.draftSaved}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button className="bg-primary shadow-sm hover:bg-[#1E40AF]" disabled={isPending || credits < 1}>
          <Search className="h-4 w-4" />
          {isPending ? copy.starting : copy.run}
        </Button>
        <Button type="button" variant="outline" className="bg-background" onClick={saveDraft} disabled={isPending}>
          <Save className="h-4 w-4" />
          {copy.saveDraft}
        </Button>
      </div>
    </form>
  );
}

function Field(props: { label: string; name: string; placeholder?: string; defaultValue?: string; error?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.name}>{props.label}</Label>
      <Input
        id={props.name}
        name={props.name}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        aria-invalid={Boolean(props.error)}
        required
      />
      {props.error ? <p className="text-xs text-destructive">{props.error}</p> : null}
    </div>
  );
}

function validatePayload(
  payload: { niche: string; city: string; country: string; quantity: number },
  credits: number,
  copy: Copy["search"]
) {
  const errors: FieldErrors = {};
  if (payload.niche.length < 2) errors.niche = copy.requiredField;
  if (payload.city.length < 2) errors.city = copy.requiredField;
  if (payload.country.length < 2) errors.country = copy.requiredField;
  if (!Number.isInteger(payload.quantity) || payload.quantity < 1) errors.quantity = copy.quantityMinError;
  if (payload.quantity > 25) errors.quantity = copy.quantityMaxError;
  if (payload.quantity > credits) errors.quantity = copy.quantityCreditError;
  return errors;
}
