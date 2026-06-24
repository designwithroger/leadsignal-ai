import type { WebsiteSignals } from "@/types/database";

export function scoreOpportunity(signals: WebsiteSignals, hasWebsite: boolean) {
  let score = 35;

  if (!hasWebsite) score += 35;
  if (hasWebsite && !signals.isReachable) score += 30;
  if (hasWebsite && !signals.hasHttps) score += 8;
  if (!signals.hasTitle) score += 8;
  if (!signals.hasMetaDescription) score += 8;
  if (!signals.hasH1) score += 7;
  if (signals.ctaWords.length === 0) score += 8;
  if (!signals.hasForm && !signals.hasWhatsApp) score += 10;
  if (signals.socialLinks.length === 0) score += 5;
  if (!signals.hasGoogleAnalytics) score += 4;
  if (!signals.hasMetaPixel) score += 4;
  if (!signals.hasSchemaOrg) score += 3;
  if (!signals.hasBookingLink) score += 3;

  return Math.max(0, Math.min(100, score));
}
