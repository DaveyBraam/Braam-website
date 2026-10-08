/* Wat we bij elke cv-ketel nalopen. Dezelfde lijst stuurt de controlelijst
   onder het podium en de afgevinkte lijst in het slot. Alleen wat de pagina
   zelf al belooft; niets nieuws toevoegen zonder Davey. */
export const controles = [
  { id: 'ck-aansluitingen', kort: 'Aansluitingen', lang: 'Aansluitingen en leidingwerk' },
  { id: 'ck-woning', kort: 'Uw woning', lang: 'Afgestemd op uw radiatoren en regeling' },
  { id: 'ck-gasleiding', kort: 'Gasleiding', lang: 'Gasleiding apart gecontroleerd' },
  { id: 'ck-rookgas', kort: 'Lucht en rookgas', lang: 'Luchttoevoer en rookgasafvoer' },
  { id: 'ck-oplevering', kort: 'Oplevering', lang: 'Verbranding gemeten en vastgelegd' },
] as const;
