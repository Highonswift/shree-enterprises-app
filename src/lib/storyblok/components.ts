// The Storyblok content model. This file creates the components in Storyblok (scripts/storyblok-setup.ts)
// and reads their content back (mapper.ts). It must only use type imports, so Node can run it directly.
import type { BlockDef, FieldDef } from "./types";

type Extra = { hint?: string };
const text = (key: string, label: string, extra?: Extra): FieldDef => ({ key, label, type: "text", ...extra });
const area = (key: string, label: string, extra?: Extra): FieldDef => ({ key, label, type: "textarea", ...extra });
const lines = (key: string, label: string, hint = "One per line"): FieldDef => ({ key, label, type: "lines", hint });
const image = (key: string, label: string, max: number, hint?: string): FieldDef => ({ key, label, type: "image", max, hint });
const list = (key: string, label: string, of: string): FieldDef => ({ key, label, type: "list", of });
const link = (key: string, label: string): FieldDef => ({ key, label, type: "link" });
const texts = (prefix: string, entries: [string, string][]) => entries.map(([key, label]) => text(`${prefix}${key}`, label));

export const ROOT = "shree_site";

/** Link choices offered to editors: the page's own sections. */
export const SECTION_LINKS: [value: string, label: string][] = [
  ["#home", "Top of page"], ["#capabilities", "Capabilities"], ["#fishmeal", "Fish Meal EPC"], ["#models", "Plant Models"],
  ["#execution", "How We Execute"], ["#products", "Products"], ["#clients", "Clients"], ["#contact", "Contact form"],
];

/** Banner colours come from the theme, so changing globals.css updates them too. */
export const PROMO_COLORS: [value: string, label: string, css: string][] = [
  ["epc", "EPC banner (theme)", "var(--color-promo-epc)"],
  ["water", "Water banner (theme)", "var(--color-promo-water)"],
  ["primary", "Primary navy (theme)", "var(--color-primary)"],
];

/** Page sections in their fixed display order. */
export const SECTIONS: [key: string, component: string, label: string][] = [
  ["brand", "shree_header", "Header"], ["hero", "shree_hero", "Hero"], ["ticker", "shree_ticker", "Scrolling strip"],
  ["promos", "shree_promos", "Promo banners"], ["capabilities", "shree_capabilities", "Capabilities"],
  ["fishmeal", "shree_fishmeal", "Fish Meal EPC"], ["models", "shree_models", "Plant Models"],
  ["method", "shree_method", "How We Execute"], ["products", "shree_products", "Products"],
  ["clients", "shree_clients", "Clients"], ["contact", "shree_contact", "Contact details"], ["footer", "shree_footer", "Footer"],
  ["seo", "shree_seo", "Search & social sharing"], ["form", "shree_form", "Enquiry form wording"], ["ui", "shree_ui", "Buttons & labels"],
];

const FILTER_HINT = "Used only while no entry has a category. Once entries have categories, filters are built from them.";

export const BLOCKS: BlockDef[] = [
  { name: "shree_header", displayName: "Header", fields: [
    text("name", "Logo word"), text("suffix", "Logo second word"), text("phone", "Phone shown in the header"),
    text("ctaLabel", "Header button text"), text("pageTitle", "Browser tab title"),
  ] },
  { name: "shree_hero", displayName: "Hero", hideable: true, fields: [
    text("greeting", "Greeting"), text("greetingHighlight", "Greeting – highlighted word"), area("title", "Headline"),
    area("subtitle", "Description"), image("image", "Background photo", 1800, "Wide landscape photo, at least 1600 px wide"),
    lines("promptsEPC", "Typing examples – EPC"), lines("promptsWater", "Typing examples – Water"),
  ] },
  { name: "shree_ticker", displayName: "Scrolling strip", hideable: true, fields: [lines("items", "Items")] },
  { name: "shree_promos", displayName: "Promo banners", hideable: true, fields: [list("items", "Banners", "shree_promo")] },
  { name: "shree_promo", displayName: "Banner", fields: [
    text("tag", "Small label"), text("title", "Title"), area("text", "Description"), text("button", "Button text"),
    link("link", "Button goes to"), image("image", "Photo", 1400), { key: "color", label: "Banner colour", type: "color" },
  ] },
  { name: "shree_capabilities", displayName: "Capabilities", hideable: true, fields: [
    text("title", "Section title"), area("subtitle", "Subtitle"), list("groups", "Tabs", "shree_capability_group"),
  ] },
  { name: "shree_capability_group", displayName: "Capability tab", fields: [text("name", "Tab name"), list("items", "Cards", "shree_capability")] },
  { name: "shree_capability", displayName: "Capability card", fields: [
    text("number", "Card number", { hint: "Optional, e.g. 01" }), text("title", "Title"), area("text", "Description"),
  ] },
  { name: "shree_fishmeal", displayName: "Fish Meal EPC", hideable: true, fields: [
    text("kicker", "Small label"), text("title", "Title"), area("text", "Description"), image("image", "Plant image", 1800),
    area("caption", "Image caption"), text("button", "Button text"), list("stats", "Statistics", "shree_stat"),
    text("flowTitle", "Process flow heading"), lines("flow", "Process flow steps", "One per line, in order"),
  ] },
  { name: "shree_stat", displayName: "Statistic", fields: [text("value", "Number"), text("unit", "Unit"), text("label", "Label")] },
  { name: "shree_models", displayName: "Plant Models", hideable: true, fields: [
    text("title", "Section title"), area("subtitle", "Subtitle"), text("button", "Request button text"),
    lines("filters", "Filter buttons", FILTER_HINT), list("items", "Models", "shree_model"), area("note", "Note under the cards"),
  ] },
  { name: "shree_model", displayName: "Plant model", fields: [
    text("title", "Name"), text("category", "Category", { hint: "Models with the same category share a filter" }),
    text("tag", "Tag"), area("text", "Description"), image("image", "Photo", 1400),
  ] },
  { name: "shree_method", displayName: "How We Execute", hideable: true, fields: [
    text("title", "Section title"), area("subtitle", "Subtitle"), list("steps", "Stages", "shree_step"),
  ] },
  { name: "shree_step", displayName: "Stage", fields: [text("title", "Stage name"), area("text", "Description")] },
  { name: "shree_products", displayName: "Products", hideable: true, fields: [
    text("title", "Section title"), area("subtitle", "Subtitle"), list("items", "Categories", "shree_product"),
  ] },
  { name: "shree_product", displayName: "Product category", fields: [
    text("name", "Category name"), image("image", "Photo", 700, "A product on a white background works best"),
    lines("items", "Items in this category"),
    { key: "missingItemCount", label: "Temporary item count", type: "count", hint: "Shown only while the item list is empty. Clear it once items are added." },
  ] },
  { name: "shree_clients", displayName: "Clients", hideable: true, fields: [
    text("title", "Section title"), area("subtitle", "Subtitle"), lines("filters", "Filter buttons", FILTER_HINT),
    list("items", "Clients", "shree_client"),
  ] },
  { name: "shree_client", displayName: "Client", fields: [
    text("name", "Client name"), text("category", "Category"), text("sector", "Sector / location"),
    image("logo", "Logo (optional)", 500, "Only add a logo you have permission to use"),
  ] },
  { name: "shree_contact", displayName: "Contact details", hideable: true, fields: [
    ...texts("", [["kicker", "Small label"], ["title", "Section title"], ["formTitle", "Form title"]]),
    area("formSubtitle", "Form description"),
    ...texts("", [["epcHeading", "EPC block heading"], ["epcEmail", "EPC email"], ["epcNote", "EPC note"],
      ["waterHeading", "Water block heading"], ["waterEmail", "Water email"], ["waterNote", "Water note"],
      ["person", "Contact person"], ["role", "Role"]]),
    lines("phones", "Phone numbers"), text("whatsapp", "WhatsApp number", { hint: "With country code" }),
    text("officeHeading", "Office block heading"), area("address", "Address"), text("city", "City shown in the footer"),
  ] },
  { name: "shree_footer", displayName: "Footer", hideable: true, fields: [
    area("about", "About text"), text("tagline", "Tagline"), area("disclaimer", "Disclaimer"),
    text("copyrightName", "Copyright name"), list("columns", "Link columns", "shree_footer_column"),
    text("contactHeading", "Contact column heading"),
  ] },
  { name: "shree_footer_column", displayName: "Footer column", fields: [text("heading", "Heading"), list("links", "Links", "shree_footer_link")] },
  { name: "shree_footer_link", displayName: "Footer link", fields: [text("label", "Label"), link("link", "Goes to")] },
  { name: "shree_seo", displayName: "Search & social sharing", fields: [
    area("description", "Search description"), text("ogTitle", "Sharing title"), area("ogDescription", "Sharing description"),
    image("ogImage", "Sharing image", 1800),
  ] },
  { name: "shree_form", displayName: "Enquiry form wording", fallback: true, fields: [
    ...texts("labels.", [["division", "Division label"], ["name", "Name label"], ["phone", "Phone label"], ["location", "Location label"],
      ["capacity", "Capacity label"], ["scope", "Scope label"], ["message", "Message label"]]),
    ...texts("placeholders.", [["name", "Name placeholder"], ["phone", "Phone placeholder"], ["location", "Location placeholder"], ["capacity", "Capacity placeholder"]]),
    ...texts("divisions.", [["epc", "EPC division name"], ["water", "Water division name"]]),
    lines("scopes", "Scope options"),
    ...texts("", [["submit", "Submit button"], ["readyTitle", "Result heading"], ["readyBeforeEmail", "Text before the email address"],
      ["readyAfterEmail", "Text after the email address"], ["copy", "Copy button"], ["copied", "Copied message"],
      ["copyFailed", "Copy failed message"], ["openMail", "Mail app button"], ["mailSubject", "Email subject start"]]),
    ...texts("body.", [["heading", "Enquiry heading start"], ["name", "Enquiry: name"], ["contact", "Enquiry: contact"], ["location", "Enquiry: location"],
      ["capacity", "Enquiry: capacity"], ["scope", "Enquiry: scope"], ["details", "Enquiry: details"]]),
    text("productScope", "Scope selected by a product enquiry", { hint: "Must match one of the scope options" }),
    text("productMessage", "Product enquiry message start"),
  ] },
  { name: "shree_ui", displayName: "Buttons & labels", fallback: true, fields: [
    ...texts("tabs.", [["home", "Tab: Home"], ["capabilities", "Tab: Capabilities"], ["fishmeal", "Tab: Fish Meal"], ["models", "Tab: Models"],
      ["execution", "Tab: Execution"], ["products", "Tab: Products"], ["clients", "Tab: Clients"], ["contact", "Tab: Contact"]]),
    ...texts("", [["promptFallback", "Typing text when there are no examples"], ["briefLabel", "Hero box accessible label"],
      ["divisionEpc", "Hero toggle: EPC"], ["divisionWater", "Hero toggle: Water"], ["talk", "Hero call button"], ["send", "Hero send accessible label"],
      ["swipe", "Swipe hint"], ["viewDetails", "Model card link"], ["allFilter", "'All' filter"], ["itemsSuffix", "Word after item counts"],
      ["enquireAbout", "Product enquiry button start"], ["whatsappSmall", "WhatsApp small text"], ["whatsappLabel", "WhatsApp button"],
      ["backToTop", "Back-to-top accessible label"], ["close", "Close accessible label"]]),
  ] },
];

export const storyblokName = (key: string) => key.replace(/\./g, "_");
