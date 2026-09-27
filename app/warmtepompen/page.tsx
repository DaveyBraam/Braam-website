import type { Metadata } from "next";
import { WarmtepompPage } from "../warmtepompen-test/WarmtepompPage";

export const metadata: Metadata = {
  title: "Warmtepomp voor uw woning | Rob Braam",
  description: "Een passende hybride of volledig elektrische warmtepomp. Advies, installatie, onderhoud en service door het eigen team van Rob Braam.",
  alternates: { canonical: "/warmtepompen" },
  robots: { index: true, follow: true },
};

export default WarmtepompPage;
