import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { WarmtepompStory } from "./WarmtepompStory";
import { WarmtepompChapters } from "./WarmtepompChapters";
import { WarmtepompContent } from "./WarmtepompContent";
import "./scroll-story.css";

export function WarmtepompPage({ preview = false }: { preview?: boolean }) {
  return <><a className="ws-skip" href="#ws-scene-1">Naar de inhoud</a><SiteHeader />
    <main className="wp-test wp-scroll">
      <div className="ws-productnav"><span><strong>Warmtepompen</strong><span>Advies · installatie · onderhoud</span>{preview && <small>Testpagina</small>}</span><a href="tel:+31736222199">073 622 2199 <span aria-hidden="true">↗</span></a></div>
      <WarmtepompStory><WarmtepompChapters /></WarmtepompStory>
      <WarmtepompContent />
      <div className="ws-closing"><h2>Past een warmtepomp bij u?</h2><p>Vertel ons over uw woning. Wij denken met u mee, van eerste advies tot jarenlang onderhoud.</p><div className="ws-actions"><a className="ws-button" href="/offerte-aanvragen?dienst=warmtepomp">Bespreek uw woning ↗</a><a className="ws-textlink" href="tel:+31736222199">073 622 2199 ↗</a></div><p className="ws-contact"><a href="mailto:service@robbraam.com">service@robbraam.com</a><a href="mailto:planning@robbraam.com">planning@robbraam.com · onderhoud</a></p></div>
    </main><SiteFooter /></>;
}
