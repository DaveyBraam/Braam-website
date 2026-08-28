import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Experience } from "./components/Experience";
import { SmoothScroll } from "./components/SmoothScroll";
import { siteConfig } from "./site-config";
import "./globals.css";
import "./premium.css";
import "./knowledge.css";
import "./cinematic-sequence.css";
import "./home-routes.css";
import "./home.css";

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
        {/*
          THESIS: A heating company that explains, set like a well-made Dutch
          technical handbook. Authority from precision, not gloss. Refuses the
          category default of floating rounded cards on a soft blue gradient.

          OWN-WORLD: One grotesque at many weights. Ink #0e1620 on cool paper
          #f2f5f8; the logo's own blue #0c70b8 as reference colour, never
          decoration; amber #c8781a reserved for urgency. Measured hairline
          rules, plate numbers, tabular figures. Nothing is enclosed in a card.

          STORY: A homeowner sees a real visit, picks their own route, learns
          why it matters who does the work, sees the work and the price, and
          calls or asks.

          FIRST VIEWPORT: The scrubbed four-scene film full-bleed, the promise
          in two lines at half its old size, phone and quote side by side at
          equal weight, verifiable proof along the foot.

          FORM: Het Handboek, candidate 6 of 7 on the grounded list. Seed key
          6ef49c05.

          FINISH: unreviewed and undocumented is unfinished; this build ends
          with the finish review, the verdict, DESIGN.md, and every shipping
          raster carrying its provenance.
        */}
        <SmoothScroll />
        <Experience />
        {children}
      </body>
    </html>
  );
}
