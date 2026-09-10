import type { Metadata } from "next";
import { KetelKijker } from "../components/KetelKijker";

/* Kijkdoos om het model te controleren. Geen header of voettekst: het gaat
   hier alleen om de ketel. */
export const metadata: Metadata = {
  title: "De ketel bekijken — werkroute",
  robots: { index: false, follow: false },
};

export default function KetelPage() {
  return <main className="dienst"><KetelKijker /></main>;
}
