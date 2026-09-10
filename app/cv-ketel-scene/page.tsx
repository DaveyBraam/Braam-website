import type { Metadata } from "next";
import { CvOpeningPreviz } from "../components/CvOpeningPreviz";

export const metadata: Metadata = {
  title: "CV-ketel-scène — werkroute",
  robots: { index: false, follow: false },
};

export default function CvKetelScenePage() {
  return <CvOpeningPreviz />;
}
