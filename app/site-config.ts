export const siteConfig = {
  name: "Service & Montagebedrijf Rob Braam",
  shortName: "Braam Service & Montage",
  url: "https://braam-premium-concept.braam-site-installatie.workers.dev",
  locale: "nl_NL",
  logo: "/brand/rob-braam-logo.png",
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

/* Kantoortijden, van de eigenaar (9 oktober 2026): maandag tot en met vrijdag,
   vrijdag maar tot 14.00. Eén bron voor /contact, /service en de 404. */
export const kantoortijden = [
  { dagen: "Maandag t/m donderdag", tijden: "8.00 – 17.00" },
  { dagen: "Vrijdag", tijden: "8.00 – 14.00" },
  { dagen: "Zaterdag en zondag", tijden: "Gesloten" },
] as const;

export const kantoortijdenZin = "maandag tot en met donderdag van 8.00 tot 17.00 en op vrijdag van 8.00 tot 14.00";

/* Cloudflare Turnstile tegen spam op de aanvraagformulieren. De sitekey is
   openbaar; de geheime sleutel staat als TURNSTILE_SECRET bij de worker. Leeg
   laten zolang Turnstile nog niet is aangemaakt: dan tonen de formulieren geen
   controle en houdt alleen het verborgen veld robots tegen. */
export const turnstileSiteKey = "0x4AAAAAAFSZXlN2foys8GtA";

/* Reviews komen uit de review-app (~/Braam-reviews). Die geeft alleen reviews
   die de beheerder heeft goedgekeurd en waarvoor de klant toestemming gaf, en
   staat het ophalen alleen toe vanaf het adres in zijn SITE_ORIGIN. Gaat de site
   naar robbraam.com, pas dan SITE_ORIGIN in de review-app aan. */
export const reviewsApp = "https://braam-reviews.braam-site-installatie.workers.dev";
export const reviewsFeed = `${reviewsApp}/api/publiek/reviews`;
export const reviewSchrijven = `${reviewsApp}/ervaring`;
