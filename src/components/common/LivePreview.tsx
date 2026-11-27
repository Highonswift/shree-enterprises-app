"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteView } from "@/components/layout/SiteView";
import { storyToContent } from "@/lib/storyblok/mapper";
import type { Story } from "@/lib/storyblok/types";
import type { SiteContent } from "@/types/website";

interface Props { story: Story; defaults: Pick<SiteContent, "form" | "ui"> }

/** Draft preview inside the Storyblok Visual Editor: shows edits as they are typed. */
export function LivePreview({ story, defaults }: Props) {
  const router = useRouter();
  const [edited, setEdited] = useState({ source: story, content: story.content });
  // After a refresh the server sends a newer story, which replaces local edits.
  const root = edited.source === story ? edited.content : story.content;

  useEffect(() => {
    let destroy = () => {};
    let cancelled = false;
    import("@storyblok/preview-bridge").then(({ default: Bridge }) => {
      if (cancelled) return;
      const bridge = new Bridge();
      bridge.on("input", (event) => {
        const next = event.story as unknown as Story;
        if (next.id === story.id) setEdited({ source: story, content: next.content });
      });
      bridge.on(["change", "published", "unpublished"], () => router.refresh());
      destroy = () => bridge.destroy();
    });
    return () => { cancelled = true; destroy(); };
  }, [story, router]);

  return <SiteView content={storyToContent(root, defaults)} />;
}
