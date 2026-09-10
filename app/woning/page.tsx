import type { Metadata } from "next";
import { KetelKijker, WONING } from "../components/KetelKijker";

export const metadata: Metadata = {
  title: "De woning bekijken — werkroute",
  robots: { index: false, follow: false },
};

export default function WoningPage() {
  return <main className="dienst"><KetelKijker wat={WONING} /></main>;
}
