"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const copy = useMemo(() => {
    const isSpanish = document.cookie.includes("leadsignal_language=es");
    return isSpanish
      ? { title: "Algo salió mal", tryAgain: "Intentar de nuevo" }
      : { title: "Something went wrong", tryAgain: "Try again" };
  }, []);

  return (
    <div className="rounded-lg border bg-card p-8">
      <h2 className="text-lg font-semibold">{copy.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Button className="mt-4" onClick={reset}>{copy.tryAgain}</Button>
    </div>
  );
}
