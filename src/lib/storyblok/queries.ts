import "server-only";
import { draftMode } from "next/headers";
import { cache } from "react";
import type { SiteContent } from "@/types/website";
import localContent from "../content/site.json";
import { fetchStory, isConfigured } from "./client";
import { storyToContent } from "./mapper";
import type { Story } from "./types";

export interface Site {
  content: SiteContent;
  /** Set only in draft preview, where the browser needs the story for live editing. */
  preview?: Story;
}

export const defaults: Pick<SiteContent, "form" | "ui"> = { form: localContent.form, ui: localContent.ui };

export const getSite = cache(async (): Promise<Site> => {
  if (!isConfigured()) {
    // Storyblok is the content source. The local file is for development before it is connected.
    if (process.env.VERCEL_ENV === "production") throw new Error("Storyblok is not configured for this production deployment");
    return { content: localContent };
  }
  const { isEnabled } = await draftMode();
  const story = await fetchStory(isEnabled ? "draft" : "published");
  return { content: storyToContent(story.content, defaults), preview: isEnabled ? story : undefined };
});
