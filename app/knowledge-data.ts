export const knowledgeCategories = [
  {
    slug: "cv-verwarming",
    label: "Cv & verwarming",
    shortLabel: "CV",
    description: "Praktische uitleg over cv-ketels, radiatoren, waterdruk en comfortabel verwarmen.",
  },
  {
    slug: "onderhoud",
    label: "Onderhoud",
    shortLabel: "ON",
    description: "Wanneer onderhoud nodig is, wat er wordt gecontroleerd en wat u zelf kunt bijhouden.",
  },
  {
    slug: "storingen",
    label: "Storingen",
    shortLabel: "ST",
    description: "Veilige eerste controles, herkenbare signalen en het moment om een monteur te bellen.",
  },
  {
    slug: "elektra",
    label: "Elektra",
    shortLabel: "EL",
    description: "Heldere informatie over groepenkasten, aansluitingen en veilig gebruik van elektra.",
  },
  {
    slug: "airco",
    label: "Airco",
    shortLabel: "AC",
    description: "Advies over koelen, verwarmen, onderhoud en het gebruik van een airco in huis.",
  },
  {
    slug: "besparen-advies",
    label: "Besparen & advies",
    shortLabel: "ADV",
    description: "Praktische keuzes voor lager verbruik, meer comfort en een passende installatie.",
  },
] as const;

export type KnowledgeCategorySlug = (typeof knowledgeCategories)[number]["slug"];
export type KnowledgeService = "onderhoud" | "cv-ketels" | "service" | "elektra" | "airco" | "warmtepompen";

export type ArticleNote = {
  tone: "info" | "warning" | "practice";
  title: string;
  text: string;
};

export type ArticleStep = {
  title: string;
  text: string;
};

export type ArticleSection = {
  id: string;
  heading: string;
  lead?: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: ArticleStep[];
  note?: ArticleNote;
};

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type ArticleSource = {
  label: string;
  href: string;
};

export type ArticleServiceLink = {
  label: string;
  href: string;
  description: string;
};

type KnowledgeItemBase = {
  slug: string;
  title: string;
  excerpt: string;
  category: KnowledgeCategorySlug;
  relatedServices: KnowledgeService[];
  visualLabel: string;
};

export type PlannedKnowledgeItem = KnowledgeItemBase & {
  status: "planned";
};

export type PublishedKnowledgeArticle = KnowledgeItemBase & {
  status: "published";
  cardCta: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  ogImage: string;
  publishedAt: string;
  modifiedAt: string;
  displayDate: string;
  readingTime: string;
  author: {
    name: string;
    role: string;
    href: string;
  };
  seoTitle: string;
  metaDescription: string;
  quickAnswer: string;
  keyFacts: Array<{ label: string; value: string }>;
  supplies: string[];
  sections: ArticleSection[];
  faqs: ArticleFaq[];
  sources: ArticleSource[];
  relatedItemSlugs: string[];
  serviceLinks: ArticleServiceLink[];
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export type KnowledgeItem = PublishedKnowledgeArticle | PlannedKnowledgeItem;

export type KnowledgeCardData =
  | Pick<PublishedKnowledgeArticle, "status" | "slug" | "title" | "excerpt" | "category" | "relatedServices" | "visualLabel" | "cardCta" | "heroImage" | "heroImageAlt" | "readingTime">
  | Pick<PlannedKnowledgeItem, "status" | "slug" | "title" | "excerpt" | "category" | "relatedServices" | "visualLabel">;

export const knowledgeItems: KnowledgeItem[] = [
  {
    status: "published",
    slug: "cv-ketel-bijvullen",
    title: "CV-ketel bijvullen: zo brengt u de waterdruk veilig op peil",
    excerpt: "Een rustig stappenplan voor het controleren en bijvullen van de cv-installatie, met duidelijke grenzen voor wanneer u beter een monteur inschakelt.",
    description: "Bekijk hoe u een cv-ketel veilig bijvult, welke waterdruk meestal goed is en wanneer terugkerend drukverlies door een monteur moet worden onderzocht.",
    category: "cv-verwarming",
    relatedServices: ["onderhoud", "cv-ketels", "service"],
    visualLabel: "1,5–2,0 bar",
    cardCta: "Lees hoe u uw cv-ketel bijvult",
    heroImage: "/knowledge/cv-ketel-bijvullen-hero.jpg",
    heroImageAlt: "Vulslang en drukmeter bij het bijvullen van een cv-installatie",
    ogImage: "/knowledge/cv-ketel-bijvullen-hero.jpg",
    publishedAt: "2026-08-13T08:00:00+02:00",
    modifiedAt: "2026-08-13T08:00:00+02:00",
    displayDate: "13 augustus 2026",
    readingTime: "6 min. leestijd",
    author: {
      name: "Serviceteam Rob Braam",
      role: "Praktijkkennis uit onderhoud en service",
      href: "/over-ons",
    },
    seoTitle: "CV-ketel bijvullen: veilig stappenplan",
    metaDescription: "Is de druk van uw cv-ketel te laag? Bekijk hoe u de installatie veilig bijvult, welke druk goed is en wanneer u een monteur belt.",
    quickAnswer: "Controleer de waterdruk wanneer de installatie is afgekoeld. Voor veel cv-installaties ligt een goede koude druk tussen 1,5 en 2,0 bar. Vul langzaam bij en volg altijd de handleiding van uw toestel, want het vulpunt en de precieze werkwijze kunnen per installatie verschillen.",
    keyFacts: [
      { label: "Gebruikelijke druk (koud)", value: "1,5–2,0 bar" },
      { label: "Benodigde tijd", value: "ongeveer 10–15 minuten" },
      { label: "Belangrijkste controle", value: "blijft de druk daarna stabiel?" },
    ],
    supplies: [
      "De gebruikershandleiding van uw cv-ketel",
      "Een passende, onbeschadigde vulslang óf de ingebouwde vulvoorziening van uw toestel",
      "Een emmer en een doek voor het water dat in de slang achterblijft",
      "Toegang tot de drukmeter of drukweergave van de ketel",
    ],
    sections: [
      {
        id: "wanneer-bijvullen",
        heading: "Wanneer moet u de cv-ketel bijvullen?",
        lead: "Kijk eerst naar de drukmeter of de drukweergave op het display. Doe dat bij voorkeur wanneer de installatie koud is; tijdens het verwarmen loopt de druk namelijk iets op.",
        paragraphs: [
          "Veel cv-installaties worden koud gevuld tot ongeveer 1,5 à 2,0 bar. Intergas noemt voor een koude installatie een bandbreedte van 1 tot 2 bar. De handleiding van uw eigen toestel blijft daarom leidend.",
          "Een lage druk kan ervoor zorgen dat radiatoren niet goed warm worden of dat de ketel een melding geeft. Alleen bijvullen lost echter niet iedere verwarmingsklacht op. Blijft het huis koud terwijl de druk goed is, dan is een andere controle nodig.",
        ],
        bullets: [
          "De druk staat onder het bereik dat in de handleiding van uw toestel wordt genoemd.",
          "De ketel toont een melding of storingscode voor te lage waterdruk.",
          "De radiatoren worden niet goed warm en u ziet tegelijk dat de waterdruk te laag is.",
          "Na het ontluchten van radiatoren is de druk onder het juiste niveau gezakt.",
        ],
        note: {
          tone: "practice",
          title: "Uit de praktijk",
          text: "Een eenmalige kleine correctie kan voorkomen. Moet u binnen korte tijd opnieuw of meerdere keren per jaar bijvullen, laat dan onderzoeken waar het water of de druk blijft.",
        },
      },
      {
        id: "stappenplan",
        heading: "CV-ketel bijvullen in 7 stappen",
        lead: "De plaats van de kranen en de vulmethode verschillen per woning en toestel. Sommige moderne ketels hebben een ingebouwde vulvoorziening. Gebruik daarom altijd de handleiding zodra uw situatie afwijkt van het onderstaande stappenplan.",
        steps: [
          {
            title: "Zet de thermostaat laag en schakel de ketel uit",
            text: "Laat de installatie eerst afkoelen. Zo leest u de koude druk af en verkleint u de kans op contact met heet water of warme onderdelen. Trek alleen de stekker uit het stopcontact als de handleiding dat voorschrijft.",
          },
          {
            title: "Zoek de waterkraan en de vul-/aftapkraan",
            text: "De vulkraan zit vaak bij de ketel, een radiator of een leiding in de buurt. Kunt u niet met zekerheid vaststellen welke kraan bedoeld is, draai dan niet op goed geluk aan afsluiters en raadpleeg de handleiding of een installateur.",
          },
          {
            title: "Controleer de vulslang en sluit hem aan op de waterkraan",
            text: "Gebruik een slang die goed past en geen scheurtjes of beschadigingen heeft. Leg een doek en emmer klaar voordat u begint.",
          },
          {
            title: "Vul de slang eerst met water",
            text: "Laat voorzichtig water door de slang lopen totdat de lucht eruit is en vang dit op in de emmer. Sluit de waterkraan weer. Zo brengt u zo min mogelijk extra lucht in de cv-installatie.",
          },
          {
            title: "Sluit de gevulde slang aan op de vulkraan",
            text: "Draai beide aansluitingen stevig vast zonder ze te forceren. Controleer of de slang niet geknikt ligt en of u de drukmeter tijdens het vullen goed kunt zien.",
          },
          {
            title: "Open de kranen langzaam en houd de druk in beeld",
            text: "Open doorgaans eerst de waterkraan en daarna voorzichtig de vulkraan. Vul langzaam tot de koude druk die in de handleiding staat; bij veel installaties is dat 1,5 tot 2,0 bar. Stop direct als de druk onverwacht snel oploopt.",
          },
          {
            title: "Sluit af, koppel los en controleer opnieuw",
            text: "Sluit eerst de vulkraan en daarna de waterkraan. Koppel de slang voorzichtig los en vang het resterende water op. Zet de ketel volgens de handleiding weer aan en controleer na ontluchten of de koude druk nog steeds goed is.",
          },
        ],
        note: {
          tone: "warning",
          title: "Open nooit de mantel van de cv-ketel",
          text: "Bijvullen gebeurt via de daarvoor bedoelde vulvoorziening. Zodra de toestelmantel open moet of u aan gas-, rookgas- of verbrandingsdelen zou moeten werken, is een CO-gecertificeerde installateur nodig.",
        },
      },
      {
        id: "na-het-bijvullen",
        heading: "Wat controleert u na het bijvullen?",
        paragraphs: [
          "Kijk of de vulkraan en waterkraan volledig dicht zijn en of nergens water lekt. Heeft u radiatoren ontlucht, controleer de druk dan daarna nog een keer; door ontluchten kan deze opnieuw wat dalen.",
          "Laat de installatie vervolgens normaal opwarmen. De druk mag warm hoger zijn dan koud, maar hoort niet plotseling richting het maximale bereik te lopen. Controleer later, wanneer de installatie weer koud is, of de druk ongeveer gelijk is gebleven.",
        ],
        bullets: [
          "Geen druppels bij de slang, vulkraan, radiatoren of zichtbare leidingen",
          "De ketel start zonder nieuwe storingsmelding",
          "Radiatoren worden gelijkmatig warm",
          "De koude waterdruk blijft na enige tijd stabiel",
        ],
      },
      {
        id: "druk-blijft-dalen",
        heading: "Waarom blijft de druk van de cv-ketel dalen?",
        paragraphs: [
          "Terugkerend drukverlies kan onder meer komen door een kleine lekkage, een lekkende koppeling of radiator, een probleem met het expansievat of een overstortventiel dat water loost. Het is niet verstandig om dat steeds te compenseren door opnieuw bij te vullen.",
          "Noteer bij welke koude druk u heeft gevuld en kijk hoe snel die waarde terugloopt. Foto’s van de drukweergave, foutcode en eventuele lekkage helpen het serviceteam om de situatie vooraf beter te beoordelen.",
        ],
        note: {
          tone: "info",
          title: "Vaker bijvullen is een signaal, geen oplossing",
          text: "Daalt de druk in dagen of weken opnieuw, of moet u meermaals per jaar bijvullen? Laat de installatie controleren voordat een klein probleem groter wordt.",
        },
      },
      {
        id: "monteur-bellen",
        heading: "Wanneer schakelt u een monteur in?",
        lead: "Stop met bijvullen en vraag hulp wanneer u niet zeker weet wat u ziet of wanneer de installatie zich anders gedraagt dan verwacht.",
        bullets: [
          "U kunt het juiste vulpunt niet vinden of een kraan zit vast of is beschadigd.",
          "De druk stijgt niet, stijgt juist zeer snel of loopt na opwarmen sterk op.",
          "De druk zakt binnen korte tijd opnieuw of u moet regelmatig bijvullen.",
          "U ziet water bij de ketel, leidingen, radiatoren of het overstortventiel.",
          "De ketel blijft in storing of de woning en het tapwater worden niet warm.",
          "Er is werk nodig waarvoor de mantel van de cv-ketel open moet.",
        ],
        note: {
          tone: "warning",
          title: "Ruikt u gas of vermoedt u koolmonoxide?",
          text: "Ga niet verder met dit stappenplan. Vermijd vonken en open vuur, ga naar buiten als dat veilig kan en volg de noodinstructies op onze servicepagina. Bij direct gevaar belt u 112.",
        },
      },
    ],
    faqs: [
      {
        question: "Hoeveel bar moet een cv-ketel hebben?",
        answer: "Voor veel cv-installaties is een koude druk van 1,5 tot 2,0 bar gebruikelijk. Sommige fabrikanten of installaties hanteren een iets andere bandbreedte. Controleer daarom altijd de gebruikershandleiding van uw eigen toestel.",
      },
      {
        question: "Moet ik de cv-ketel met koud of warm water bijvullen?",
        answer: "Gebruik koud leidingwater en vul bij wanneer de installatie is afgekoeld. Daarmee leest u de koude druk betrouwbaar af en voorkomt u grote temperatuurverschillen in het systeem.",
      },
      {
        question: "Hoe vaak is bijvullen normaal?",
        answer: "Vul alleen bij wanneer de druk daar aanleiding toe geeft. Een incidentele kleine correctie kan voorkomen, bijvoorbeeld na ontluchten. Moet u binnen korte tijd opnieuw of meerdere keren per jaar bijvullen, laat dan de oorzaak onderzoeken.",
      },
      {
        question: "Kan ik een cv-ketel zonder losse vulslang bijvullen?",
        answer: "Sommige toestellen hebben een ingebouwde vulvoorziening of vaste vullus. Gebruik alleen de voorziening die in de handleiding van uw toestel staat beschreven. Improviseer geen aansluiting wanneer een passende vulmogelijkheid ontbreekt.",
      },
      {
        question: "Is bijvullen hetzelfde als cv-ketelonderhoud?",
        answer: "Nee. Bijvullen brengt alleen de waterdruk op peil. Tijdens professioneel onderhoud worden onder meer het toestel, de veilige werking, de verbranding, luchttoevoer en rookgasafvoer gecontroleerd en gemeten.",
      },
    ],
    sources: [
      { label: "Intergas — Hulp & advies: cv-ketel bijvullen", href: "https://www.intergas-verwarming.nl/zakelijk/klantenservice/cv-ketel/hulp-advies/" },
      { label: "Nefit Bosch — Zelf uw cv-ketel bijvullen", href: "https://www.nefit-bosch.nl/producten/cv-ketels/cv-ketel-bijvullen/" },
      { label: "Remeha — Wanneer en hoe cv-installatie bijvullen", href: "https://kennisbank.remeha.nl/wanneer-en-hoe-moet-ik-mijn-cv-installatie-bijvullen/" },
      { label: "Vaillant — Cv-ketel of verwarming bijvullen", href: "https://www.vaillant.nl/advies/technologie-begrijpen/cv-ketels/cv-ketel-bijvullen/" },
    ],
    relatedItemSlugs: ["cv-ketel-druk-te-laag", "radiatoren-ontluchten", "hoe-vaak-cv-ketel-onderhoud"],
    serviceLinks: [
      {
        label: "Bekijk cv-ketelonderhoud",
        href: "/onderhoud",
        description: "Vergelijk een losse onderhoudsbeurt met een onderhoudsabonnement.",
      },
      {
        label: "Ga naar storing & service",
        href: "/service",
        description: "Geef merk, type, foutcode en duidelijke foto’s door aan ons serviceteam.",
      },
      {
        label: "Lees over cv-ketels",
        href: "/cv-ketels",
        description: "Meer over onderhoud, vervanging, rookgasafvoer en onze vaste ketelmerken.",
      },
    ],
    cta: {
      eyebrow: "Druk blijft teruglopen?",
      title: "Laat de oorzaak controleren in plaats van steeds bij te vullen.",
      text: "Wij onderhouden cv-ketels van Intergas, Remeha, Nefit en Vaillant. Stuur merk, type, de huidige druk en duidelijke foto’s mee; dan kan ons serviceteam uw situatie beter beoordelen.",
      primaryLabel: "Laat de installatie controleren",
      primaryHref: "/service",
      secondaryLabel: "Bekijk onderhoud",
      secondaryHref: "/onderhoud",
    },
  },
  {
    status: "planned",
    slug: "cv-ketel-druk-te-laag",
    title: "CV-ketel druk te laag: oorzaken en eerste controles",
    excerpt: "Wat een lage druk betekent, welke signalen u zelf kunt controleren en wanneer terugkerend drukverlies onderzoek nodig maakt.",
    category: "storingen",
    relatedServices: ["onderhoud", "cv-ketels", "service"],
    visualLabel: "ST",
  },
  {
    status: "planned",
    slug: "radiatoren-ontluchten",
    title: "Radiatoren ontluchten: zo pakt u het rustig aan",
    excerpt: "Een praktisch stappenplan voor borrelende radiatoren, met aandacht voor de waterdruk vóór en na het ontluchten.",
    category: "cv-verwarming",
    relatedServices: ["onderhoud", "cv-ketels"],
    visualLabel: "CV",
  },
  {
    status: "planned",
    slug: "hoe-vaak-cv-ketel-onderhoud",
    title: "Hoe vaak heeft een cv-ketel onderhoud nodig?",
    excerpt: "Waar het juiste onderhoudsmoment van afhangt en wat een monteur tijdens een onderhoudsbeurt controleert.",
    category: "onderhoud",
    relatedServices: ["onderhoud", "cv-ketels"],
    visualLabel: "ON",
  },
  {
    status: "planned",
    slug: "cv-ketel-storing-zelf-controleren",
    title: "CV-ketelstoring: wat kunt u veilig zelf controleren?",
    excerpt: "Een korte eerste controle van druk, thermostaat en storingscode, zonder aan het toestel te sleutelen.",
    category: "storingen",
    relatedServices: ["service", "cv-ketels"],
    visualLabel: "ST",
  },
  {
    status: "planned",
    slug: "groepenkast-vervangen-signalen",
    title: "Wanneer is uw groepenkast aan vervanging toe?",
    excerpt: "Signalen die aandacht vragen en waarom uitbreiding met een warmtepomp of laadpunt soms aanpassing nodig maakt.",
    category: "elektra",
    relatedServices: ["elektra"],
    visualLabel: "EL",
  },
  {
    status: "planned",
    slug: "airco-verwarmen-in-de-winter",
    title: "Verwarmen met airco in de winter: wat kunt u verwachten?",
    excerpt: "Hoe een airco warmte levert, wanneer dat comfortabel is en welke plaatsing en instellingen verschil maken.",
    category: "airco",
    relatedServices: ["airco"],
    visualLabel: "AC",
  },
  {
    status: "planned",
    slug: "zuiniger-verwarmen-zonder-comfortverlies",
    title: "Zuiniger verwarmen zonder comfort te verliezen",
    excerpt: "Praktische instellingen en gewoontes waarmee u het verwarmingssysteem rustiger en doelmatiger gebruikt.",
    category: "besparen-advies",
    relatedServices: ["onderhoud", "cv-ketels", "warmtepompen"],
    visualLabel: "ADV",
  },
];

export function getKnowledgeCategory(slug: KnowledgeCategorySlug) {
  return knowledgeCategories.find((category) => category.slug === slug)!;
}

export function isPublishedArticle(item: KnowledgeItem): item is PublishedKnowledgeArticle {
  return item.status === "published";
}

export function getPublishedArticles() {
  return knowledgeItems.filter(isPublishedArticle);
}

export function getKnowledgeCards(): KnowledgeCardData[] {
  return knowledgeItems.map((item) => item.status === "published" ? {
    status: item.status,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    category: item.category,
    relatedServices: item.relatedServices,
    visualLabel: item.visualLabel,
    cardCta: item.cardCta,
    heroImage: item.heroImage,
    heroImageAlt: item.heroImageAlt,
    readingTime: item.readingTime,
  } : {
    status: item.status,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    category: item.category,
    relatedServices: item.relatedServices,
    visualLabel: item.visualLabel,
  });
}

export function getArticleBySlug(slug: string) {
  return getPublishedArticles().find((article) => article.slug === slug);
}

export function getKnowledgeItemsForService(service: KnowledgeService, limit = 4) {
  return knowledgeItems.filter((item) => item.relatedServices.includes(service)).slice(0, limit);
}

export function getRelatedKnowledgeItems(article: PublishedKnowledgeArticle) {
  return article.relatedItemSlugs
    .map((slug) => knowledgeItems.find((item) => item.slug === slug))
    .filter((item): item is KnowledgeItem => Boolean(item));
}
