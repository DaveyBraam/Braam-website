# Cv-ketelpagina — inhoud en voorstel voor de 3D-opening




## Opbouw van het eerste tekstvak — 9 september 2026

Na de volledige fade van het witte startscherm wordt het eerste tekstvak opgebouwd. De rand begint bovenaan in het midden en splitst in twee gelijktijdige lijnen: linksom en rechtsom langs het vak, tot ze na 1,2 seconde onderaan in het midden samenkomen. Het witte vlak komt al vanaf 0,06 seconde op en is vóór het sluiten van de rand volledig zichtbaar. Vanaf 0,68 seconde vloeien achtereenvolgens het label, de kop, de alinea, de voetnoot en de scrollaanwijzing naar binnen. Elke tekstgroep vervaagt in 0,95 seconde van transparant en licht onscherp naar scherp, met slechts zes pixels verplaatsing. De volledige opbouw duurt circa 2,3 seconde. De bestaande blauwe kopkleuren blijven behouden.

De opening is verborgen tijdens de overgang vanuit de studio en wordt pas gestart wanneer het startscherm sluit. De animatie draait één keer bij ‘Start het verhaal’. De gebruikelijke scrollbeweging blijft daarna op het buitenste tekstvak werken. ‘Ga direct naar informatie’, de leesweergave en verminderde beweging tonen de teksten direct. De opbouw is verdeeld over een SVG-rand, een papierlaag en de bestaande HTML-tekst; er is geen tekst in het 3D-model toegevoegd.

Gerichte lintcontrole, productiebuild, artifactcontrole en serverrender van de pagina zijn geslaagd. Geen aanvullende visuele browsertest of publicatie uitgevoerd.

## Startscherm en navigatie — 9 september 2026

De cv-ketelpagina opent nu met een schermvullend leeg wit studiovlak. Hier staan uitsluitend **Start het verhaal** en **Ga direct naar informatie**. De woning laadt op de achtergrond. Start wacht zo nodig op het eerste gerenderde beeld en laat het witte vlak in circa één seconde wegvloeien. De informatiekeuze blijft ook tijdens het laden beschikbaar en gaat rechtstreeks naar `#cv-informatie`.

`CvJourneyEntry.tsx` beheert de keuze, focus, scrollblokkering en overgang met een native modaal dialoogvenster. Escape gaat eveneens naar informatie. Bij minder beweging is de overgang direct en blijft de leesweergave beschikbaar; zonder JavaScript wordt het startscherm overgeslagen via de noscript-opmaak. De gedeelde hoogtemeting in `cv-woning-layout.ts` reserveert vooraf de reisruimte, zodat overslaan niet hoeft te wachten op het model.

De bestaande `SiteHeader` heeft een optionele `hideOnScroll`-instelling die alleen voor `/cv-ketels` is ingeschakeld. Vanaf 12 pixels scrollen verdwijnen logo, desktopnavigatie, mobiel menu en contactstrook. Verborgen navigatie is niet aanklikbaar of bereikbaar met Tab; geopende menu’s sluiten. Helemaal bovenaan verschijnt de navigatie opnieuw. De plaats in de documentstroom blijft gereserveerd, zodat er geen layoutsprong ontstaat.

Controle: gerichte lintcontrole zonder fouten; productiebuild en artifactcontrole geslaagd; de productieroute bevat precies twee startkeuzes, één H1, de informatiebestemming en het leesalternatief. De onderhoudsroute rendert zonder startscherm. De drie bestaande Cloudflare-typefouten buiten deze wijziging blijven aanwezig. Geen visuele browsertest of publicatie uitgevoerd in deze stap.

## Actuele integratie — 9 september 2026

De goedgekeurde woningreis is nu geïntegreerd op `/cv-ketels`, ter vervanging van de oude getekende opening. De oorspronkelijke websitekop levert het bestaande Rob Braam-logo en de navigatie. Rechtsboven staat alleen **Ketelwijzer**, overeenkomstig de laatste correctie van de opdrachtgever.

- `app/components/CvWoningJourney.tsx`: dezelfde vijf teksthoofdstukken en het kleinere gasleidingvak, als leesbare HTML.
- `app/lib/cv-woning-scene.js`: de goedgekeurde camera, belichting en doorzicht, gekoppeld aan de scrollklok van de website; ruimtelijke scène wordt opgeruimd bij het verlaten van de pagina.
- `app/cv-woning.css`: geïsoleerde opmaak van de woningreis; normale documentstroom, geen vastgepinde hero en geen proefbediening.
- `public/models/cv-woning/woning.glb` en `motion.json`: identieke kopieën van de goedgekeurde woning en de camerabeweging uit `../previz-woning`. Geen nieuwe modellen of verandering aan de installatie.
- De lengte van de reis volgt de hoogte van het vervolg plus de websitekop en footer, met een minimum van 3,5 schermhoogten. Hierdoor beslaat de reis ongeveer de helft van de volledige pagina. De bestaande vervolgsecties staan in `#cv-vervolg`; de link ‘Direct naar informatie’ gaat naar `#cv-informatie`.
- Bij minder beweging, zonder JavaScript of bij een laadfout blijven de volledige teksten beschikbaar in een normale leesweergave. De verhouding van 50% geldt voor de geanimeerde versie.
- Preview: `http://127.0.0.1:5180/cv-ketels`. Bestaande proef op poort 8768 is ook voorzien van het originele logo en het korte label.

Controle: gerichte lintcontrole zonder fouten; Vinext-productiebuild en artifactcontrole; succesvolle render van de ontwikkel- en productieroute, één H1, juiste hoofdstukken, origineel logo, bestaande formulierlinks en gelijke model/camerabestanden. De brede TypeScript-controle meldt uitsluitend reeds aanwezige ontbrekende Cloudflare-typen in `db/index.ts` en `worker/index.ts`. In deze integratiestap is geen aanvullende visuele browsertest uitgevoerd. Geen publicatie aangevraagd; de bestaande Sites-publicatie blijft buiten deze lokale integratiestap.

De oudere opdrachten hieronder zijn historie en vervangen de actuele woningreis niet.

## Actuele opdracht — 9 september 2026

Alleen opening-previz. Originele cv-concept.glb plus de inmiddels aangeleverde concentrische-rookgasbuis-dakdoorvoer.glb. Geen andere HVAC-onderdelen. Eén continue camera, abstract detail naar onthulling, producthold met ketelbehuizing circa 40% beeldhoogte, asymmetrisch naar rechts met negatieve ruimte links, afvoer van boven/achter met rustige seating. Alle materialen en geometrie intact. Geen vervagen. Pure omkeerbare tijdlijn van 20 seconden op de bestaande werkroute. Bewerkbare Blender-scene en controlebeelden staan in ../previz-opening.

Higgsfield 3D Jutsu expliciet gevraagd; browserproject aangemaakt op https://higgsfield.ai/3d-jutsu/fdaf1140-cd45-41db-9607-a10685e57ada. Native GLB-import wordt gecontroleerd; lokaal bewerkbare opening is beschikbaar. Geen publieke websitepublicatie gevraagd of uitgevoerd.


## Vorige opdracht — 8 september 2026

De opdrachtgever heeft de vorige scrollrichting expliciet geschrapt. De tablet, particles, donkere studio en volledige installatie-reis worden niet meer gebruikt.

- Werkroute `/cv-ketel-scene`: geïsoleerde witte 16:9-previz met afspelen/pauzeren, omkeerbare tijdlijn en faseknoppen buiten het 3D-beeld. Nog geen uiteindelijke scrollkoppeling of HTML-campagnetekst.
- Bevestiging opdrachtgever: gebruik ketel en rookgas uit hetzelfde bestaande GLB; licht later alleen het rookgasgedeelte uit. Geen apart rookgasmodel, nieuwe montageonderdelen of verzonnen verbindingen.
- Bron blijft `public/models/cv-fotoreferentie/cv-concept.glb`, ongewijzigd. Alleen objecttransformaties en tijdelijk verminderde zichtbaarheid van de behuizing tijdens het rookgasdetail.
- Volgorde: leeg → binnenkomst vanuit de diepte met vertraging en klein uitdempend rustmoment → producthold → links plaatsen met negatieve ruimte rechts → bestaande rookgasbuis uitlichten → terug naar totaal met subtiele rotatie → eindhold.
- Camera blijft stil bij binnenkomst en zijwaartse verplaatsing. Eén langzame detailbeweging heen en terug. Geen losse-onderdelenassemblage omdat het bronmodel één installatie blijft.
- Bewerken: `app/components/cv-opening-motion.ts` voor timing/transformaties; `CvOpeningPreviz.tsx` voor render/bediening; `app/cv-opening-previz.css` voor de werkinterface.
- De dienstenpagina is teruggezet op haar oorspronkelijke openingscomponent; bestaande tekst en overige inhoud blijven behouden. Oude experimentbestanden zijn bewaard maar niet aangesloten op deze previz.
- Verificatie: gerichte lint/TypeScript-controle, productiebuild en artefactcontrole. 1001 tijdlijnsamples voor- en achteruit geven identieke, eindige posities; lege start, rookgasdetail en compleet eindbeeld gecontroleerd. Productkadrering in browser bekeken. Geen publicatie.

## Historische briefing — vervangen door de opdracht hierboven

Status 7 september 2026: Three.js-scrollverhaal geïmplementeerd op `/cv-ketels` en de lokale werkroute `/cv-ketel-scene`. Dit ontwerp is inmiddels vervallen. De oorspronkelijke briefing hieronder is bewaard als bron.
Vastgelegd op 6 september 2026 uit de instructies van de opdrachtgever en de bestaande broncode.

## Actuele stand na de modelbespreking

- De opdrachtgever heeft de volgorde bevestigd: eerst losse modellen, daarna de webscène, daarna scrollsturing.
- Beschikbaar: `cv-concept.glb`, `cv-aansluitmodule.glb` en `vloerverwarming-verdeler.glb`, onder `public/models/cv-fotoreferentie/`.
- Bevestigde vijf aansluitingen, van voren links naar rechts: cv-aanvoer, warm water, gas, koud water, cv-retour.
- Verdeler: blauwe bovenrail en rode onderrail, witte vloerslangen en twee primaire cv-aansluitpunten rechts. Geen leidingen tussen de ketel en verdeler tekenen zonder verdere afspraken.
- Rookgas: de latere scène houdt rekening met recht omhoog door het dak of een gevelroute (voorbeeld opdrachtgever: circa 30 cm omhoog en 90° richting gevel). Hiervoor is geen nieuw model gevraagd. De huidige korte rechte buis toont slechts het begin van de afvoer.
- De scrollopening heeft negen hoofdstukken: toestel, aansluitingen, verwarmingssysteem, vermogen/comfort, rookgas, gasleiding, meten, gehele installatie, onderhoud. De camera en aandacht volgen de scroll in beide richtingen, met leesrust tussen overgangen.
- De bestaande openingsteksten zijn behouden en aangevuld met de expliciet gevraagde uitleg. Alle overige inhoud van de cv-dienstenpagina is ongewijzigd. Geen nieuwe modellen, foto's of verbindende leidingroutes toegevoegd. Geen publicatie uitgevoerd.
- Verificatie: Vinext-build en gerichte TypeScript- en lintcontroles geslaagd; modelbestanden en camerabereik op drie canvasformaten gecontroleerd. De brede TypeScript-controle meldt bestaande ontbrekende Cloudflare-types buiten deze scène. `npm run build` mist lokaal GNU timeout; de onderliggende Vinext-build slaagt wel.
- Browsercontrole: desktop, telefoonformaat 390×844 en tabletformaat 820×1180. Scroll, hoofdstukknoppen en teruggaan gecontroleerd; smalle canvasbreedte en tekstovergangen gecorrigeerd. Leesstand bewaart nu de positie van het hoofdstuk. Verminderde beweging en lage landschapschermen krijgen de volledige leesweergave. Dit zijn browserformaten, geen fysieke iPhone/iPad-tests.
- Techniek: `app/components/CvKetelScene.tsx`, `app/components/cv-story.ts` en `app/cv-ketel-scene.css`. De oude `CvDoorsnede` en modelbronnen zijn niet verwijderd. Lokale preview: `http://127.0.0.1:5173/cv-ketel-scene`.

## Latere aanvulling: eerste ketelmodel

De opdrachtgever heeft vervolgens twee foto's aangeleverd en een vereenvoudigd, wandgemonteerd model gevraagd: behuizing volgens de eerste foto, vijf punten onderaan voor later leidingwerk, één rechte concentrische buis bovenop en een eenvoudige achterkant. De tweede foto dient als leidingwerkreferentie. Na de expliciete opmerking dat de eerste foto "Hydraulic Station" vermeldt, heeft de opdrachtgever aangegeven dat die tekst weg mag en het Vaillant-logo behouden moet blijven.

Deze aanwijzingen zijn uitgewerkt in `scripts/blender/cv-fotoreferentie/cv-concept.blend` en `public/models/cv-fotoreferentie/cv-concept.glb`. Het model is een vormstudie volgens deze aanwijzingen, geen geverifieerd fabrikantmodel. De vijf aansluitfuncties zijn bekend, maar hun volgorde van links naar rechts is nog niet bevestigd. Zie `scripts/blender/cv-fotoreferentie/README.md` voor de referenties, renders en beperkingen. De websitepagina is nog niet gewijzigd.

## Bevestigd door de opdrachtgever

- De uitleg gaat over zowel nieuwplaatsing als vervanging van een cv-ketel.
- Bij de offerte en plaatsing beoordeelt Braam de hele verwarmingsinstallatie: radiatoren, vloerverwarming of een combinatie.
- De rookgasafvoer moet kloppen. De opdrachtgever geeft aan volgens de gasketelwet en BRL 6000-25 te werken.
- Onderhoud kan aanleiding geven om een ander toestel te adviseren, vanwege veiligheid of omdat vervanging verstandiger is. Geen algemene vervangplicht of vaste vervangleeftijd toevoegen.
- Alle bestaande paginateksten moeten behouden blijven.
- Geen verzonnen foto's, installatieonderdelen, aansluitingen of leidingroutes.
- Het bestaande woningmodel is een afgewezen proef, niet de basis voor het ontwerp.
- Ook telefoon en iPad krijgen een 3D-reis.
- De opdrachtgever staat open voor een andere beeldrichting dan een vlucht door een woning.

## Voorgestelde beeldrichting: langs de onderdelen die we beoordelen

Eén rustige, ruimtelijke presentatie van afzonderlijke installatieonderdelen.
Scrollen beweegt de camera van een overzicht naar het onderwerp dat de tekst bespreekt.
De onderdelen staan als losse voorbeelden in beeld, niet als een werkend installatieschema.
Geen gebouw reconstrueren, geen verborgen leidingen laten zien en geen apparaten met bedachte leidingen verbinden.

Een echte radiator, vloerverwarmingsverdeler, ketel en rookgasafvoer mogen alleen op basis van bruikbare modellen of gecontroleerde referenties worden getoond.
De onderlinge plaatsing in de presentatie is vormgeving; technische aansluitingen en afmetingen zijn dat niet.
Een foto kan als bewijsbeeld dienen, maar mag niet zonder verdere referenties worden omgezet in een zogenaamd exact 3D-model.

De huidige blauw-witte huisstijl blijft de basis. De camera beweegt rustig, met leesrust per onderwerp.
Voor telefoon en iPad wordt de camerastand en tekstplaatsing aangepast; geen losse drag-bediening nodig om de uitleg te volgen.
Wie minder beweging heeft ingesteld krijgt dezelfde volledige teksten in een rustige leesweergave.

Dit is een voorstel, geen reeds door de opdrachtgever gekozen stijl.

## Verhaalvolgorde

| Hoofdstuk | Wat de bezoeker begrijpt | Tekstbron | Benodigd beeld |
| --- | --- | --- | --- |
| 1. De hele installatie | Nieuwplaatsing en vervanging beginnen bij de situatie in de woning. | Bestaande opening 1 en 2. | Overzicht van de afzonderlijke, onderbouwde onderdelen. |
| 2. Hoe wordt de woning verwarmd? | Radiatoren, vloerverwarming of een combinatie horen bij de beoordeling, samen met vermogen en warmwatercomfort. | Bestaande opening 3 plus aanvulling A. | Echte radiator en/of verdeler; geen verzonnen vloerdoorsnede. |
| 3. Afvoer en luchttoevoer | Het toestel, de verbrandingsluchttoevoer en rookgasafvoer moeten samen beoordeeld worden. | Bestaande opening 4 plus aanvulling B. | Een gedocumenteerd afvoervoorbeeld dat past bij het gekozen toestel; geen universele dakroute. |
| 4. Controleren en opleveren | Plaatsing omvat ook de bestaande controles en metingen, gevolgd door een rapport. | Bestaande opening 5 en 6. | Toestel of echte projectfoto. Alleen werkelijk beschikbare meetapparatuur of een geanonimiseerd rapport afbeelden. |
| 5. Waarom we verder kijken | Veiligheid gaat over meer dan alleen het toestel. | Bestaande opening 7. | Terug naar het overzicht. |
| 6. Ook bij onderhoud | Het onderhoudsteam beoordeelt opnieuw en kan gemotiveerd vervanging adviseren. | Bestaande opening 8 plus aanvulling C. | Toestel of echte onderhoudsfoto, gevolgd door de bestaande contactknop. |

## Bestaande teksten: letterlijk behouden

De volledige verdere pagina staat in `app/cv-ketels/page.tsx` en blijft behouden, inclusief merken, certificeringsuitleg, werkwijze, onderhoud, prijzen, kennisbank en contact.
Onderstaande momentopname komt uit `app/components/CvDoorsnede.tsx`; geen van deze teksten mag bij de nieuwe opening verdwijnen.

### 1

Een nieuwe ketel staat nooit op zichzelf.

Het toestel is één onderdeel van een installatie die als geheel moet kloppen.

### 2

Eerst kijken we wat er nu staat.

Hoe de bestaande installatie is opgebouwd bepaalt wat er kan. Daar begint het, niet bij het toestel.

### 3

Welk vermogen, en hoeveel warm water?

Dat hangt af van uw huishouden, niet van wat er nu hangt. We bepalen welk vermogen en welk warmwatercomfort bij u passen.

### 4

De afvoer is geen bijzaak.

Rookgasafvoer en luchttoevoer moeten passen bij het toestel én bij het kanaal dat er al ligt. Dat bepaalt vaak wat er wel en niet kan.

### 5

De gasleiding wordt beproefd, niet aangenomen.

Na plaatsing beproeven we de leiding op lekdichtheid, stellen we het toestel af en leggen we de metingen vast.

### 6

En dan wordt het nagemeten.

Werking, afstelling en rookgassen. U krijgt een oplevering met de metingen en een rapport, zodat u weet wat er gemeten is.

### 7

De ketel is het makkelijke deel.

Wat eromheen zit bepaalt of het veilig is.

Daarom zijn we CO-gecertificeerd. We meten, we leveren op met een rapport, en u krijgt te horen wat er gemeten is.

### 8

Wie hem plaatst, onderhoudt hem daarna.

Dezelfde mensen, van de offerte tot de jaarlijkse beurt. Voor Intergas, Remeha, Nefit en Vaillant tot en met 40 kW.

Contactknop: Bespreek uw cv-ketel. Bestaande bestemming: `/offerte-aanvragen?dienst=cv-ketel`.

## Aanvullende concepttekst op basis van de nieuwe uitleg

Deze teksten zijn nieuwe voorstellen, geen bestaande of al goedgekeurde paginateksten.

### A. Radiatoren, vloerverwarming of allebei?

Bij de offerte en de plaatsing kijken we naar uw hele verwarmingsinstallatie. Verwarmt u met radiatoren, vloerverwarming of een combinatie? We nemen die situatie mee bij de keuze en plaatsing van uw cv-ketel. Dat geldt voor een eerste installatie én bij vervanging.

### B. Veilig werken volgens de geldende regels

Wij werken volgens de regels van de gasketelwet en BRL 6000-25. Daarbij horen het toestel, de verbrandingsluchttoevoer en de rookgasafvoer. We controleren de installatie voordat we het toestel voor gebruik vrijgeven.

De uitspraak over de werkwijze van Braam is gebaseerd op de mededeling van de opdrachtgever. In dit onderzoek is geen bedrijfscertificaat geverifieerd.

### C. Onderhoud kan ook tot een vervangingsadvies leiden

Ook tijdens onderhoud kan blijken dat vervanging veiliger of verstandiger is. We leggen uit wat we aantreffen en waarom we dat advies geven.

## Nauwkeurigheid van de regelgeving

- Het wettelijke CO-stelsel en BRL 6000-25 zijn niet hetzelfde: BRL 6000-25 is een toegelaten certificatieschema. De verplichte CO-certificering geldt sinds 1 april 2023; noem de wet in nieuwe teksten niet tijdloos "nieuw". Bron: [InstallQ](https://installq.nl/co-certificering).
- De verplichte CO-certificering ziet op de aangewezen werkzaamheden aan het gasverbrandingstoestel en de bijbehorende verbrandingsluchttoevoer en rookgasafvoer. Werkzaamheden aan gasleidingen en warmteafgiftesystemen vallen niet onder die certificeringsplicht. De beoordeling van radiatoren en vloerverwarming wordt daarom als de werkwijze van Braam beschreven, niet als een BRL-plicht voor elk onderdeel. Bronnen: [InstallQ](https://installq.nl/co-certificering), [IPLO](https://iplo.nl/regelgeving/regels-voor-activiteiten/gebruiken-bouwwerk/rijksregels/gasverbrandingsinstallaties/).
- Vervangingsadvies volgt in deze tekst uit de uitleg van de opdrachtgever. Geen algemene wettelijke vervangplicht, gegarandeerde besparing, vaste levensduur of automatisch oordeel "oud = onveilig" toevoegen.

## Aanwezig en nog nodig

- Aanwezig: `public/projects/installaties/installatie-08.webp`, een projectfoto die de huidige galerij aanduidt als cv-ketel en leidingwerk tijdens inbedrijfstelling. De foto is bekeken; er is geen technische keuring van de afgebeelde installatie uitgevoerd.
- Aanwezig maar niet geschikt als gevalideerde toestelreferentie: `public/huis3d/ketel.glb`, een eerder zelf opgebouwd generiek model met aangenomen details.
- Het afgewezen woningmodel wordt niet opnieuw als ontwerpuitgangspunt gebruikt.
- Nog nodig: de keuze voor een werkelijk geplaatst merk en type ketel; daarna kunnen geschikte fabrikantmodellen en technische tekeningen gericht worden gezocht.
- Voor radiator, vloerverwarmingsverdeler en rookgasafvoer: de werkelijk gebruikte producten of een door de opdrachtgever aangewezen voorbeeldsituatie. Details worden niet op basis van aannames ingevuld.
- Als een bruikbaar 3D-model ontbreekt: bespreek een rondgang op basis van echte opnamen. Scrollgestuurde video geeft camerabeweging door een echte situatie, maar is geen vrij bestuurbaar 3D-model. Genereer geen verbindende beelden of verborgen onderdelen.

De websitecode en de bestaande assets zijn bij het opstellen van deze briefing niet gewijzigd. Er zijn geen beelden gegenereerd of betaalde renders gestart.
