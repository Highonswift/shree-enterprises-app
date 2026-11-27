/** One editable field. `key` is its path in the website content; Storyblok uses the same path with "_" for ".". */
export type FieldDef = { key: string; label: string; hint?: string } & (
  | { type: "text" | "textarea" }
  /** A list of strings, edited as one entry per line (as in the old editor). */
  | { type: "lines" }
  /** An image from Storyblok Assets, delivered no larger than `max` px on its longest side. */
  | { type: "image"; max: number }
  | { type: "link" }
  | { type: "color" }
  /** Optional whole number. */
  | { type: "count" }
  /** Repeatable blocks: editors can add, delete and reorder them. */
  | { type: "list"; of: string }
);

export interface BlockDef {
  name: string;
  displayName: string;
  fields: FieldDef[];
  /** Website sections that editors can hide. */
  hideable?: boolean;
  /** Interface wording: a blank field falls back to the built-in default instead of showing nothing. */
  fallback?: boolean;
}

/** A block as returned by the Storyblok APIs. */
export interface Blok {
  _uid: string;
  component: string;
  /** Present in draft content only; used for click-to-edit. */
  _editable?: string;
  [field: string]: unknown;
}

export interface Story {
  id: number;
  name: string;
  slug: string;
  content: Blok;
}
