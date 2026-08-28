import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Experience } from "./components/Experience";
import { SmoothScroll } from "./components/SmoothScroll";
import { siteConfig } from "./site-config";
import "./globals.css";
import "./premium.css";
import "./knowledge.css";
import "./cinematic-sequence.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Braam Service & Montage — Premium concept",
    template: "%s | Braam Service & Montage",
  },
  description:
    "Persoonlijk advies, installatie, onderhoud en service voor warmtepompen, cv-ketels, airco en elektra vanuit 's-Hertogenbosch in Noord-Brabant en aangrenzende delen van Gelderland.",
  applicationName: siteConfig.shortName,
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body className={geist.variable}>
        <SmoothScroll />
        <Experience />
        {children}
      </body>
    </html>
  );
}
