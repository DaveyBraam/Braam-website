import { werkwijze } from "./fotos";

/* De vier stappen volgen de rustige fotobeweging van Contact: elke stap heeft
   een eigen afdruk die bij het voorbijscrollen zacht binnen zijn kader schuift.
   Zonder scrollanimaties of bij verminderde beweging blijven de foto's stil. */
export function Werkwijze() {
  return (
    <section className="pj-werk" aria-labelledby="pj-werk-titel">
      <div className="pj-werk-vast">
        <div className="shell pj-werk-raster">
          <h2 id="pj-werk-titel">Zo installeren wij.</h2>
          <p className="pj-werk-intro">Van de eerste leiding tot het opgeleverde werk, in vier stappen. De foto’s zijn van onze eigen monteurs.</p>
          <ol className="pj-stappen">
            {werkwijze.map((w, i) => (
              <li key={w.stap} className="pj-stap">
                <div className="pj-stap-tekst">
                  <h3><span className="pj-stap-nr" aria-hidden="true">{i + 1}</span>{w.stap}</h3>
                  <p>{w.tekst}</p>
                  <p className="pj-stap-foto">Foto: {w.foto.titel.toLowerCase()}, {w.foto.stadium.toLowerCase()}</p>
                </div>
                <figure className="pj-stap-afdruk">
                  <img src={w.foto.src} alt={w.foto.alt} loading="lazy" decoding="async" />
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
