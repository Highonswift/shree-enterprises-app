import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { isValidPreviewRequest } from "@/lib/storyblok/client";

/**
 * Preview URL for the Storyblok Visual Editor: https://<site>/api/draft?path=
 * Storyblok appends its signed `_storyblok…` parameters. `?disable=1` leaves preview.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const draft = await draftMode();

  if (params.get("disable") === "1") {
    draft.disable();
    redirect("/");
  }
  if (!isValidPreviewRequest(params)) return new Response("Invalid or expired preview link", { status: 401 });

  draft.enable();
  // The site is a single page, so the destination is fixed. The editor bridge needs Storyblok's parameters.
  const forwarded = new URLSearchParams([...params].filter(([key]) => key.startsWith("_storyblok")));
  redirect(`/?${forwarded}`);
}
