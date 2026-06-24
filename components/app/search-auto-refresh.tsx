"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SearchStatus } from "@/types/database";

export function SearchAutoRefresh({ status }: { status: SearchStatus }) {
  const router = useRouter();

  useEffect(() => {
    if (status !== "queued" && status !== "running") return;

    const interval = window.setInterval(() => {
      router.refresh();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [router, status]);

  return null;
}
