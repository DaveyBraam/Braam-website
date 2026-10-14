'use client';
import { useEffect, useRef } from 'react';

const STAPPEN = [
  ['We komen kijken.', 'We bekijken uw groepenkast, uw aansluiting en wat u in huis gebruikt. En we vragen naar uw plannen: een warmtepomp, inductiekookplaat, laadpaal of een verbouwing.'],
  ['U krijgt eerlijk advies.', 'U hoort wat nodig is en wat niet. Uitbreiden of vervangen, met vooraf een duidelijke offerte.'],
  ['Ons eigen team voert het uit.', 'Geen onderaannemers. Onze elektricien en installatiemonteur stemmen het werk op elkaar af, met één planning.'],
  ['Netjes opgeleverd.', 'We controleren de installatie, zetten de groepen duidelijk op de kast en lopen alles samen met u na.'],
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
        <h2 id="el-t-werk">Zo gaat het. <span>Rustig en duidelijk.</span></h2>
        <p>Van de eerste vraag tot de oplevering weet u waar u aan toe bent.</p>
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
