# /projecten

Rustig fotoboek van eigen werk, gebouwd 7 oktober 2026 met scroll-craft (eerst als /projecten-v2), live sinds dezelfde dag.
Brief: `braam-premium-concept/scrollcraft/builds/projecten-v2/BRIEF.md`.

- **Kop** (`Kop.tsx`): drie afdrukken op een stapel met een label; bij scrollen bewegen licht,
  achterste, middelste en voorste afdruk elk met een eigen snelheid.
- **Zo installeren wij** (`Werkwijze.tsx`): de piek. Op de computer blijft het deel staan en valt per
  stap (inpassen, monteren, inregelen, opleveren) een foto op de stapel. Telefoon en zonder beweging:
  stappen onder elkaar met hun foto.
- **Alle foto's** (`Fotoboek.tsx`): kiezen per soort, aanklikken voor groot beeld met vorige/volgende
  (ook pijltjestoetsen en Esc).
- Klanten (twee echte reviews) en een donkerblauw slot met de lege plek "Uw installatie".

## Foto's toevoegen

Zet het bestand in `public/projects/` en voeg één regel toe in `fotos.ts`. Geen plaatsnamen.
Liggende foto's krijgen `liggend: true`. Een nieuwe soort werk (bijv. Airco) eerst in `soorten` zetten.
