/* Het adres van de kennisbank; artikelen en klachten linken via deze regel. */
export const KENNISBANK = "/kennisbank";

export const artikelHref = (slug: string, anker?: string) => `${KENNISBANK}/${slug}${anker ? `#${anker}` : ""}`;
