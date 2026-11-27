import type { Metadata, Viewport } from "next";
import { Barlow } from "next/font/google";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { getSite } from "@/lib/storyblok/queries";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

// Browser chrome and the favicon cannot read CSS variables: keep these equal to the default theme's --color-primary and --color-accent.
const PRIMARY = "#062B3A";
const ACCENT = "#78C9CF";
const favicon = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='${PRIMARY}'/><text x='14' y='46' font-family='Arial' font-weight='800' font-size='40' fill='white'>S</text><rect x='42' y='16' width='8' height='32' rx='2' fill='${ACCENT}'/></svg>`,
)}`;

export async function generateMetadata(): Promise<Metadata> {
  const { brand, seo } = (await getSite()).content;
  // Vercel provides the site's address, needed to make the sharing image URL absolute.
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return {
    metadataBase: host ? new URL(`https://${host}`) : undefined,
    title: brand.pageTitle,
    description: seo.description,
    openGraph: { title: seo.ogTitle, description: seo.ogDescription, images: seo.ogImage ? [seo.ogImage] : [] },
    icons: { icon: favicon },
    appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: PRIMARY,
};

// Theme selector: local development and preview deployments only, never Vercel production.
// SHOW_THEME_SELECTOR=true enables it for a local production build or another showcase host.
const showThemeSelector =
  process.env.VERCEL_ENV !== "production" &&
  (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview" || process.env.SHOW_THEME_SELECTOR === "true");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={barlow.variable} data-theme="deep-ocean" data-scroll-behavior="smooth">
      <body>
        {children}
        {showThemeSelector && <ThemeSwitcher />}
      </body>
    </html>
  );
}
