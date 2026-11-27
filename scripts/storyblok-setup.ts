// Creates the content model and the starting page in a Storyblok space.
//
//   npm run storyblok:setup                          preview only: no network requests
//   npm run storyblok:setup -- --apply               create components, upload images, create the page as a DRAFT
//   npm run storyblok:setup -- --apply --update-components   also overwrite same-named components
//
// It never changes an existing page and never publishes. Needs STORYBLOK_SPACE_ID and
// STORYBLOK_MANAGEMENT_TOKEN in .env.local (setup only: do not add the management token to Vercel).
import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { componentDefinitions, storyContent } from "./storyblok-model.ts";

const apply = process.argv.includes("--apply");
const updateComponents = process.argv.includes("--update-components");
const root = join(import.meta.dirname, "..");
if (existsSync(join(root, ".env.local"))) process.loadEnvFile(join(root, ".env.local"));

const content = JSON.parse(readFileSync(join(root, "src/lib/content/site.json"), "utf8"));
const slug = process.env.STORYBLOK_STORY_SLUG || "site";
const components = componentDefinitions();

const imagePaths = new Set<string>();
storyContent(content, (path) => { imagePaths.add(path); return ""; });
const available = [...imagePaths].filter((path) => existsSync(join(root, "public", path)));
const missing = [...imagePaths].filter((path) => !available.includes(path));

console.log(`Components: ${components.length}\nImages to upload: ${available.length}`);
console.log(`Images missing (their fields stay empty): ${missing.map((p) => basename(p)).join(", ") || "none"}`);
console.log(`Page: "${slug}", created as an unpublished draft`);
if (!apply) {
  console.log("\nPreview only. Nothing was sent. Add --apply to make these changes.");
  process.exit(0);
}

const HOSTS: Record<string, string> = {
  eu: "https://mapi.storyblok.com", us: "https://api-us.storyblok.com", ca: "https://api-ca.storyblok.com",
  ap: "https://api-ap.storyblok.com", cn: "https://app.storyblokchina.cn",
};
const { STORYBLOK_SPACE_ID: space, STORYBLOK_MANAGEMENT_TOKEN: token } = process.env;
const host = HOSTS[process.env.STORYBLOK_REGION || "eu"];
if (!space || !token || !host) {
  console.error("\nSet STORYBLOK_SPACE_ID, STORYBLOK_MANAGEMENT_TOKEN and a valid STORYBLOK_REGION in .env.local");
  process.exit(1);
}

async function api<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 350)); // stay under the API rate limit
  const response = await fetch(`${host}/v1/spaces/${space}${path}`, {
    method, headers: { Authorization: token as string, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`${method} ${path} failed: ${response.status} ${await response.text()}`);
  return (await response.json()) as T;
}

/** Pixel size of a JPEG, which Storyblok records in the asset URL. */
function jpegSize(data: Buffer) {
  for (let i = 2; i < data.length - 9; i += 2 + data.readUInt16BE(i + 2)) {
    const marker = data[i + 1];
    if (marker >= 0xc0 && marker <= 0xc3) return `${data.readUInt16BE(i + 7)}x${data.readUInt16BE(i + 5)}`;
  }
  return undefined;
}

async function upload(path: string) {
  const data = readFileSync(join(root, "public", path));
  const signed = await api<{ post_url: string; pretty_url?: string; fields: Record<string, string> }>(
    "/assets/", "POST", { filename: basename(path), size: jpegSize(data) });
  const form = new FormData();
  for (const [key, value] of Object.entries(signed.fields)) form.append(key, value);
  form.append("file", new Blob([new Uint8Array(data)], { type: "image/jpeg" }), basename(path));
  const response = await fetch(signed.post_url, { method: "POST", body: form });
  if (!response.ok) throw new Error(`Upload of ${path} failed: ${response.status}`);
  const bucket = new URL(signed.post_url).pathname.replaceAll("/", "") || "a.storyblok.com";
  if (signed.pretty_url) return signed.pretty_url.startsWith("//") ? `https:${signed.pretty_url}` : signed.pretty_url;
  return `https://${bucket}/${signed.fields.key}`;
}

// Check for clashes before writing anything.
const existing = (await api<{ components: { id: number; name: string }[] }>("/components/")).components;
const clashes = components.filter((c) => existing.some((e) => e.name === c.name));
const pageExists = (await api<{ stories: unknown[] }>(`/stories?by_slugs=${encodeURIComponent(slug)}`)).stories.length > 0;

for (const component of components) {
  const match = existing.find((e) => e.name === component.name);
  if (!match) await api("/components/", "POST", { component });
  else if (updateComponents) await api(`/components/${match.id}`, "PUT", { component });
}
console.log(`\nComponents: ${components.length - clashes.length} created, ${clashes.length} already existed (${updateComponents ? "updated" : "left unchanged"})`);

if (pageExists) {
  console.log(`The page "${slug}" already exists. Its content and the image library were not changed.`);
} else {
  const urls = new Map<string, string>();
  for (const path of available) urls.set(path, await upload(path));
  console.log(`Images uploaded: ${urls.size}`);
  await api("/stories", "POST", {
    story: { name: "Website", slug, content: storyContent(content, (path) => urls.get(path) ?? "") },
    publish: false,
  });
  console.log(`Page "${slug}" created as a draft. Review it in Storyblok and publish when ready.`);
}
