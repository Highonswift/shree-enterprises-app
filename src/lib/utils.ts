export const telHref = (phone: string) => "tel:" + phone.replace(/[^+\d]/g, "");
export const whatsappHref = (phone: string) => "https://wa.me/" + phone.replace(/\D/g, "");
export const pad2 = (n: number) => String(n).padStart(2, "0");
export const unique = (values: string[]) => [...new Set(values.filter(Boolean))];
/** Safe quoted CSS url() for content-supplied image paths. */
export const cssUrl = (src: string) => `url("${src.replace(/["\\\n\r]/g, encodeURIComponent)}")`;
export const initials = (name: string) =>
  name.split(/[\s/]+/).filter((word) => /^[A-Z]/.test(word)).slice(0, 2).map((word) => word[0]).join("");
export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
