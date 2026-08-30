import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import { Experience } from "./components/Experience";
import { SmoothScroll } from "./components/SmoothScroll";
import { siteConfig } from "./site-config";
import "./globals.css";
import "./premium.css";
import "./knowledge.css";
import "./cinematic-sequence.css";
import "./home-routes.css";
import "./home.css";
import "./dienst.css";

/*
  Het Handboek is set in Fira Sans. The page had been running on the framework's
  own default, which is a product-UI grotesque with a dev-tool voice; a handbook
  for a homeowner needs the humanist manual tradition instead. Fira was drawn
  for screen legibility, and its wider, opener shapes carry the small ruled
  labels this world is built from at sizes people can actually read.

  Four weights and no more. The old sheets asked for fourteen (400, 420, 480,
  500, 600, 610, 650, 660, 700, 750, 760, 800, 850, 900), most of them
  indistinguishable and several of them invented by nudging. A static family
  would have collapsed them anyway; naming the four that carry a job is honest
  about what the page actually ships.
*/
const firaSans = Fira_Sans({
  variable: "--font-fira",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body className={firaSans.variable}>
        {/*
          THESIS: A heating company that explains, set like a well-made Dutch
          technical handbook. Authority from precision, not gloss. Refuses the
          category default of floating rounded cards on a soft blue gradient.

          OWN-WORLD: One humanist grotesque, Fira Sans, at four weights on a
          ten-step scale set in rem. Ink #0e1620 on cool paper #f2f5f8; the
          logo's own blue #0c70b8 as reference colour, never decoration; amber
          #c8781a reserved for urgency. Measured hairline rules, plate numbers,
          tabular figures. Nothing is enclosed in a card.

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
