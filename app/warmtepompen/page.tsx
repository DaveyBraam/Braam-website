import type { Metadata } from "next";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { Journey } from "./Journey";
import { Content } from "./Content";
import "./warmtepompen.css";

export const metadata: Metadata = {
  title: "Warmtepomp voor uw woning | Rob Braam",
  description: "Een passende hybride of volledig elektrische warmtepomp. Advies, installatie, onderhoud en service door het eigen team van Rob Braam.",
  alternates: { canonical: "/warmtepompen" },
  robots: { index: true, follow: true },
};

export default function WarmtepompenPage() {
  return <>
    <SiteHeader />
    <main className="w5">
      <Journey />
      <Content />
    </main>
    <SiteFooter />
  </>;
}
