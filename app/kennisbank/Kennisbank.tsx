"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { knowledgeCategories, type KnowledgeCardData, type KnowledgeCategorySlug } from "../knowledge-data";
import { DirectHulp, OnderwerpRij } from "./Gedeeld";
import { klachten, klachtScore, normaliseer, oordelen, zoekwoorden, type KlachtLink } from "./klachten";

/* De kennisbank als gewone, rustige naslag voor lezers van 25 tot 65+:
   één zoekveld bovenaan, daaronder "Wat ziet u?" met klachten die openklappen
   en het oordeel in gewone woorden, dan alle onderwerpen, dan contact.
   Geen scrollbeweging; alleen het openklappen beweegt, kort en zacht. */

type Thema = "alles" | KnowledgeCategorySlug;

function telwoord(n: number, enkel: string, meer: string) {
  return `${n === 1 ? "1" : n} ${n === 1 ? enkel : meer}`;
}

function ga(id: string) {
  const doel = document.getElementById(id);
  if (!doel) return;
  const kop = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
  const afstand = kop + 24;
  /* Lenis trekt zelf de scroll-padding-top af; die tellen we terug. */
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const lenis = window.__lenis;
  if (lenis) lenis.scrollTo(doel, { offset: padding - afstand });
  else window.scrollTo({ top: window.scrollY + doel.getBoundingClientRect().top - afstand });
}

function LinkRegel({ link }: { link: KlachtLink }) {
  if (link.soort === "gepland") return <span className="kb-gepland">{link.label} <small>(artikel in voorbereiding)</small></span>;
  if (link.soort === "bel") return <a className={link.nadruk ? "kb-knop kb-knop-gas" : "kb-knop kb-knop-rand"} href={link.href}>{link.label}</a>;
  return <Link className="kb-tekstlink" href={link.href}>{link.label}<span aria-hidden="true"> →</span></Link>;
}

export function Kennisbank({ kaarten }: { kaarten: KnowledgeCardData[] }) {
  const [vraag, setVraag] = useState("");
  const [thema, setThema] = useState<Thema>("alles");
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  const zoekt = zoekwoorden(vraag).length > 0;

  const zichtbareKlachten = useMemo(() => {
    if (!zoekt) return klachten;
    return klachten
      .map((k, i) => ({ k, i, score: klachtScore(k, vraag) }))
      .filter((t) => t.score > 0)
      .sort((a, b) => b.score - a.score || a.i - b.i)
      .map((t) => t.k);
  }, [vraag, zoekt]);

  const zichtbareOnderwerpen = useMemo(() => {
    const woorden = zoekwoorden(vraag);
    return kaarten.filter((kaart) => {
      const label = knowledgeCategories.find((c) => c.slug === kaart.category)!.label;
      const tekst = normaliseer(`${kaart.title} ${kaart.excerpt} ${label}`);
      return (thema === "alles" || kaart.category === thema) && woorden.every((w) => tekst.includes(w));
    });
  }, [kaarten, thema, vraag]);

  const leesbaar = kaarten.filter((k) => k.status === "published").length;
  const actiefThema = thema === "alles" ? null : knowledgeCategories.find((c) => c.slug === thema)!;

  /* Wie de pagina opent op #een-klacht, krijgt die klacht meteen open. Het
     open zetten gaat via het element zelf; onToggle houdt de staat bij. */
  useEffect(() => {
    const openUitHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (klachten.some((k) => k.id === id)) document.getElementById(id)?.setAttribute("open", "");
    };
    openUitHash();
    window.addEventListener("hashchange", openUitHash);
    return () => window.removeEventListener("hashchange", openUitHash);
  }, []);

  const zetOpen = (id: string, isOpen: boolean) => {
    setOpen((huidig) => {
      if (huidig.has(id) === isOpen) return huidig;
      const nieuw = new Set(huidig);
      if (isOpen) nieuw.add(id);
      else nieuw.delete(id);
      return nieuw;
    });
  };

  const zoek = (event: FormEvent) => {
    event.preventDefault();
    if (!zoekt) return;
    const eerste = zichtbareKlachten[0];
    if (eerste) {
      zetOpen(eerste.id, true);
      window.requestAnimationFrame(() => ga(eerste.id));
    } else {
      ga("onderwerpen");
    }
  };

  const wis = () => {
    setVraag("");
    document.getElementById("kb-zoek")?.focus();
  };

  return (
    <>
      <section className="kb-kop" aria-labelledby="kb-titel">
        <div className="shell kb-kop-raster">
          <div>
            <p className="kb-kruimel"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Kennisbank</span></p>
            <h1 id="kb-titel">Kennisbank</h1>
            <p className="kb-intro">Heldere antwoorden op vragen over uw cv-ketel, onderhoud en storingen. Met wat u zelf kunt doen, en wanneer u ons belt.</p>

            <form className="kb-zoekvorm" role="search" onSubmit={zoek}>
              <label htmlFor="kb-zoek">Waar heeft u een vraag over?</label>
              <div className="kb-zoekrij">
                <input
                  id="kb-zoek"
                  type="search"
                  value={vraag}
                  onChange={(e) => setVraag(e.target.value)}
                  placeholder="Bijvoorbeeld: waterdruk of storing"
                  autoComplete="off"
                  enterKeyHint="search"
                />
                <button type="submit">Zoeken</button>
              </div>
              <p className="kb-zoekuitslag" aria-live="polite">
                {zoekt ? (
                  zichtbareKlachten.length + zichtbareOnderwerpen.length > 0 ? (
                    <>Gevonden: {telwoord(zichtbareKlachten.length, "klacht", "klachten")} en {telwoord(zichtbareOnderwerpen.length, "onderwerp", "onderwerpen")}. <button type="button" onClick={wis}>Zoekopdracht wissen</button></>
                  ) : (
                    <>Niets gevonden voor &lsquo;{vraag.trim()}&rsquo;. Probeer een ander woord, of bel ons: <a href="tel:+31736222199">073 622 2199</a>. <button type="button" onClick={wis}>Zoekopdracht wissen</button></>
                  )
                ) : null}
              </p>
            </form>
          </div>

          <DirectHulp />
        </div>
      </section>

      <section className="kb-klachten" id="wat-ziet-u" aria-labelledby="kb-klachten-titel">
        <div className="shell">
          <h2 id="kb-klachten-titel">Wat ziet u?</h2>
          <p className="kb-sectie-intro">Klik op wat u ziet. U leest meteen wat u zelf kunt doen, en wanneer u ons belt.</p>

          {zichtbareKlachten.length > 0 ? (
            <div className="kb-klachtenlijst">
              {zichtbareKlachten.map((k) => (
                <details
                  key={k.id}
                  id={k.id}
                  className="kb-klacht"
                  data-oordeel={k.oordeel}
                  open={open.has(k.id)}
                  onToggle={(e) => zetOpen(k.id, e.currentTarget.open)}
                >
                  <summary>
                    <h3>{k.klacht}</h3>
                    <span className="kb-oordeel">{oordelen[k.oordeel]}</span>
                    <span className="kb-plus" aria-hidden="true" />
                  </summary>
                  <div className="kb-antwoord">
                    <div>
                      <h4>{k.zelfKop}</h4>
                      <p>{k.zelf}</p>
                    </div>
                    <div>
                      <h4>{k.oordeel === "direct" ? "Daarna" : "Wanneer belt u ons?"}</h4>
                      <p><strong>{k.bellenStart}</strong> {k.bellen}</p>
                    </div>
                    <ul className="kb-antwoord-links">
                      {k.links.map((l) => <li key={l.label}><LinkRegel link={l} /></li>)}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <p className="kb-leeg">Geen klacht gevonden die past bij uw zoekopdracht.</p>
          )}
        </div>
      </section>

      <section className="kb-onderwerpen" id="onderwerpen" aria-labelledby="kb-onderwerpen-titel">
        <div className="shell">
          <h2 id="kb-onderwerpen-titel">Alle onderwerpen</h2>
          <p className="kb-sectie-intro">{leesbaar === 1 ? "Eén artikel" : `${leesbaar} artikelen`} kunt u nu lezen. De andere onderwerpen zijn in voorbereiding; ze verschijnen pas als de inhoud volledig is gecontroleerd.</p>

          <div className="kb-themas" role="group" aria-label="Kies een onderwerp">
            <button type="button" aria-pressed={thema === "alles"} onClick={() => setThema("alles")}>Alles</button>
            {knowledgeCategories.map((c) => (
              <button type="button" key={c.slug} aria-pressed={thema === c.slug} onClick={() => setThema(c.slug)}>{c.label}</button>
            ))}
          </div>
          {actiefThema ? <p className="kb-thema-uitleg">{actiefThema.description}</p> : null}

          {zichtbareOnderwerpen.length > 0 ? (
            <ul className="kb-artikelen">
              {zichtbareOnderwerpen.map((kaart) => <OnderwerpRij item={kaart} key={kaart.slug} />)}
            </ul>
          ) : (
            <div className="kb-leeg">
              <p>Geen onderwerp gevonden.</p>
              <button type="button" onClick={() => { setThema("alles"); setVraag(""); }}>Toon alle onderwerpen</button>
            </div>
          )}
        </div>
      </section>

      <section className="kb-contact" aria-labelledby="kb-contact-titel">
        <div className="shell kb-contact-raster">
          <div>
            <h2 id="kb-contact-titel">Komt u er niet uit?</h2>
            <p>Een artikel helpt bij de eerste controle, maar uw installatie blijft maatwerk. Twijfelt u, of komt een storing terug? Bel of mail ons serviceteam. Stuur gerust merk, type, storingscode en een paar duidelijke foto&apos;s mee.</p>
          </div>
          <div className="kb-contact-wegen">
            <a href="tel:+31736222199"><span>Bel ons serviceteam</span><strong>073 622 2199</strong></a>
            <a href="mailto:service@robbraam.com?subject=Vraag%20via%20de%20kennisbank"><span>Of mail</span><strong>service@robbraam.com</strong></a>
            <Link className="kb-tekstlink" href="/service">Meer over storing en service<span aria-hidden="true"> →</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
