'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/* De opening: licht papier met de kop, rechts een woonkamer bij schemer die zacht
   in het papier oplost. Bij binnenkomst zijn de lampen uit. Scrollt u, dan gaan de
   drie lampen boven de tafel één voor één aan (elk met zijn spiegeling in het raam) en
   groeit het licht in de kamer per lamp mee. Het beeld schuift een fractie naar de
   lampen toe; de tekst staat stil. Bij "beweging beperken" of op een lage telefoon
   staan de lampen meteen aan (data-stil). */

const TE_LAAG = '(max-width: 899px) and (max-height: 700px)';
// Waar in de scroll elke lamp aangaat (0 = begin, 1 = eind), en hoe kort de overgang is.
const START = [0.1, 0.34, 0.58];
const KLIK = 0.07;

const LAMPEN = [1, 2, 3];

export function KopLamp({ advies, label, pijl }: { advies: string; label: string; pijl: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [stand, setStand] = useState<'wacht' | 'live' | 'stil'>('wacht');

  // Kiezen: meescrollen, of meteen alles aan.
  useEffect(() => {
    const laag = matchMedia(TE_LAAG);
    const rustig = matchMedia('(prefers-reduced-motion: reduce)');
    const kies = () => setStand(laag.matches || rustig.matches ? 'stil' : 'live');
    kies();
    laag.addEventListener('change', kies);
    rustig.addEventListener('change', kies);
    return () => { laag.removeEventListener('change', kies); rustig.removeEventListener('change', kies); };
  }, []);

  // Pas meten als de scrollruimte er is (data-live staat dan op de sectie).
  useEffect(() => {
    const el = ref.current;
    if (!el || stand !== 'live') return;
    let frame = 0;
    const teken = () => {
      frame = 0;
      const podium = el.firstElementChild as HTMLElement;
      const top = parseFloat(getComputedStyle(podium).top) || 0;
      const r = el.getBoundingClientRect();
      const weg = r.height - podium.offsetHeight;
      const p = weg > 0 ? Math.min(1, Math.max(0, (top - r.top) / weg)) : 0;
      let som = 0;
      START.forEach((s, i) => {
        const t = Math.min(1, Math.max(0, (p - s) / KLIK));
        const aan = t * t * (3 - 2 * t);
        som += aan;
        el.style.setProperty(`--el-l${i + 1}`, aan.toFixed(3));
      });
      el.style.setProperty('--el-kamer', (som / START.length).toFixed(3));
      el.style.setProperty('--el-p', p.toFixed(4));
    };
    const vraag = () => { if (!frame) frame = requestAnimationFrame(teken); };
    teken();
    addEventListener('scroll', vraag, { passive: true });
    addEventListener('resize', vraag);
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', vraag); removeEventListener('resize', vraag); };
  }, [stand]);

  return <section className="el-kop" ref={ref} data-live={stand === 'live' || undefined} data-stil={stand === 'stil' || undefined} aria-labelledby="el-titel">
    <div className="el-kop-podium">
      <div className="el-kop-kamer" role="img" aria-label="Sfeerbeeld: een woonkamer bij schemer; de drie lampen boven de eettafel gaan één voor één aan.">
        <picture>
          <source media="(max-width: 899px)" srcSet="/elektra/kamer-uit-m.webp" />
          <img src="/elektra/kamer-uit.webp" width="2200" height="1228" alt="" fetchPriority="high" />
        </picture>
        <picture>
          <source media="(max-width: 899px)" srcSet="/elektra/kamer-licht-m.webp" />
          <img className="el-kop-licht" src="/elektra/kamer-licht.webp" width="2200" height="1228" alt="" />
        </picture>
        {LAMPEN.map(i => <picture key={i}>
          <source media="(max-width: 899px)" srcSet={`/elektra/lamp-${i}-m.webp`} />
          <img className={`el-kop-lamp el-kop-lamp-${i}`} src={`/elektra/lamp-${i}.webp`} width="2200" height="1228" alt="" />
        </picture>)}
      </div>
      <div className="el-kop-sluier" aria-hidden="true" />
      <div className="el-rand el-kop-tekst">
        <h1 id="el-titel">Alles tegelijk aan. <span>Zonder erbij na te denken.</span></h1>
        <p className="el-intro">&apos;s Avonds komt iedereen thuis. De kookplaat gaat aan, de wasmachine draait en de auto laadt. Goede elektra merkt u niet. Daar zorgt ons eigen team voor.</p>
        <div className="el-acties">
          <Link className="el-knop" href={advies}>{label} {pijl}</Link>
          <a className="el-bellijn" href="tel:+31736222199">Of bel 073 622 2199</a>
        </div>
      </div>
    </div>
  </section>;
}
