import Link from "next/link";

const chapters = [
  { name: "De werking", title: <>Warmte van buiten.<br /><em>Comfort binnen.</em></>, text: "De warmtepomp haalt warmte uit de lucht. Met elektriciteit maakt hij die bruikbaar voor uw radiatoren of vloerverwarming.", note: "Wij stemmen de onderdelen op elkaar af." },
  { name: "Hybride", title: <>Minder gas.<br /><em>Uw ketel blijft.</em></>, text: "De warmtepomp verwarmt. Uw cv-ketel helpt wanneer nodig en verzorgt het douchewater.", note: "Onze hybride opstelling kan later volledig elektrisch worden." },
  { name: "Volledig elektrisch", title: <>De ketel eruit.<br /><em>Het boilervat erin.</em></>, text: "De warmtepomp verwarmt uw woning. Het grote boilervat bewaart warm tapwater. De buitenunit, control unit en het buffervat blijven.", note: "Wij beoordelen welke opstelling bij u past." },
  { name: "De vaten", title: <>Twee vaten.<br /><em>Twee taken.</em></>, text: "Het kleine buffervat ondersteunt de verwarming. Het grote boilervat bewaart warm water voor douche en kraan.", note: "Het buffervat ziet u bij beide opstellingen. Het boilervat komt erbij wanneer de cv-ketel verdwijnt." },
  { name: "De regeling", title: <>U kiest de temperatuur.<br /><em>Wij regelen de rest.</em></>, text: "De thermostaat hangt beneden. De control unit regelt de warmtepomp en hangt bij de installatie. Ons team stelt het systeem in en legt de bediening uit.", note: "Ook het onderhoud en de service verzorgen wij zelf." },
  { name: "Uw woning", title: <>Past het?<br /><em>Loont het?</em></>, text: "Uw gasverbruik, huidige verwarming en isolatie vormen de basis van ons advies. Daarmee beoordelen we de opstelling en of overstappen financieel zinvol kan zijn.", note: "We vragen deze gegevens bij u na." },
];

export function WarmtepompChapters() {
  return <>
    <section className="ws-chapter ws-hero" id="ws-scene-1" aria-labelledby="ws-title-1"><div className="ws-reading"><div className="ws-panel">
      <p className="ws-hero-label">Warmtepompen · Braam Service &amp; Montage</p>
      <h1 id="ws-title-1">Minder gas.<br /><em>Meer comfort.</em></h1>
      <p className="ws-intro">Een warmtepomp die bij uw woning past. Geadviseerd, geïnstalleerd én onderhouden door ons eigen team.</p>
      <div className="ws-actions"><Link className="ws-button" href="/offerte-aanvragen?dienst=warmtepomp">Vraag advies voor uw woning <span aria-hidden="true">↗</span></Link></div>
      <div className="ws-hero-service" aria-label="Van advies tot onderhoud"><span>Advies</span><i aria-hidden="true">→</i><span>Installatie</span><i aria-hidden="true">→</i><span>Onderhoud</span></div>
      <p className="ws-small">Eén eigen team. Ook na de installatie.</p>
    </div></div></section>
    {chapters.map((chapter, index) => <section className="ws-chapter" key={chapter.name} id={`ws-scene-${index + 2}`} aria-labelledby={`ws-title-${index + 2}`}><div className="ws-reading"><div className="ws-panel">
      <h2 id={`ws-title-${index + 2}`}>{chapter.title}</h2>
      {index === 3 ? <dl className="ws-vessel-functions"><div><dt>Buffervat</dt><dd>Verwarmingswater voor radiatoren en vloerverwarming.</dd></div><div><dt>Boilervat</dt><dd>Een voorraad warm water voor douche en kraan.</dd></div></dl> : <p className="ws-body">{chapter.text}</p>}
      <p className="ws-keyline">{chapter.note}</p>
      {index === 1 && <div className="ws-actions"><a className="ws-textlink" href="#ws-scene-4">Bekijk volledig elektrisch <span aria-hidden="true">→</span></a></div>}
      {index === 2 && <div className="ws-actions"><a className="ws-textlink" href="#ws-scene-3">Bekijk hybride <span aria-hidden="true">←</span></a></div>}
    </div></div></section>)}
  </>;
}
