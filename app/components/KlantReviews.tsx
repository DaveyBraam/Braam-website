"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { reviewSchrijven, reviewsFeed } from "../site-config";
import "../klant-reviews.css";

/* Echte reviews uit de review-app, alleen met toestemming en na goedkeuring.
   Er wordt niets verzonnen of aangevuld: lukt het ophalen niet, of zijn er te
   weinig, dan toont dit onderdeel niets. Het gemiddelde verschijnt pas vanaf
   MIN_VOOR_SCORE reviews; bij twee reviews zegt een 5,0 nog weinig. */

type Review = { sterren: number; tekst: string; naam: string; maand: string; label: string | null };
type Feed = { aantal: number; gemiddelde: number | null; verificatie: string; reviews: Review[] };

const MIN_VOOR_SCORE = 5;
const maanden = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
const maandNaam = (m: string) => { const [j, mm] = m.split("-"); return `${maanden[Number(mm) - 1] ?? ""} ${j}`.trim(); };

function Sterren({ aantal }: { aantal: number }) {
  return (
    <span className="kr-sterren" role="img" aria-label={`${aantal} van 5 sterren`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className={i <= aantal ? "is-vol" : undefined}>
          <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" />
        </svg>
      ))}
    </span>
  );
}

function useReviews() {
  const [feed, setFeed] = useState<Feed | null>(null);
  useEffect(() => {
    let weg = false;
    fetch(reviewsFeed, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Feed | null) => { if (!weg && d && Array.isArray(d.reviews)) setFeed(d); })
      .catch(() => {});
    return () => { weg = true; };
  }, []);
  return feed;
}

function Lijst({ feed, reviews, naarPagina }: { feed: Feed; reviews: Review[]; naarPagina: boolean }) {
  const score = feed.gemiddelde !== null && feed.aantal >= MIN_VOOR_SCORE
    ? `Gemiddeld ${feed.gemiddelde.toLocaleString("nl-NL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} van 5, uit ${feed.aantal} reviews`
    : null;
  return (
    <>
      {score && <p className="kr-score">{score}</p>}
      <ul className="kr-lijst">
        {reviews.map((r, i) => (
          <li key={`${r.maand}-${i}`}>
            <figure>
              <Sterren aantal={r.sterren} />
              <blockquote><p>{r.tekst}</p></blockquote>
              <figcaption><strong>{r.naam}</strong><span>{maandNaam(r.maand)}{r.label ? ` · ${r.label}` : ""}</span></figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="kr-uitleg">{feed.verificatie}</p>
      <p className="kr-acties">
        {naarPagina && <Link className="text-link" href="/reviews">Alle reviews <span aria-hidden="true">→</span></Link>}
        <a className="text-link" href={reviewSchrijven}>Schrijf zelf een review <span aria-hidden="true">↗</span></a>
      </p>
    </>
  );
}

/* Homepage: pas zichtbaar vanaf HOME_MINIMUM reviews met tekst, anders geen lege rij. */
const HOME_MINIMUM = 3;
export function HomeReviews() {
  const feed = useReviews();
  const metTekst = feed?.reviews.filter((r) => r.tekst.trim()) ?? [];
  if (!feed || metTekst.length < HOME_MINIMUM) return null;
  return (
    <section className="home-reviews chapter-paper" aria-labelledby="home-reviews-titel">
      <div className="shell kr">
        <h2 id="home-reviews-titel">Wat klanten zeggen.</h2>
        <Lijst feed={feed} reviews={metTekst.slice(0, 3)} naarPagina />
      </div>
    </section>
  );
}

/* /reviews: alles wat met toestemming gepubliceerd is. */
export function AlleReviews() {
  const feed = useReviews();
  if (!feed) return <p className="kr-laden" aria-live="polite">Reviews worden geladen…</p>;
  const metTekst = feed.reviews.filter((r) => r.tekst.trim());
  if (!metTekst.length) return <div className="kr"><p className="kr-uitleg">Er staan nog geen reviews op deze pagina. Was u bij ons klant? Dan horen we graag hoe het ging.</p><p className="kr-acties"><a className="text-link" href={reviewSchrijven}>Schrijf zelf een review <span aria-hidden="true">↗</span></a></p></div>;
  return <div className="kr"><Lijst feed={feed} reviews={metTekst} naarPagina={false} /></div>;
}
