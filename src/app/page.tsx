import { LivePreview } from "@/components/common/LivePreview";
import { SiteView } from "@/components/layout/SiteView";
import { defaults, getSite } from "@/lib/storyblok/queries";

export default async function Page() {
  const { content, preview } = await getSite();
  return preview ? <LivePreview story={preview} defaults={defaults} /> : <SiteView content={content} />;
}
