import type { Metadata } from "next";
import Link from "next/link";
import { AlleReviews } from "../components/KlantReviews";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import "../leesstijl.css";

/* Reviews (oktober 2026): alleen echte reviews uit de review-app, met
   toestemming van de schrijver en na goedkeuring. Niets wordt hier zelf
   geschreven of aangevuld (PRODUCT.md: verzin geen reviews). */

export const metadata: Metadata = {
  title: "Reviews",
  description: "Wat klanten van Service & Montagebedrijf Rob Braam zeggen, met toestemming gepubliceerd. Schrijf ook zelf een review.",
};

export default function ReviewsPage() {
  return (
    <>
      <SiteHeader />
      <main className="ls">
        <section className="ls-kop" aria-labelledby="ls-titel">
          <div className="shell">
            <p className="ls-kruimel"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Reviews</span></p>
            <h1 id="ls-titel">Wat klanten zeggen.</h1>
            <p className="ls-lead">Na een bezoek vragen we klanten hoe het ging. Wie dat wil, mag de beoordeling hier laten zien. U leest ze precies zoals ze zijn geschreven.</p>
          </div>
        </section>
        <section className="ls-blok kr-blok">
          <div className="shell">
            <AlleReviews />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
