// Pure builders: Storyblok component definitions, and starting story content from the local website content.
import { randomUUID } from "node:crypto";
import { BLOCKS, PROMO_COLORS, ROOT, SECTION_LINKS, SECTIONS, storyblokName } from "../src/lib/storyblok/components.ts";
import type { Blok, FieldDef } from "../src/lib/storyblok/types.ts";

const options = (entries: [value: string, name: string][]) => entries.map(([value, name]) => ({ _uid: randomUUID(), name, value }));

function schemaField(field: FieldDef, pos: number): Record<string, unknown> {
  const base = { pos, display_name: field.label, ...(field.hint && { description: field.hint }) };
  switch (field.type) {
    case "image": return { ...base, type: "asset", filetypes: ["images"] };
    case "link": return { ...base, type: "option", options: options(SECTION_LINKS) };
    case "color": return { ...base, type: "option", options: options(PROMO_COLORS.map(([value, name]) => [value, name])) };
    case "list": return { ...base, type: "bloks", restrict_components: true, component_whitelist: [field.of] };
    case "lines": return { ...base, type: "textarea" };
    case "count": return { ...base, type: "text" };
    default: return { ...base, type: field.type };
  }
}

export function componentDefinitions() {
  const nestable = BLOCKS.map((block) => {
    const fields: [string, Record<string, unknown>][] = block.fields.map((f, i) => [storyblokName(f.key), schemaField(f, i)]);
    if (block.fields.some((f) => f.type === "color")) {
      fields.push(["custom_color", { type: "text", pos: fields.length, display_name: "Custom colour (optional)", description: "Like #123B5D. Overrides the theme colour. Keep it dark: the banner text is white." }]);
    }
    if (block.hideable) fields.unshift(["hidden", { type: "boolean", pos: -1, display_name: "Hide this section" }]);
    return { name: block.name, display_name: block.displayName, is_root: false, is_nestable: true, schema: Object.fromEntries(fields) };
  });
  const root = {
    name: ROOT, display_name: "Website page", is_root: true, is_nestable: false,
    // One block per section, in a fixed order: editors can hide sections but not reorder them.
    schema: Object.fromEntries(SECTIONS.map(([key, component, label], pos) =>
      [key, { type: "bloks", pos, display_name: label, restrict_components: true, component_whitelist: [component], maximum: 1 }])),
  };
  return [...nestable, root];
}

/** @param assetUrl resolves a local image path to its uploaded URL, or "" if the file is unavailable. */
export function storyContent(content: unknown, assetUrl: (path: string) => string): Blok {
  const get = (source: unknown, key: string) => key.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], source);

  const toBlok = (source: unknown, name: string): Blok => {
    const def = BLOCKS.find((block) => block.name === name);
    if (!def) throw new Error(`Unknown block ${name}`);
    const blok: Blok = { _uid: randomUUID(), component: name };
    for (const field of def.fields) {
      const value = get(source, field.key);
      const target = storyblokName(field.key);
      if (field.type === "list") blok[target] = ((value as unknown[]) ?? []).map((item) => toBlok(item, field.of));
      else if (field.type === "lines") blok[target] = ((value as string[]) ?? []).join("\n");
      else if (field.type === "image") {
        const url = value ? assetUrl(String(value)) : "";
        blok[target] = { fieldtype: "asset", filename: url, alt: "" };
      } else if (field.type === "color") {
        const preset = PROMO_COLORS.find(([, , css]) => css === value);
        blok[target] = preset?.[0] ?? PROMO_COLORS[0][0];
        blok.custom_color = preset ? "" : String(value ?? "");
      } else blok[target] = value === undefined ? "" : String(value);
    }
    if (def.hideable) blok.hidden = get(source, "hidden") === true;
    return blok;
  };

  const root: Blok = { _uid: randomUUID(), component: ROOT };
  for (const [key, component] of SECTIONS) root[key] = [toBlok(get(content, key), component)];
  return root;
}
