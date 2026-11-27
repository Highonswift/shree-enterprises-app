import { revalidateTag } from "next/cache";
import { CACHE_TAG, isValidWebhook } from "@/lib/storyblok/client";

/** Storyblok webhook (story published, unpublished, moved or deleted): refreshes the live page. */
export async function POST(request: Request) {
  const body = await request.text();
  const secret = new URL(request.url).searchParams.get("secret");
  if (!isValidWebhook(body, request.headers.get("webhook-signature"), secret)) {
    return Response.json({ revalidated: false }, { status: 401 });
  }
  revalidateTag(CACHE_TAG, { expire: 0 });
  return Response.json({ revalidated: true });
}
