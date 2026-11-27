import type { Metadata, Viewport } from "next";
import { Barlow } from "next/font/google";
import { getContent } from "@/lib/content";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

// Browser chrome and the favicon cannot read CSS variables: keep these equal to --color-primary and --color-accent.
const PRIMARY = "#071B35";
const ACCENT = "#C5A46D";
const favicon = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='${PRIMARY}'/><text x='14' y='46' font-family='Arial' font-weight='800' font-size='40' fill='white'>S</text><rect x='42' y='16' width='8' height='32' rx='2' fill='${ACCENT}'/></svg>`,
)}`;

export function generateMetadata(): Metadata {
  const { brand, seo } = getContent();
  return {
    title: brand.pageTitle,
    description: seo.description,
    openGraph: { title: seo.ogTitle, description: seo.ogDescription, images: [seo.ogImage] },
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={barlow.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
