'use client';
import { useEffect, useRef } from 'react';

const STAPPEN = [
  ['U vertelt ons uw plannen.', 'Wilt u iets aan uw elektra laten aanpassen, of komt er een nieuwe airco of warmtepomp? Neem contact op en vertel wat u nodig heeft.'],
  ['We bekijken wat nodig is.', 'We beoordelen uw bestaande aansluiting en groepenkast. Daarna bespreken we welk elektrawerk bij uw plannen hoort.'],
  ['Onze eigen elektricien gaat aan de slag.', 'We spreken de werkzaamheden met u af. Hoort het elektrawerk bij een airco of warmtepomp, dan stemmen we het af met de plaatsing van het toestel.'],
  ['We lopen het werk met u na.', 'Na de werkzaamheden leggen we uit wat er is aangepast. Heeft u nog vragen, dan kunt u bij ons terecht.'],
] as const;

/** Vier stappen onder elkaar; een lijn langs de nummers loopt mee met het lezen. */
export function Werkwijze() {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const meet = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      // De lijn is vol als het einde van de lijst op tweederde van het scherm staat.
      const lijn = innerHeight * 0.62;
      const p = Math.min(1, Math.max(0, (lijn - r.top) / Math.max(1, r.height)));
      el.style.setProperty('--el-lijn', p.toFixed(4));
      el.querySelectorAll<HTMLElement>('li').forEach(li => {
        li.toggleAttribute('data-bereikt', li.getBoundingClientRect().top < lijn);
      });
    };
    const vraag = () => { if (!frame) frame = requestAnimationFrame(meet); };
    el.dataset.live = 'true';
    meet();
    addEventListener('scroll', vraag, { passive: true });
    addEventListener('resize', vraag);
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', vraag); removeEventListener('resize', vraag); };
  }, []);

  return <section className="el-werk" aria-labelledby="el-t-werk">
    <div className="el-rand el-werk-raster">
      <div className="el-werk-kop">
        <h2 id="el-t-werk">Zo regelen we <span>uw elektrawerk.</span></h2>
        <p>We bespreken uw wensen en stemmen de werkzaamheden met u af.</p>
      </div>
      <ol className="el-stappen" ref={ref}>
        {STAPPEN.map(([kop, tekst], i) => <li key={kop}>
          <span className="el-nr" aria-hidden="true">{i + 1}</span>
          <div>
            <h3>{kop}</h3>
            <p>{tekst}</p>
          </div>
        </li>)}
      </ol>
    </div>
  </section>;
}
