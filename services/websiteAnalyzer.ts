import * as cheerio from "cheerio";
import type { WebsiteSignals } from "@/types/database";

const CTA_WORDS = ["book", "call", "contact", "quote", "schedule", "reserve", "buy", "order", "demo", "consulta", "appointment", "estimate", "apply"];
const SOCIAL_HOSTS = ["facebook.com", "instagram.com", "linkedin.com", "x.com", "twitter.com", "youtube.com", "tiktok.com"];
const BOOKING_HOSTS = ["calendly.com", "acuityscheduling.com", "square.site", "booksy.com", "setmore.com", "appointlet.com", "vagaro.com", "mindbodyonline.com"];
const BOOKING_WORDS = ["book", "booking", "appointment", "schedule", "reserve", "reservation", "cita", "reservar", "agenda"];

export type WebsiteFetchResult = {
  html: string;
  finalUrl?: string;
  status?: number;
  error?: string;
};

export async function fetchWebsiteHtml(url?: string | null): Promise<WebsiteFetchResult> {
  if (!url) return { html: "", error: "No website URL provided." };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const normalizedUrl = normalizeUrl(url);
    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "LeadSignalAI/0.1 (+https://leadsignal.ai)"
      }
    });

    if (!response.ok) {
      return {
        html: "",
        finalUrl: response.url,
        status: response.status,
        error: `Website returned HTTP ${response.status}.`
      };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return {
        html: "",
        finalUrl: response.url,
        status: response.status,
        error: `Website returned non-HTML content: ${contentType || "unknown content type"}.`
      };
    }

    return { html: await response.text(), finalUrl: response.url, status: response.status };
  } catch (error) {
    return {
      html: "",
      error: error instanceof Error && error.name === "AbortError" ? "Website request timed out." : "Website could not be reached."
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function analyzeWebsite(url: string | null | undefined, result: WebsiteFetchResult): WebsiteSignals {
  const html = result.html;
  const $ = cheerio.load(html || "");
  const bodyText = $("body").text().toLowerCase();
  const links = $("a")
    .map((_, element) => $(element).attr("href") ?? "")
    .get()
    .filter(Boolean);

  const title = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim();
  const h1 = $("h1").first().text().trim();
  const lowerLinks = links.map((href) => href.toLowerCase());
  const ctaWords = CTA_WORDS.filter((word) => bodyText.includes(word) || lowerLinks.some((href) => href.includes(word)));
  const socialLinks = links.filter((href) => SOCIAL_HOSTS.some((host) => href.toLowerCase().includes(host)));
  const bookingLinks = links.filter((href) => {
    const lowerHref = href.toLowerCase();
    return BOOKING_HOSTS.some((host) => lowerHref.includes(host)) || BOOKING_WORDS.some((word) => lowerHref.includes(word));
  });
  const hasJsonLd = $('script[type="application/ld+json"]').length > 0;

  return {
    hasWebsite: Boolean(url),
    isReachable: Boolean(html),
    fetchStatus: result.status,
    fetchError: result.error,
    hasHttps: Boolean((result.finalUrl ?? url)?.startsWith("https://")),
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
    hasSchemaOrg: html.includes("schema.org") || hasJsonLd,
    hasJsonLd,
    hasBookingLink: bookingLinks.length > 0,
    bookingLinks: Array.from(new Set(bookingLinks)).slice(0, 8)
  };
}

function normalizeUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}
