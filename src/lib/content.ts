import type { SiteContent } from "@/types/website";
import data from "./content/site.json";

/** Temporary content source, extracted from the original published page. Phase 4 replaces it with Storyblok. */
export function getContent(): SiteContent {
  return data;
}
