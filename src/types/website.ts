export type Division = "epc" | "water";
export type SectionId =
  | "home" | "capabilities" | "fishmeal" | "models" | "execution" | "products" | "clients" | "contact";

/** Storyblok click-to-edit attributes; present in draft preview only. */
export type EditAttributes = Record<string, string>;
export interface Editable { edit?: EditAttributes }
/** A page section that editors can hide. */
export interface Section extends Editable { hidden?: boolean }

export interface LinkItem extends Editable { label: string; link: string }
export interface Promo extends Editable { tag: string; title: string; text: string; button: string; link: string; image: string; color: string }
export interface Capability extends Editable { number?: string; title: string; text: string }
export interface CapabilityGroup extends Editable { name: string; items: Capability[] }
export interface Stat extends Editable { value: string; unit: string; label: string }
export interface PlantModel extends Editable { title: string; category: string; tag?: string; text: string; image: string }
export interface Step extends Editable { title: string; text: string }
export interface ProductCategory extends Editable {
  name: string;
  image?: string;
  items: string[];
  /** Temporary: the original card count, for categories whose item names have not been supplied. */
  missingItemCount?: number;
}
export interface Client extends Editable { name: string; category: string; sector: string; logo?: string }

export interface SiteContent {
  brand: Editable & { name: string; suffix: string; phone: string; ctaLabel: string; pageTitle: string };
  seo: Editable & { description: string; ogTitle: string; ogDescription: string; ogImage: string };
  hero: Section & {
    greeting: string; greetingHighlight: string; title: string; subtitle: string; image: string;
    promptsEPC: string[]; promptsWater: string[];
  };
  ticker: Section & { items: string[] };
  promos: Section & { items: Promo[] };
  capabilities: Section & { title: string; subtitle: string; groups: CapabilityGroup[] };
  fishmeal: Section & {
    kicker: string; title: string; text: string; image: string; caption: string; button: string;
    stats: Stat[]; flowTitle: string; flow: string[];
  };
  /** `filters` is used only while items have no category; otherwise filters come from the items. */
  models: Section & { title: string; subtitle: string; note: string; button: string; filters: string[]; items: PlantModel[] };
  method: Section & { title: string; subtitle: string; steps: Step[] };
  products: Section & { title: string; subtitle: string; items: ProductCategory[] };
  clients: Section & { title: string; subtitle: string; filters: string[]; items: Client[] };
  contact: Section & {
    kicker: string; title: string; formTitle: string; formSubtitle: string;
    epcHeading: string; epcEmail: string; epcNote: string;
    waterHeading: string; waterEmail: string; waterNote: string;
    person: string; role: string; phones: string[]; whatsapp: string;
    officeHeading: string; address: string; city: string;
  };
  form: Editable & {
    labels: Record<"division" | "name" | "phone" | "location" | "capacity" | "scope" | "message", string>;
    placeholders: Record<"name" | "phone" | "location" | "capacity", string>;
    divisions: Record<Division, string>;
    scopes: string[];
    submit: string; readyTitle: string; readyBeforeEmail: string; readyAfterEmail: string;
    copy: string; copied: string; copyFailed: string; openMail: string; mailSubject: string;
    body: Record<"heading" | "name" | "contact" | "location" | "capacity" | "scope" | "details", string>;
    productScope: string; productMessage: string;
  };
  footer: Section & {
    about: string; tagline: string; disclaimer: string; copyrightName: string;
    columns: (Editable & { heading: string; links: LinkItem[] })[]; contactHeading: string;
  };
  ui: Editable & {
    tabs: Record<SectionId, string>;
    promptFallback: string; briefLabel: string; divisionEpc: string; divisionWater: string; talk: string; send: string;
    swipe: string; viewDetails: string; allFilter: string; itemsSuffix: string; enquireAbout: string;
    whatsappSmall: string; whatsappLabel: string; backToTop: string; close: string;
  };
}
