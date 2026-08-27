export const services = [
  {
    number: "01",
    title: "Warmtepompen",
    href: "/warmtepompen",
    tag: "Hybride & full-electric",
    text: "Na uw aanvraag beoordelen we de woning- en installatiegegevens en leggen we uit welke vervolgstap nodig is.",
  },
  {
    number: "02",
    title: "Cv-ketels",
    href: "/cv-ketels",
    tag: "Veilig & CO-gecertificeerd",
    text: "Een nieuwe ketel, vervanging of onderhoud: veilig uitgevoerd door gecertificeerde vakmensen uit ons eigen team.",
  },
  {
    number: "03",
    title: "Airconditioning",
    href: "/airco",
    tag: "Koelen én verwarmen",
    text: "Wij berekenen wat de ruimte nodig heeft en plaatsen een airco waarmee u gericht kunt koelen én verwarmen.",
  },
  {
    number: "04",
    title: "Elektra",
    href: "/elektra",
    tag: "Alles in eigen hand",
    text: "Van groepenkast tot extra aansluiting. Ook de voeding voor een warmtepomp of airco regelen we zelf.",
  },
];

const comfortMaintenanceBenefits = [
  "Voorrijkosten inbegrepen",
  "Arbeidsloon inbegrepen binnen de abonnementsafspraken",
  "Materiaal is niet inbegrepen en wordt apart berekend",
];

const comfortBreakdownBenefits = [
  "24/7 storingsservice",
  "Voorrijkosten inbegrepen",
  "Arbeidsloon inbegrepen voor storingswerk binnen de abonnementsafspraken",
  "Materiaal is niet inbegrepen en wordt apart berekend",
];

const comfortPlusMaintenanceBenefits = [
  "Voorrijkosten inbegrepen",
  "Arbeidsloon inbegrepen binnen de abonnementsafspraken",
  "Materiaal binnen de onderhoudsmantel inbegrepen",
];

const comfortPlusBreakdownBenefits = [
  "24/7 storingsservice",
  "Voorrijkosten inbegrepen",
  "Arbeidsloon inbegrepen voor storingswerk binnen de abonnementsafspraken",
  "Materiaal binnen de onderhoudsmantel inbegrepen",
];

export const subscriptions = [
  {
    id: "cv-comfort",
    label: "Cv-ketel",
    title: "Comfort",
    price: "139",
    monthlyPrice: "11,58",
    description: "Jaarlijks onderhoud en storingsservice voor uw cv-ketel. Materiaal wordt apart berekend.",
    maintenanceFeatures: [
      "Ieder jaar een geplande controle van uw cv-ketel",
      ...comfortMaintenanceBenefits,
    ],
    breakdownFeatures: comfortBreakdownBenefits,
  },
  {
    id: "cv-comfort-plus",
    label: "Cv-ketel",
    title: "Comfort Plus",
    price: "239",
    monthlyPrice: "19,92",
    description: "Jaarlijks onderhoud en storingsservice voor uw cv-ketel, met materiaal binnen de onderhoudsmantel.",
    maintenanceFeatures: [
      "Ieder jaar een geplande controle van uw cv-ketel",
      ...comfortPlusMaintenanceBenefits,
    ],
    breakdownFeatures: comfortPlusBreakdownBenefits,
    featured: true,
    featuredLabel: "Materiaal inbegrepen",
  },
  {
    id: "hybride-comfort",
    label: "Hybride warmtepomp + cv-ketel",
    title: "Comfort",
    price: "289",
    monthlyPrice: "24,08",
    description: "Jaarlijks onderhoud en storingsservice voor uw hybride warmtepomp en cv-ketel. Materiaal wordt apart berekend.",
    maintenanceFeatures: [
      "Ieder jaar een geplande controle van beide toestellen",
      ...comfortMaintenanceBenefits,
    ],
    breakdownFeatures: comfortBreakdownBenefits,
  },
  {
    id: "hybride-comfort-plus",
    label: "Hybride warmtepomp + cv-ketel",
    title: "Comfort Plus",
    price: "429",
    monthlyPrice: "35,75",
    description: "Jaarlijks onderhoud en storingsservice voor uw hybride warmtepomp en cv-ketel, met materiaal binnen de onderhoudsmantels.",
    maintenanceFeatures: [
      "Ieder jaar een geplande controle van beide toestellen",
      ...comfortPlusMaintenanceBenefits,
    ],
    breakdownFeatures: comfortPlusBreakdownBenefits,
    featured: true,
    featuredLabel: "Materiaal inbegrepen",
  },
  {
    id: "all-electric-comfort",
    label: "All-electric warmtepomp",
    title: "Comfort",
    price: "239",
    monthlyPrice: "19,92",
    description: "Jaarlijks onderhoud en storingsservice voor uw all-electric warmtepomp. Materiaal wordt apart berekend.",
    maintenanceFeatures: [
      "Ieder jaar een geplande controle van uw warmtepomp",
      ...comfortMaintenanceBenefits,
    ],
    breakdownFeatures: comfortBreakdownBenefits,
  },
  {
    id: "all-electric-comfort-plus",
    label: "All-electric warmtepomp",
    title: "Comfort Plus",
    price: "379",
    monthlyPrice: "31,58",
    description: "Jaarlijks onderhoud en storingsservice voor uw all-electric warmtepomp, met materiaal binnen de onderhoudsmantel.",
    maintenanceFeatures: [
      "Ieder jaar een geplande controle van uw warmtepomp",
      ...comfortPlusMaintenanceBenefits,
    ],
    breakdownFeatures: comfortPlusBreakdownBenefits,
    featured: true,
    featuredLabel: "Materiaal inbegrepen",
  },
];

export const contact = {
  phone: "073 622 2199",
  phoneHref: "tel:+31736222199",
  planning: "planning@robbraam.com",
  service: "service@robbraam.com",
  address: "Jacob van Wassenaerstraat 10",
  postal: "5224 GG 's-Hertogenbosch",
};
