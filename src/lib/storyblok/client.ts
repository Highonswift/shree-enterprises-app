// Server only: this module reads the Storyblok access tokens.
import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { Story } from "./types";

export const CACHE_TAG = "storyblok";

const API_HOSTS: Record<string, string> = {
  eu: "https://api.storyblok.com",
  us: "https://api-us.storyblok.com",
  ca: "https://api-ca.storyblok.com",
  ap: "https://api-ap.storyblok.com",
  cn: "https://app.storyblokchina.cn",
};

export const storySlug = () => process.env.STORYBLOK_STORY_SLUG || "site";
export const isConfigured = () => Boolean(process.env.STORYBLOK_PUBLIC_TOKEN || process.env.STORYBLOK_PREVIEW_TOKEN);

export async function fetchStory(version: "draft" | "published"): Promise<Story> {
  const draft = version === "draft";
  const name = draft ? "STORYBLOK_PREVIEW_TOKEN" : "STORYBLOK_PUBLIC_TOKEN";
  const token = process.env[name];
  if (!token) throw new Error(`${name} is not set`);
  const region = process.env.STORYBLOK_REGION || "eu";
  const host = API_HOSTS[region];
  if (!host) throw new Error(`STORYBLOK_REGION must be one of: ${Object.keys(API_HOSTS).join(", ")}`);

  const query = new URLSearchParams({ version, token });
  const response = await fetch(`${host}/v2/cdn/stories/${storySlug()}?${query}`, draft
    ? { cache: "no-store" }
    // Refreshed immediately by the publish webhook, and hourly in case a webhook is missed.
    : { next: { tags: [CACHE_TAG], revalidate: 3600 } });
  // Never include the request URL in errors: it contains the token.
  if (!response.ok) throw new Error(`Storyblok returned ${response.status} for the ${version} story "${storySlug()}"`);
  return ((await response.json()) as { story: Story }).story;
}

const safeEqual = (a: string, b: string) => {
  const [x, y] = [Buffer.from(a), Buffer.from(b)];
  return x.length === y.length && timingSafeEqual(x, y);
};

/** Checks that a preview request really comes from the Storyblok Visual Editor, within the last hour. */
export function isValidPreviewRequest(params: URLSearchParams, now = Math.floor(Date.now() / 1000)) {
  const previewToken = process.env.STORYBLOK_PREVIEW_TOKEN;
  const space = params.get("_storyblok_tk[space_id]");
  const timestamp = params.get("_storyblok_tk[timestamp]");
  const token = params.get("_storyblok_tk[token]");
  if (!previewToken || !space || !timestamp || !token) return false;
  const expectedSpace = process.env.STORYBLOK_SPACE_ID;
  if (expectedSpace && space !== expectedSpace) return false;
  const age = now - Number(timestamp);
  if (!(age >= -60 && age < 3600)) return false;
  return safeEqual(createHash("sha1").update(`${space}:${previewToken}:${timestamp}`).digest("hex"), token);
}

/**
 * Paid Storyblok plans sign webhooks (`webhook-signature`, HMAC-SHA1 of the raw body).
 * Free plans cannot, so there the same secret may be given as `?secret=` in the webhook URL.
 */
export function isValidWebhook(body: string, signature: string | null, querySecret: string | null) {
  const secret = process.env.STORYBLOK_WEBHOOK_SECRET;
  if (!secret) return false;
  if (signature !== null) return safeEqual(createHmac("sha1", secret).update(body).digest("hex"), signature);
  return querySecret !== null && safeEqual(secret, querySecret);
}
