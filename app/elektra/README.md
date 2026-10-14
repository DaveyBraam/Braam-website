# Elektra (versie 4): sfeer, overtuigende tekst en een lamp die aangaat

Worktree `~/Desktop/Website v3/elektra-ontwerp` (branch `ontwerp-elektra`, vanaf origin/main
dd29892). Lokaal: launch-config `braam-elektra`, poort 5238. Live sinds 14 oktober 2026 (7ea72ea).
Brief: `scrollcraft/builds/elektra/BRIEF.md`.

## Opbouw
1. **Opening** (`KopLamp.tsx`): licht papier met kop, knop en telefoon; rechts een schemerkamer die
   in het papier oplost. Bij binnenkomst zijn de lampen uit; tijdens het scrollen gaan de drie
   glazen lampen één voor één aan (met spiegeling in het raam) en groeit het kamerlicht per lamp.
   Tekst staat stil. Momenten in `START` in KopLamp.tsx. Beelden: `public/elektra/kamer-uit`,
   `kamer-licht` (kamerlicht zonder lampen) en `lamp-1..3` (losse lampen met alfa), elk ook `-m`
   voor de telefoon; sfeerbeeld zonder merk of mensen. Bron in `scrollcraft/builds/elektra/bron/`.
2. Drie vinkjes. 3. Airco of warmtepomp / wij verzorgen ook de elektra (licht, twee kolommen).
4. Eigen foto's (`fotos.ts`, verschijnt pas als er foto's zijn).
5. Diensten, werkwijze (`Werkwijze.tsx`), warmtepomp/airco, vragen, donkerblauwe slotband.

## Eigen foto's toevoegen
Zet de foto's in `public/elektra/` en voeg per foto één regel toe in `fotos.ts` (instructie staat
bovenin dat bestand). De eerste foto wordt groot getoond.

## Tekstwijziging — 14 oktober 2026 (lokale preview)
Op verzoek van Davey is de volledige teamsectie met foto verwijderd. De paginateksten
zijn herschreven rond: ook voor elektrawerk kunt u bij ons terecht; onze eigen
elektricien verzorgt een aparte groep als die nodig is bij de plaatsing van een
airco of warmtepomp. Vormgeving, lampanimatie, werkfoto's en contactroutes behouden.
Gerichte ESLint-controle geslaagd; nieuwe tekst en afwezigheid van de teamsectie
gecontroleerd in de lokale browser. Deze tekstwijziging is nog niet gepubliceerd.

## Live zetten
`app/elektra/` en `public/elektra/` gaan mee; verder niets. Publiceren volgens de deploy-notitie
(vinext build, tests, push naar main, wrangler deploy --keep-vars).
