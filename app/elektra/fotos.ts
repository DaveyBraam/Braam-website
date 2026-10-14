/* Eigen foto's van elektrawerk. Zolang deze lijst leeg is, staat het fotoblok niet op de
   pagina; de rest is compleet zonder.

   Een foto toevoegen:
   1. zet het bestand in public/elektra/ (liefst .webp of .jpg, minstens 1600 px breed);
   2. voeg hieronder één regel toe. Foto's staan per twee naast elkaar, staand (3:4).

   Afspraken (zoals bij /projecten): alleen eigen werk, geen plaatsnamen, geen herkenbare
   klanten of monteurs zonder akkoord, en de tekst zegt wat er te zien is. */

export type ElektraFoto = {
  src: string;
  /** Wat er te zien is, kort: "Nieuwe groepenkast met drie aardlekschakelaars". */
  titel: string;
  alt: string;
  breedte: number;
  hoogte: number;
};

export const fotos: ElektraFoto[] = [
  { src: '/elektra/groepenkast-1.webp', titel: 'Nieuwe groepenkast in een bestaande meterkast', alt: 'Nieuwe Hager Vision-groepenkast met aardlekschakelaars in een bestaande meterkast, tijdens het werk', breedte: 1000, hoogte: 1333 },
  { src: '/elektra/groepenkast-2.webp', titel: 'Nieuwe groepenkast met strak weggewerkte leidingen', alt: 'Meterkast met een nieuwe Hager Vision-groepenkast, slimme meter en strak weggewerkte leidingen', breedte: 1000, hoogte: 1333 },
];
