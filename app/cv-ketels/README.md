# Cv-ketels

Route `/cv-ketels`, gebouwd op 8 oktober 2026 met scroll-craft (eerst als `/cv-ketels-v2`), live sinds 8 oktober 2026. Brief:
`braam-premium-concept/scrollcraft/builds/cv-ketels-v2/BRIEF.md`.

Dezelfde inhoud als `/cv-ketels`, als keuringsronde langs de eigen 3D-ketel
(`public/concept-3d/cv-ketels/installatie.glb`, met de radiator uit
`public/models/cv-fotoreferentie/`). Licht met één donker moment: bij de gasleiding
en de rookgasafvoer gaat het licht uit en wordt de installatie doorgelicht.

- `page.tsx`: alle teksten, in leesvolgorde. `data-stand` per hoofdstuk kiest de
  camerastand, `data-kant` de tekstkant (het toestel staat steeds links).
- `Reis.tsx`: het vaste podium, de scroll-meting, licht uit/aan en de controlelijst.
- `scene.ts`: three.js. Camerastanden staan bovenaan in `standen`; raamlicht,
  doorzichtige kast, gasleiding die zich vult, stromen in de afvoer, labels.
- `controles.ts`: de lijst "Wat we nalopen" (podium en slot).
- `cv-ketels-v2.css`: alles onder `main.ck`, klassen `ck-`. `--ck-rust` bepaalt hoe lang een
  tekstblok stilstaat om te lezen (75svh op desktop, 38svh op de telefoon).

Zonder WebGL of bij databesparing: de bestaande poster, alle tekst blijft. Bij
"minder beweging": de camera springt per hoofdstuk, de stromen staan stil.

De vorige pagina (product-story met de 3D-camera) staat nog als `/concept-product/cv-ketels` (noindex).
