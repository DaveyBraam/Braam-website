'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { KetelScene } from './scene';
import { controles } from './controles';

/* Het vaste podium met de ketel, en de hoofdstukken die er in gewone
   leesvolgorde langs lopen. Elk hoofdstuk zegt met data-stand welke
   camerastand erbij hoort; data-donker="1" zet het licht uit. De
   controlelijst onderin vinkt af wat gelezen is en springt erheen. */

const abonneer = (cb: () => void) => {
  const q = matchMedia('(prefers-reduced-motion: reduce)');
  q.addEventListener('change', cb);
  return () => q.removeEventListener('change', cb);
};
const rustig = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const geenAbonnement = () => () => {};
const zuinig = () => Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

const klem = (v: number) => Math.max(0, Math.min(1, v));
const glij = (v: number) => { const t = klem(v); return t * t * (3 - 2 * t); };

export function Reis({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null), host = useRef<HTMLDivElement>(null);
  const scene = useRef<KetelScene | null>(null);
  const rust = useSyncExternalStore(abonneer, rustig, () => false);
  const zuinigheid = useSyncExternalStore(geenAbonnement, zuinig, () => false);
  const [live, setLive] = useState(false), [mis, setMis] = useState(false);
  const [gezien, setGezien] = useState(-1), [huidig, setHuidig] = useState(-1);
  const [donker, setDonker] = useState(false);
  const staat = useRef({ stand: 0, donker: 0, gas: 0, rook: 0, aan: 0, zon: 0 });

  // Scroll: camerastand, licht, gas, stromen, controlelijst. Werkt ook zonder 3D.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const delen = Array.from(el.querySelectorAll<HTMLElement>('[data-stand]'));
    const teksten = delen.map(d => d.querySelector<HTMLElement>('.ck-tekst'));
    const lijst = controles.map(c => el.querySelector<HTMLElement>(`#${c.id}`));
    const eersteDonker = el.querySelector<HTMLElement>('.ck-stilte .ck-tekst');
    const gas = el.querySelector<HTMLElement>('#ck-gasleiding .ck-tekst');
    const rook = el.querySelector<HTMLElement>('#ck-rookgas .ck-tekst');
    const terug = el.querySelector<HTMLElement>('#ck-oplevering .ck-tekst');
    const podium = el.querySelector<HTMLElement>('.ck-podium');
    // Waar elk tekstblok blijft staan om rustig te lezen (sticky top, in px).
    const vast = new Map<HTMLElement, number>();
    const lang = new Set<HTMLElement>();
    let ondergrens = 0;
    const schik = () => {
      const vh = innerHeight, smal = innerWidth < 760;
      ondergrens = smal && podium ? parseFloat(getComputedStyle(podium).top) + podium.offsetHeight : 0;
      const boven = smal ? ondergrens + 20 : 84 + 28;
      for (const t of teksten) {
        if (!t) continue;
        const h = t.offsetHeight;
        // Midden in beeld; een lang blok schuift eerst gewoon binnen en blijft staan met zijn onderkant in beeld.
        const midden = smal ? boven : Math.max(boven, (vh - h) / 2);
        const plek = Math.round(Math.min(midden, vh - h - 28));
        vast.set(t, plek);
        if (plek < midden) lang.add(t); else lang.delete(t);
        t.style.setProperty('--ck-vast', `${plek}px`);
      }
    };
    let raf = 0;
    const meet = () => {
      raf = 0;
      const vh = innerHeight, smal = innerWidth < 760;
      const top = (n: HTMLElement | null) => n ? n.getBoundingClientRect().top : Infinity;
      // Hoe ver een blok nog van zijn leesplek is: positief = komt eraan, 0 = staat stil, negatief = voorbij.
      const afstand = (n: HTMLElement | null) => n ? top(n) - (vast.get(n) ?? 0) : -scrollY;

      // De camera rust zolang een tekst stilstaat en beweegt alleen tussen twee teksten in.
      const punten = delen.map((d, i) => ({ y: afstand(teksten[i]), stand: Number(d.dataset.stand) }));
      let stand = punten[0]?.stand ?? 0;
      for (let i = 0; i < punten.length - 1; i++) {
        const a = punten[i], b = punten[i + 1];
        if (a.y <= .5 && b.y > .5) stand = a.stand + (b.stand - a.stand) * glij((0 - a.y) / (b.y - a.y) * 1.2 - .1);
        else if (b.y <= .5) stand = b.stand;
      }

      const ruimte = vh - ondergrens;
      const uit = top(eersteDonker) < ondergrens + ruimte * .72;
      const aanTerug = top(terug) < ondergrens + ruimte * .72;
      const isDonker = uit && !aanTerug;
      // Gas en stromen vullen zich terwijl hun tekst binnenkomt en zijn vol als die stilstaat.
      const binnen = (n: HTMLElement | null) => {
        if (!n) return 0;
        const start = ondergrens + ruimte * .95, plek = vast.get(n) ?? 0;
        return glij((start - top(n)) / Math.max(1, start - plek));
      };
      const s = staat.current;
      s.stand = stand;
      s.donker = isDonker ? 1 : 0;
      s.gas = binnen(gas);
      s.rook = binnen(rook);
      s.aan = aanTerug ? 1 : 0;
      s.zon = klem(scrollY / vh);
      scene.current?.zet(s);
      // De kop blijft eerst staan en wijkt pas daarna.
      const kopRust = vh * .3;
      el.style.setProperty('--ck-kopy', smal ? '0px' : `${Math.min(scrollY, kopRust).toFixed(1)}px`);
      el.style.setProperty('--ck-kop', String(klem((scrollY - kopRust) / (vh * .22))));
      setDonker(isDonker);

      // Naast elkaar (niet op de telefoon): een tekst verschijnt als hij bijna stilstaat en vervaagt
      // zodra hij weer gaat, zodat er tijdens de camerabeweging geen tekst over het beeld schuift.
      for (const t of teksten) {
        if (!t) continue;
        let zicht = 1;
        if (!smal) {
          const d = afstand(t);
          if (d > 0 && !lang.has(t)) zicht = 1 - glij((d - 90) / 260);
          else if (d < 0) zicht = 1 - glij((-d - 50) / 230);
        }
        t.style.opacity = zicht > .999 ? '' : zicht.toFixed(3);
      }

      let laatste = -1;
      lijst.forEach((n, i) => { if (n && top(n) < ondergrens + ruimte * .5) laatste = i; });
      setHuidig(laatste);
      setGezien(g => Math.max(g, laatste));
    };
    const wek = () => { if (!raf) raf = requestAnimationFrame(meet); };
    const herschik = () => { schik(); wek(); };
    const maat = new ResizeObserver(herschik);
    teksten.forEach(t => t && maat.observe(t));
    if (podium) maat.observe(podium);
    addEventListener('scroll', wek, { passive: true });
    addEventListener('resize', herschik);
    herschik();
    return () => { maat.disconnect(); cancelAnimationFrame(raf); removeEventListener('scroll', wek); removeEventListener('resize', herschik); };
  }, []);

  // De 3D-scène, behalve bij databesparing of als WebGL faalt.
  useEffect(() => {
    const el = root.current, mount = host.current;
    if (!el || !mount || zuinigheid || mis) return;
    let dood = false, inBeeld = true;
    const zicht = () => scene.current?.zichtbaar(inBeeld && !document.hidden);
    const kijker = new IntersectionObserver(e => { inBeeld = e[0].isIntersecting; zicht(); });
    kijker.observe(el);
    document.addEventListener('visibilitychange', zicht);
    import('./scene').then(({ createKetelScene }) => {
      if (dood) return;
      scene.current = createKetelScene(mount, { klaar: () => { if (!dood) setLive(true); }, mis: () => { if (!dood) setMis(true); }, beweging: !rust });
      scene.current.zet(staat.current); zicht();
    }).catch(() => { if (!dood) setMis(true); });
    return () => { dood = true; kijker.disconnect(); document.removeEventListener('visibilitychange', zicht); scene.current?.weg(); scene.current = null; setLive(false); };
  }, [rust, zuinigheid, mis]);

  const spring = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: rust ? 'auto' : 'smooth', block: 'start' });
  };

  return <div className="ck-reis" ref={root} data-live={live} data-donker={donker} data-beweging={rust ? 'uit' : 'aan'}>
    <div className="ck-podium">
      <div className="ck-scene" ref={host} aria-hidden="true" />
      <img className="ck-poster" src="/concept-3d/cv-ketels/installation-overview.webp" alt="" width="1000" height="1100" aria-hidden="true" />
      <div className="ck-kopwaas" aria-hidden="true" />
      <div className="ck-labels" aria-hidden="true">
        <span data-label="aanvoer">Aanvoer cv</span>
        <span data-label="warm" className="ck-label-laag">Warm water</span>
        <span data-label="gas">Gas</span>
        <span data-label="koud" className="ck-label-laag">Koud water</span>
        <span data-label="retour">Retour cv</span>
        <span data-label="radiator">Uw radiator</span>
        <span data-label="gasleiding" className="ck-label-gas">Gasleiding</span>
        <span data-label="rookgas" className="ck-label-rook">Rookgas naar buiten</span>
        <span data-label="lucht" className="ck-label-lucht">Verse lucht naar binnen</span>
        <span data-label="dak" className="ck-label-dak">Dak</span>
      </div>
      <nav className="ck-lijst" aria-label="Wat we nalopen" data-zichtbaar={huidig >= 0}>
        <span className="ck-lijst-titel">Wat we nalopen</span>
        <ol>
          {controles.map((c, i) => <li key={c.id} data-gezien={i <= gezien} aria-current={i === huidig ? 'step' : undefined}>
            <a href={`#${c.id}`} onClick={e => { e.preventDefault(); spring(c.id); }} tabIndex={huidig >= 0 ? 0 : -1}>
              <i aria-hidden="true">{i <= gezien ? <svg viewBox="0 0 16 16"><path d="m3.5 8.3 3 3 6-6.6" /></svg> : null}</i>
              {c.kort}
            </a>
          </li>)}
        </ol>
      </nav>
    </div>
    <div className="ck-hoofdstukken">{children}</div>
  </div>;
}
