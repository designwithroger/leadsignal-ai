import * as cheerio from "cheerio";
import type { WebsiteSignals } from "@/types/database";

const CTA_WORDS = ["book", "call", "contact", "quote", "schedule", "reserve", "buy", "order", "demo", "consulta"];
const SOCIAL_HOSTS = ["facebook.com", "instagram.com", "linkedin.com", "x.com", "twitter.com", "youtube.com", "tiktok.com"];

export async function fetchWebsiteHtml(url?: string | null) {
  if (!url) return "";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "LeadSignalAI/0.1 (+https://leadsignal.ai)"
      }
    });

    if (!response.ok) return "";
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return "";
    return await response.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timeout);
  }
}

export function analyzeWebsite(url: string | null | undefined, html: string): WebsiteSignals {
  const $ = cheerio.load(html || "");
  const bodyText = $("body").text().toLowerCase();
  const links = $("a")
    .map((_, element) => $(element).attr("href") ?? "")
    .get()
    .filter(Boolean);

  const title = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim();
  const h1 = $("h1").first().text().trim();
  const ctaWords = CTA_WORDS.filter((word) => bodyText.includes(word));
  const socialLinks = links.filter((href) => SOCIAL_HOSTS.some((host) => href.includes(host)));

  return {
    hasHttps: Boolean(url?.startsWith("https://")),
    hasTitle: title.length > 0,
    title: title || undefined,
    hasMetaDescription: Boolean(metaDescription),
    metaDescription: metaDescription || undefined,
    hasH1: h1.length > 0,
    h1: h1 || undefined,
    ctaWords,
    hasForm: $("form").length > 0 || $("input").length > 0,
    hasWhatsApp: links.some((href) => href.includes("wa.me") || href.includes("api.whatsapp.com")),
    socialLinks: Array.from(new Set(socialLinks)).slice(0, 8),
    hasGoogleAnalytics: html.includes("gtag(") || html.includes("google-analytics.com") || html.includes("G-"),
    hasMetaPixel: html.includes("fbq(") || html.includes("connect.facebook.net"),
    hasSchemaOrg: html.includes("schema.org") || $('script[type="application/ld+json"]').length > 0
  };
}
