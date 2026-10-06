"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

/* De route van de aanvraag. Leest de stappen uit het formulier dat ernaast
   staat (elke .form-section met zijn kop, plus het verzendblok) en vult zich
   per ingevuld verplicht veld. Het formulier hoeft hier niets van te weten:
   velden die erbij komen of verdwijnen worden via een MutationObserver
   opnieuw geteld. Na het versturen staan Braams stappen gedimd; op de
   bedankpagina loopt dezelfde route verder.

   Drie regels, zodat de route doet wat de bezoeker verwacht:
   - de actieve stap is de stap van het veld waarin u typt; alleen zonder
     focus in het formulier volgt hij het scrollen;
   - alleen velden die u zelf moet invullen tellen; een keuzelijst of rondje
     dat al een waarde heeft, telt niet als "al ingevuld";
   - elke stap vult zijn eigen stuk lijn, in welke volgorde u ook werkt. */

type Stap = { titel: string; nodig: number; ingevuld: number; aangeraakt: boolean };
type Stand = { stappen: Stap[]; actief: number; nodig: number; ingevuld: number; klaar: boolean };

const leeg: Stand = { stappen: [], actief: 0, nodig: 0, ingevuld: 0, klaar: false };

type Veld = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const isRondje = (v: Veld): v is HTMLInputElement => v instanceof HTMLInputElement && v.type === "radio";

/** Verplichte velden in een blok die de bezoeker zelf moet invullen. */
function telVelden(blok: Element) {
  const velden = Array.from(blok.querySelectorAll<Veld>("input[required], select[required], textarea[required]"))
    .filter((v) => !v.disabled && v.type !== "hidden")
    /* Een keuzelijst zonder lege optie heeft altijd een waarde. */
    .filter((v) => !(v instanceof HTMLSelectElement) || Array.from(v.options).some((o) => o.value === ""));
  const groepen = new Map<string, boolean>();
  velden.forEach((v, i) => {
    const sleutel = isRondje(v) ? `rondje:${v.name}` : `veld:${i}`;
    const goed = isRondje(v) ? v.checked : v.checkValidity();
    groepen.set(sleutel, (groepen.get(sleutel) ?? false) || goed);
  });
  const waarden = Array.from(groepen.values());
  return { nodig: waarden.length, ingevuld: waarden.filter(Boolean).length };
}

function blokken(formulier: HTMLFormElement) {
  const secties = Array.from(formulier.querySelectorAll<HTMLElement>(":scope > .form-section"));
  const verzend = formulier.querySelector<HTMLElement>(":scope > .form-submit-panel");
  return verzend ? [...secties, verzend] : secties;
}

const formulierNu = () => document.querySelector<HTMLFormElement>("[data-av-formulier] form");

function kopOnder() {
  return document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 80;
}

function scrollNaar(el: HTMLElement) {
  /* Op de telefoon staat de stapstrook ook nog onder de sitekop. */
  const strook = document.querySelector<HTMLElement>(".av-strook");
  const strookHoogte = strook && strook.offsetParent ? strook.offsetHeight : 0;
  const offset = -kopOnder() - strookHoogte - 20;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
}

export function AanvraagRoute({ daarna }: { daarna: string[] }) {
  const [stand, setStand] = useState<Stand>(leeg);
  const ref = useRef<HTMLElement>(null);
  /* Blokken waarin de bezoeker al iets heeft gedaan, op volgnummer. */
  const aangeraakt = useRef(new Set<number>());

  const meet = useCallback(() => {
    const formulier = formulierNu();
    if (!formulier) { setStand(leeg); return; }
    const lijst = blokken(formulier);

    const focus = document.activeElement;
    const focusBlok = focus && formulier.contains(focus) ? lijst.findIndex((b) => b.contains(focus)) : -1;
    let actief = 0;
    if (focusBlok >= 0) actief = focusBlok;
    else {
      const grens = window.innerHeight * 0.42;
      lijst.forEach((blok, i) => { if (blok.getBoundingClientRect().top < grens) actief = i; });
    }

    const stappen = lijst.map((blok, i) => {
      const titel = blok.classList.contains("form-submit-panel") ? "Controleren en versturen" : blok.querySelector("h2")?.textContent?.trim() ?? `Stap ${i + 1}`;
      return { titel, ...telVelden(blok), aangeraakt: aangeraakt.current.has(i) };
    });
    const nodig = stappen.reduce((s, x) => s + x.nodig, 0);
    const ingevuld = stappen.reduce((s, x) => s + x.ingevuld, 0);
    setStand({ stappen, actief, nodig, ingevuld, klaar: nodig > 0 && ingevuld === nodig });
  }, []);

  useEffect(() => {
    const wortel = document.querySelector("[data-av-formulier]");
    if (!wortel) return;
    let frame = 0;
    const plan = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; meet(); }); };

    /* Onthoud in welk blok iets gebeurt; een blok zonder eigen verplichte
       velden (alleen keuzes met een standaardwaarde) is af zodra u er iets
       aanraakt of verder gaat. */
    const raakAan = (e: Event) => {
      const formulier = formulierNu();
      const doel = e.target as Node | null;
      if (formulier && doel) {
        const i = blokken(formulier).findIndex((b) => b.contains(doel));
        if (i >= 0) aangeraakt.current.add(i);
      }
      plan();
    };

    /* De kop van de site verandert van hoogte bij scrollen; de strook op de
       telefoon schuift daar precies onder. */
    const zetTop = () => {
      ref.current?.style.setProperty("--av-top", `${Math.max(0, Math.round(kopOnder()))}px`);
    };
    const bijScroll = () => { plan(); zetTop(); };

    const waarnemer = new MutationObserver(plan);
    waarnemer.observe(wortel, { childList: true, subtree: true });
    wortel.addEventListener("input", raakAan, true);
    wortel.addEventListener("change", raakAan, true);
    wortel.addEventListener("focusin", raakAan, true);
    wortel.addEventListener("focusout", plan, true);
    window.addEventListener("scroll", bijScroll, { passive: true });
    window.addEventListener("resize", bijScroll);
    plan();
    zetTop();
    return () => {
      waarnemer.disconnect();
      wortel.removeEventListener("input", raakAan, true);
      wortel.removeEventListener("change", raakAan, true);
      wortel.removeEventListener("focusin", raakAan, true);
      wortel.removeEventListener("focusout", plan, true);
      window.removeEventListener("scroll", bijScroll);
      window.removeEventListener("resize", bijScroll);
      cancelAnimationFrame(frame);
    };
  }, [meet]);

  /* Naar een stap: scroll erheen en zet de cursor in het eerste lege
     verplichte veld, zodat u meteen kunt typen. */
  const ga = (i: number) => {
    const formulier = formulierNu();
    const blok = formulier ? blokken(formulier)[i] : null;
    if (!blok) return;
    scrollNaar(blok);
    const leegVeld = Array.from(blok.querySelectorAll<Veld>("input[required], select[required], textarea[required]"))
      .find((v) => !v.disabled && !isRondje(v) && v.type !== "checkbox" && !v.checkValidity());
    leegVeld?.focus({ preventScroll: true });
  };

  if (!stand.stappen.length) return <aside className="av-route" aria-hidden="true" ref={ref} />;

  const isKlaar = (stap: Stap, i: number) => (stap.nodig === 0 ? stap.aangeraakt || i < stand.actief || stand.klaar : stap.ingevuld === stap.nodig);
  const vul = stand.klaar ? 1 : stand.nodig ? stand.ingevuld / stand.nodig : 0;
  const rest = stand.nodig - stand.ingevuld;
  const status = stand.klaar ? "Alles ingevuld. U kunt versturen." : `Nog ${rest} verplicht${rest === 1 ? " veld" : "e velden"}`;
  const actief = stand.stappen[stand.actief];
  const laatste = stand.stappen.length - 1;

  return (
    <aside className={stand.klaar ? "av-route is-klaar" : "av-route"} ref={ref} aria-label="De route van uw aanvraag" style={{ "--vul": vul.toFixed(3) } as CSSProperties}>
      {/* Telefoon: één regel die onder de sitekop blijft staan. */}
      <button type="button" className="av-strook" onClick={() => ga(stand.klaar ? laatste : stand.actief)}>
        <span><b>Stap {stand.actief + 1} van {stand.stappen.length}</b> {actief?.titel}</span>
        <small>{stand.klaar ? "Klaar om te versturen" : status}</small>
        <i aria-hidden="true" />
      </button>

      <div className="av-route-vol">
        <p className="av-route-kop">Uw aanvraag</p>
        <ol className="av-route-u">
          {stand.stappen.map((stap, i) => {
            const klaar = isKlaar(stap, i);
            /* Het stuk lijn onder een stap vult met die stap zelf. */
            const deel = klaar ? 1 : stap.nodig ? stap.ingevuld / stap.nodig : 0;
            const naam = ["av-stap", klaar ? "is-klaar" : "", i === stand.actief ? "is-actief" : ""].filter(Boolean).join(" ");
            return (
              <li className={naam} key={`${i}-${stap.titel}`} style={{ "--deel": deel.toFixed(3) } as CSSProperties}>
                <button type="button" onClick={() => ga(i)} aria-current={i === stand.actief ? "step" : undefined}>
                  <span className="av-stip" aria-hidden="true" />
                  <span className="av-stap-titel">{stap.titel}</span>
                  {stap.nodig > 0 && !klaar && <small>{stap.ingevuld} van {stap.nodig} ingevuld</small>}
                </button>
              </li>
            );
          })}
        </ol>
        <p className="av-route-status" aria-live="polite">{status}</p>

        <p className="av-route-overgang">Daarna is Braam aan zet</p>
        <ol className="av-route-braam">
          {daarna.map((stap) => <li key={stap}><span className="av-stip" aria-hidden="true" />{stap}</li>)}
        </ol>
      </div>
    </aside>
  );
}
