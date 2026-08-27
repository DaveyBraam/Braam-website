export const siteConfig = {
  name: "Service & Montagebedrijf Rob Braam",
  shortName: "Braam Service & Montage",
  url: "https://braam-premium-concept.dbinstallati-8446.chatgpt.site",
  locale: "nl_NL",
  logo: "/brand/rob-braam-logo.png",
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
