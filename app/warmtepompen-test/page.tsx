import type { Metadata } from "next";
import { WarmtepompPage } from "./WarmtepompPage";

export const metadata: Metadata = {
  title: "Warmtepomp handboek — testpagina",
  description: "Een passende warmtepomp, van advies en installatie tot onderhoud door het eigen team van Rob Braam.",
  robots: { index: false, follow: false },
};

export default function WarmtepompTestPage() { return <WarmtepompPage preview />; }
