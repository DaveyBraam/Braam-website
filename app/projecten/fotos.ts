/* Alle projectfoto's op één plek. Nieuwe foto's van de monteurs toevoegen:
   1. zet het bestand in public/projects/ (liefst .webp of .jpg, minstens 960 px breed);
   2. voeg hieronder één regel toe, bovenaan als hij vooraan in het fotoboek moet.
   Het fotoboek, de tellers per soort en het grote beeld lopen vanzelf mee.

   Afspraken: alleen eigen werk, geen plaatsnamen, en de tekst zegt wat er te zien is
   (soort, korte titel, stadium), geen verkooppraat. */

export const soorten = ["Warmtepomp", "Cv-ketel", "Warm water", "Vloerverwarming"] as const;
export type Soort = (typeof soorten)[number];

export type Foto = {
  src: string;
  soort: Soort;
  titel: string;
  stadium: string;
  alt: string;
  /** Liggende foto's krijgen in het fotoboek twee kolommen. */
  liggend?: boolean;
};

export const fotos: Foto[] = [
  { src: "/projects/installaties/installatie-03.webp", soort: "Warmtepomp", titel: "Complete binnenopstelling", stadium: "Tijdens montage", alt: "Warmtepomp met voorraadvat en buffervat tijdens montage door Rob Braam" },
  { src: "/projects/installaties/installatie-02.webp", soort: "Warmtepomp", titel: "Buitenunit op het dak", stadium: "Geplaatst", alt: "Warmtepomp-buitenunit geplaatst op een plat dak door Rob Braam" },
  { src: "/projects/installaties/installatie-06.webp", soort: "Warmtepomp", titel: "Techniekruimte op maat", stadium: "Tijdens inregeling", alt: "Compact ingepaste warmtepompinstallatie in een techniekruimte" },
  { src: "/projects/warmtepomp-berlicum.jpg", soort: "Warmtepomp", titel: "Buitenunit op het balkon", stadium: "Geplaatst", alt: "Warmtepomp-buitenunit achter de balustrade van een balkon", liggend: true },
  { src: "/projects/installaties/installatie-08.webp", soort: "Cv-ketel", titel: "Ketel en leidingwerk", stadium: "Tijdens inbedrijfstelling", alt: "Nieuwe cv-ketel met vernieuwd leidingwerk tijdens inbedrijfstelling" },
  { src: "/projects/installaties/installatie-04.webp", soort: "Warmtepomp", titel: "Hybride techniekwand met voorraadvat", stadium: "Tijdens montage", alt: "Hybride warmtepompopstelling met voorraadvat en leidingwerk" },
  { src: "/projects/installaties/installatie-07.webp", soort: "Warmtepomp", titel: "Ingepast op zolder", stadium: "Tijdens montage", alt: "Warmtepomp met buffervat ingepast onder een schuin dak" },
  { src: "/projects/installaties/installatie-01.webp", soort: "Warmtepomp", titel: "Binnenunit met buffervat", stadium: "Tijdens montage", alt: "Warmtepomp-binnenunit met buffervat en leidingwerk tijdens montage" },
  { src: "/projects/vloerverwarming.jpg", soort: "Vloerverwarming", titel: "Vloerverwarming op noppenplaat", stadium: "Voor de dekvloer", alt: "Vloerverwarmingsleidingen gelegd op een noppenplaat, voordat de dekvloer erop komt" },
  { src: "/projects/installaties/installatie-05.webp", soort: "Warmtepomp", titel: "All-electric binnenopstelling", stadium: "Tijdens montage", alt: "All-electric warmtepomp-binnenopstelling met buffervat en expansievat" },
  { src: "/projects/warmtepomp-vlijmen.jpg", soort: "Warmtepomp", titel: "Buitenunit bij een renovatie", stadium: "Tijdens de verbouwing", alt: "Warmtepomp-buitenunit op poten naast de gevel van een woning in verbouwing" },
  { src: "/projects/installaties/installatie-09.webp", soort: "Warm water", titel: "Voorraadvat in de woning", stadium: "Tijdens montage", alt: "Warmwatervoorraadvat geplaatst in een technische ruimte in een woning" },
];

/* De werkwijze: per stap één foto uit de lijst hierboven. De teksten komen uit
   de bestaande projecten- en dienstpagina's; niets nieuws beloven. */
export const werkwijze = [
  { stap: "Inpassen", tekst: "Toestellen en vaten passen we praktisch in, met aandacht voor leidingroutes en bereikbaarheid voor later onderhoud.", src: "/projects/installaties/installatie-07.webp" },
  { stap: "Monteren", tekst: "Ons eigen team monteert de toestellen en het leidingwerk. Op foto’s tijdens montage ziet u soms nog vulslangen, gereedschap of afwerkmateriaal.", src: "/projects/installaties/installatie-03.webp" },
  { stap: "Inregelen", tekst: "Daarna stellen we de installatie in bedrijf en regelen we hem veilig in.", src: "/projects/installaties/installatie-06.webp" },
  { stap: "Opleveren", tekst: "We lopen de installatie na, leveren het werk op en leggen uit hoe alles werkt.", src: "/projects/installaties/installatie-02.webp" },
].map((w) => ({ ...w, foto: fotos.find((f) => f.src === w.src)! }));
