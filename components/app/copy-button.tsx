"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type CopyButtonProps = {
  text: string;
  label: string;
  copiedLabel: string;
  children?: ReactNode;
};

export function CopyButton({ text, label, copiedLabel, children }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Button type="button" variant="outline" className="bg-background" onClick={handleCopy}>
      {children}
      {copied ? copiedLabel : label}
    </Button>
  );
}
