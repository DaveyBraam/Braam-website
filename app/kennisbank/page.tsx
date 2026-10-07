import type { Metadata } from "next";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { getKnowledgeCards } from "../knowledge-data";
import { siteConfig } from "../site-config";
import { Kennisbank } from "./Kennisbank";
import "./kennisbank.css";

/* De kennisbank als gewone, rustige naslag voor lezers van 25 tot 65+
   (7 oktober 2026): zoeken, "Wat ziet u?" met klachten die openklappen,
   alle onderwerpen, contact. Achtergrond: braam-premium-concept/scrollcraft/
   builds/kennisbank-v2/BRIEF.md, onderdeel "v3". */

export const metadata: Metadata = {
  title: "Kennisbank voor cv, onderhoud, storingen en elektra",
  description: "Praktische kennis van Rob Braam over cv-ketels, onderhoud, storingen, verwarming, elektra, airco en energiezuinig gebruik.",
  alternates: { canonical: "/kennisbank" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/kennisbank",
    siteName: siteConfig.shortName,
    title: "Kennisbank | Braam Service & Montage",
    description: "Praktische uitleg voor uw woning, gebaseerd op ervaring uit installatie, onderhoud en service.",
  },
};

export default function KennisbankPage() {
  return (
    <>
      <SiteHeader />
      <main className="kb">
        <Kennisbank kaarten={getKnowledgeCards()} />
      </main>
      <SiteFooter />
    </>
  );
}
