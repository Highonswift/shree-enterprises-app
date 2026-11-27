// Storyblok story content -> website content. Used on the server and by the live preview in the browser.
import { editableAttributes } from "@storyblok/preview-bridge";
import type { SiteContent } from "../../types/website";
import { BLOCKS, PROMO_COLORS, SECTIONS, storyblokName } from "./components.ts";
import type { Blok, FieldDef } from "./types";

type Data = Record<string, unknown>;
const blockDefs = new Map(BLOCKS.map((block) => [block.name, block]));

const str = (value: unknown) => (typeof value === "string" ? value : "");
const isBlok = (value: unknown): value is Blok => typeof value === "object" && value !== null && "component" in value;
const bloks = (value: unknown) => (Array.isArray(value) ? value.filter(isBlok) : []);
const getPath = (source: unknown, key: string) => key.split(".").reduce<unknown>((o, k) => (o as Data | undefined)?.[k], source);

function setPath(target: Data, key: string, value: unknown) {
  const path = key.split(".");
  const last = path.pop() as string;
  const parent = path.reduce<Data>((o, k) => (o[k] ??= {}) as Data, target);
  parent[last] = value;
}

/** Only in-page anchors and ordinary web, mail and phone links are allowed. */
const safeLink = (value: string) => (/^(#|\/(?!\/)|https?:\/\/|mailto:|tel:)/i.test(value) ? value : "#");

/** Shrinks large Storyblok images (like the old editor did on upload) without ever enlarging one. */
export function sizedImage(url: string, max: number) {
  const size = /^https:\/\/a[a-z0-9-]*\.storyblok\.com\/f\/\d+\/(\d+)x(\d+)\//.exec(url);
  if (!size || /\.svg$/i.test(url)) return url;
  const [width, height] = [Number(size[1]), Number(size[2])];
  if (Math.max(width, height) <= max) return url;
  return `${url}/m/${width >= height ? `${max}x0` : `0x${max}`}`;
}

function readField(blok: Blok | undefined, field: FieldDef, fallback: unknown): unknown {
  const raw = blok?.[storyblokName(field.key)];
  switch (field.type) {
    case "lines": {
      const values = str(raw).split("\n").map((line) => line.trim()).filter(Boolean);
      return values.length || !Array.isArray(fallback) ? values : fallback;
    }
    case "image":
      return sizedImage(str((raw as Data | undefined)?.filename), field.max);
    case "link":
      return safeLink(str(raw));
    case "color": {
      const custom = str(blok?.custom_color).trim();
      if (/^#[0-9a-f]{6}$/i.test(custom)) return custom;
      return (PROMO_COLORS.find(([value]) => value === raw) ?? PROMO_COLORS[0])[2];
    }
    case "count":
      return /^\d+$/.test(str(raw).trim()) ? Number(str(raw)) : undefined;
    case "list":
      return bloks(raw).filter((item) => item.component === field.of).map((item) => readBlock(item, field.of));
    default:
      return str(raw) || (typeof fallback === "string" ? fallback : "");
  }
}

function readBlock(blok: Blok | undefined, name: string, defaults?: unknown): Data {
  const def = blockDefs.get(name);
  if (!def) throw new Error(`Unknown content block: ${name}`);
  const result: Data = {};
  for (const field of def.fields) {
    const value = readField(blok, field, def.fallback ? getPath(defaults, field.key) : undefined);
    if (value !== undefined) setPath(result, field.key, value);
  }
  if (blok?._editable) result.edit = editableAttributes(blok);
  // A deleted section block hides the section.
  if (def.hideable && (!blok || blok.hidden === true)) result.hidden = true;
  return result;
}

/**
 * @param root     the story's `content`
 * @param defaults supplies interface wording for blank form and label fields only
 */
export function storyToContent(root: Blok, defaults: Pick<SiteContent, "form" | "ui">): SiteContent {
  const entries = SECTIONS.map(([key, component]) => {
    const blok = bloks(root[key]).find((item) => item.component === component);
    return [key, readBlock(blok, component, (defaults as Data)[key])];
  });
  return Object.fromEntries(entries) as unknown as SiteContent;
}
