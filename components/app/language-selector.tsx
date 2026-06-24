"use client";

import { useRouter } from "next/navigation";
import type { Copy, Language } from "@/lib/i18n";
import { Select } from "@/components/ui/select";

export function LanguageSelector({ language, copy }: { language: Language; copy: Copy["common"] }) {
  const router = useRouter();

  function onChange(value: string) {
    document.cookie = `leadsignal_language=${value}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="sr-only">{copy.language}</span>
      <Select aria-label={copy.language} value={language} onChange={(event) => onChange(event.target.value)} className="h-9 w-[118px]">
        <option value="en">{copy.english}</option>
        <option value="es">{copy.spanish}</option>
      </Select>
    </label>
  );
}
