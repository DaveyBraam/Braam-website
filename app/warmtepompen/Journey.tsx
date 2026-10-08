"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { FRAME, LIGHTS, TRACK, frameAt, plateRect, type CopyId, type Frame, type PlateId } from "./timeline";

/** The photographs of the journey. */
const IMG = "/warmtepompen/reis/";
/** The outdoor unit, photographed into the house: where its patch lies on the 16:9 frame (%). */
const UNIT = { left: "65.3125%", top: "54.1667%", width: "25%", height: "25%" };
/** Fully electric: the boilervat in place of the ketel and the hydraulic station beside it,
    photographed into the garage (%). */
const ELECTRIC = { left: "46.9792%", top: "5.9722%", width: "32.0052%", height: "90%" };
const subscribeMotion = (callback: () => void) => { const m = matchMedia("(prefers-reduced-motion: reduce)"); m.addEventListener("change", callback); return () => m.removeEventListener("change", callback); };
const restricted = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
/** Phones, and tablets held upright, get the stacked composition (same query as warmtepompen.css). */
const PHONE = "(max-width: 759px), (max-width: 1199px) and (max-aspect-ratio: 4/5)";
/** Where each chapter is fully readable, for links and keyboard focus. */
const anchors: Record<CopyId, number> = { hero: 0.2, werking: 2.0, hybride: 3.8, elektrisch: 5.15, vaten: 6.2, regeling: 7.45, finale: 10.7 };

export function Journey() {
  const track = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null);
  const extPlate = useRef<HTMLDivElement>(null), garPlate = useRef<HTMLDivElement>(null), livPlate = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLAnchorElement>(null), morning = useRef<HTMLDivElement>(null), electric = useRef<HTMLImageElement>(null), evening = useRef<HTMLDivElement>(null), dark = useRef<HTMLImageElement>(null);
  const reduced = useSyncExternalStore(subscribeMotion, restricted, () => false);

  const go = (t: number) => {
    const el = track.current, st = stage.current; if (!el || !st) return;
    const top = el.getBoundingClientRect().top + scrollY + t * st.offsetHeight;
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: reduced ? 0 : 1.4, immediate: reduced });
    else scrollTo({ top, behavior: reduced ? "instant" : "smooth" });
  };

  // The clock: scroll position → Frame → photographs, light layers and copy.
  useEffect(() => {
    const el = track.current, st = stage.current; if (!el || !st) return;
    const plates: Record<PlateId, { current: HTMLDivElement | null }> = { ext: extPlate, gar: garPlate, liv: livPlate };
    const copies = Array.from(st.querySelectorAll<HTMLElement>("[data-copy]"));
    const lights = Array.from(st.querySelectorAll<HTMLImageElement>("[data-light]"));
    const mobileQuery = matchMedia(PHONE);
    let raf = 0, vw = 1, vh = 1, baseW = 1, baseH = 1, lastT = -1, head = 0, lift = -1;

    // Decode every photograph up front, so none of them is unpacked (and stutters)
    // at the moment it first fades in.
    st.querySelectorAll("img").forEach(img => {
      const decode = () => { img.decode().catch(() => {}); };
      if (img.complete) decode(); else img.addEventListener("load", decode, { once: true });
    });

    /** The scroll hint shows unless the opening copy runs down to the bottom of the
        first screen (short laptop windows). */
    const roomForCue = () => {
      const c = cue.current, hero = st.querySelector<HTMLElement>(".w5-hero");
      if (!c || !hero) return;
      c.dataset.room = mobileQuery.matches || vh - head - (hero.offsetTop + hero.offsetHeight) > 60 ? "yes" : "no";
    };
    const layout = () => {
      vw = st.clientWidth; vh = st.clientHeight;
      const cover = Math.max(vw / FRAME.width, vh / FRAME.height);
      baseW = FRAME.width * cover; baseH = FRAME.height * cover;
      st.style.setProperty("--w5-base-w", `${baseW}px`); st.style.setProperty("--w5-base-h", `${baseH}px`);
      head = Math.max(0, el.getBoundingClientRect().top + scrollY);
      roomForCue();
      lastT = -1;
    };
    /** Only touch a style when its value actually changes. */
    const set = (node: HTMLElement | null, prop: "opacity" | "visibility" | "transform", value: string) => {
      if (node && node.style[prop] !== value) node.style[prop] = value;
    };
    const place = (id: PlateId, f: Frame) => {
      const node = plates[id].current, p = f.plates[id], r = plateRect(p.view, vw, vh);
      // Plates stay rendered at opacity 0 rather than hidden: a hidden photo would be
      // painted and uploaded to the GPU the moment it fades in, which stutters.
      set(node, "opacity", p.opacity.toFixed(3));
      set(node, "transform", `translate3d(${r.left.toFixed(2)}px, ${r.top.toFixed(2)}px, 0) scale(${(r.width / baseW).toFixed(5)})`);
      return r;
    };
    const apply = (f: Frame) => {
      const ext = place("ext", f), gar = place("gar", f); place("liv", f);
      // A letterboxed house (the phone finale) fades into the paper around it.
      extPlate.current?.classList.toggle("w5-letterbox", ext.height < vh - 1);
      garPlate.current?.classList.toggle("w5-letterbox", gar.height < vh - 1);
      // The same house through the day: the morning photo lies over the blue-hour
      // one in exactly the same frame; under it the evening deepens and each light
      // is its own layer, added on top of the photograph.
      set(morning.current, "opacity", f.daylight.toFixed(3));
      // Ready (under the morning photo) before the day starts to turn, for the same reason.
      set(evening.current, "visibility", f.t > 7.6 ? "visible" : "hidden");
      set(dark.current, "opacity", f.night.toFixed(3));
      lights.forEach((img, i) => {
        const o = f.lights[i] ?? 0;
        set(img, "opacity", o.toFixed(3));
      });
      // Ketel out, boilervat and hydraulic station in: they fade in over the ketel.
      set(electric.current, "opacity", f.swap.toFixed(3));
      for (const c of copies) {
        const o = f.copy[c.dataset.copy as CopyId] ?? 0;
        set(c, "opacity", o.toFixed(3));
        set(c, "transform", `translate3d(0, ${((1 - o) * 1.2).toFixed(2)}vh, 0)`);
        c.dataset.active = o > 0.5 ? "true" : "false";
      }
    };
    const tick = () => {
      raf = 0;
      const t = -el.getBoundingClientRect().top / Math.max(1, vh);
      if (t === lastT) return;
      apply(frameAt(t, mobileQuery.matches, vw, vh, reduced));
      // At the top of the page the site header sits above the stage, so the stage's
      // lowest part starts below the fold. Until the header has scrolled away, the
      // opening copy and the scroll hint are lifted by what is still hidden.
      const hidden = Math.round(Math.max(0, head - scrollY));
      if (hidden !== lift) { lift = hidden; st.style.setProperty("--w5-lift", `${lift}px`); }
      // The hint stays while the opening is on screen and fades as the journey starts.
      const hint = 1 - Math.min(1, Math.max(0, (t - 0.25) / 0.3));
      set(cue.current, "opacity", hint.toFixed(3));
      set(cue.current, "visibility", hint > 0 ? "visible" : "hidden");
      lastT = t;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };
    // Called by the smooth-scroll loop right after it moved the page: draw in this
    // very frame, so the photographs never trail the scroll.
    const now = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } tick(); };
    const resize = () => { layout(); wake(); };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) wake(); }, { rootMargin: "10% 0px" });
    io.observe(el);
    layout(); addEventListener("scroll", wake, { passive: true }); addEventListener("resize", resize);
    void document.fonts?.ready.then(roomForCue);
    const updaters = (window.__scrubUpdaters ??= []); updaters.push(now);
    wake();
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); removeEventListener("scroll", wake); removeEventListener("resize", resize);
      const i = updaters.indexOf(now); if (i >= 0) updaters.splice(i, 1);
    };
  }, [reduced]);

  const focusChapter = (event: React.FocusEvent<HTMLElement>) => {
    const block = (event.target as HTMLElement).closest<HTMLElement>("[data-copy]");
    if (block && block.dataset.active !== "true") go(anchors[block.dataset.copy as CopyId]);
  };

  return <div className="w5-journey">
    <div className="w5-track" ref={track} style={{ ["--w5-track" as string]: TRACK + 1 }}>
      <div className="w5-stage" ref={stage} onFocus={focusChapter}>
        <div className="w5-plate w5-house" ref={extPlate} aria-hidden="true">
          <div className="w5-evening" ref={evening}>
            <img src={`${IMG}avond-basis.webp`} alt="" width="4096" height="2304" decoding="async" />
            <img className="w5-patch" style={UNIT} src={`${IMG}unit-avond.webp`} alt="" width="1920" height="1080" decoding="async" />
            <img ref={dark} className="w5-dark" src={`${IMG}avond-donker.webp`} alt="" width="1920" height="1080" decoding="async" />
            {LIGHTS.map((name, i) => <img key={name} data-light={name} className="w5-light" src={`${IMG}licht-${i}-${name}.webp`} alt="" width="1920" height="1080" decoding="async" />)}
          </div>
          <div className="w5-morning" ref={morning}>
            <img src={`${IMG}woning-ochtend.webp`} alt="" width="4096" height="2304" fetchPriority="high" decoding="async" />
            <img className="w5-patch" style={UNIT} src={`${IMG}unit-ochtend.webp`} alt="" width="1920" height="1080" fetchPriority="high" decoding="async" />
          </div>
        </div>
        <div className="w5-plate" ref={garPlate} aria-hidden="true">
          <img src={`${IMG}garage-hybride.webp`} alt="" width="3840" height="2160" decoding="async" />
          <img ref={electric} className="w5-patch w5-swap" style={ELECTRIC} src={`${IMG}garage-elektrisch.webp`} alt="" width="1229" height="1944" decoding="async" />
        </div>
        <div className="w5-plate" ref={livPlate} aria-hidden="true"><img src={`${IMG}woonkamer.webp`} alt="" width="3840" height="2160" decoding="async" /></div>
        <div className="w5-paper" aria-hidden="true" />

        <section className="w5-copy w5-hero" data-copy="hero" aria-labelledby="ws-title-1">
          <p className="w5-kicker">Warmtepompen · Braam Service &amp; Montage</p>
          <h1 id="ws-title-1">Minder gas.<br /><em>Meer comfort.</em></h1>
          <p className="w5-intro">Een warmtepomp die bij uw woning past. Geadviseerd, geïnstalleerd én onderhouden door ons eigen team.</p>
          <div className="w5-actions"><Link className="w5-button" href="/offerte-aanvragen?dienst=warmtepomp">Vraag advies voor uw woning <span aria-hidden="true">↗</span></Link><a className="w5-phone" href="tel:+31736222199">073 622 2199</a></div>
          <ol className="w5-route" aria-label="Van advies tot onderhoud"><li>Advies</li><li>Installatie</li><li>Onderhoud</li></ol>
          <p className="w5-small">Eén eigen team. Ook na de installatie.</p>
        </section>

        <a className="w5-cue" ref={cue} href="#ws-title-2" onClick={e => { e.preventDefault(); go(anchors.werking); }}><i aria-hidden="true" />Scroll naar beneden</a>

        <section className="w5-copy" data-copy="werking" aria-labelledby="ws-title-2">
          <h2 id="ws-title-2">Warmte van buiten.<br /><em>Comfort binnen.</em></h2>
          <p className="w5-body">De warmtepomp haalt warmte uit de lucht. Met elektriciteit maakt hij die bruikbaar voor uw radiatoren of vloerverwarming.</p>
          <p className="w5-keyline">Wij stemmen de onderdelen op elkaar af.</p>
        </section>

        <section className="w5-copy" data-copy="hybride" id="ws-scene-3" aria-labelledby="ws-title-3">
          <h2 id="ws-title-3">Minder gas.<br /><em>Uw ketel blijft.</em></h2>
          <p className="w5-body">De warmtepomp verwarmt. Uw cv-ketel helpt wanneer nodig en verzorgt het douchewater.</p>
          <p className="w5-keyline">Onze hybride opstelling kan later volledig elektrisch worden.</p>
          <div className="w5-actions"><a className="w5-link" href="#ws-scene-4" onClick={e => { e.preventDefault(); go(anchors.elektrisch); }}>Bekijk volledig elektrisch <span aria-hidden="true">→</span></a></div>
        </section>

        <section className="w5-copy" data-copy="elektrisch" id="ws-scene-4" aria-labelledby="ws-title-4">
          <h2 id="ws-title-4">De ketel eruit.<br /><em>Het boilervat erin.</em></h2>
          <p className="w5-body">De warmtepomp verwarmt uw woning. Het hydraulisch station verdeelt de warmte over verwarming en warm water. Het grote boilervat bewaart warm tapwater. De buitenunit, control unit en het buffervat blijven.</p>
          <p className="w5-keyline">Wij beoordelen welke opstelling bij u past.</p>
          <div className="w5-actions"><a className="w5-link" href="#ws-scene-3" onClick={e => { e.preventDefault(); go(anchors.hybride); }}>Bekijk hybride <span aria-hidden="true">←</span></a></div>
        </section>

        <section className="w5-copy" data-copy="vaten" aria-labelledby="ws-title-5">
          <h2 id="ws-title-5">Twee vaten.<br /><em>Twee taken.</em></h2>
          <dl className="w5-vessels"><div><dt>Buffervat</dt><dd>Verwarmingswater voor radiatoren en vloerverwarming.</dd></div><div><dt>Boilervat</dt><dd>Een voorraad warm water voor douche en kraan.</dd></div></dl>
          <p className="w5-keyline">Het buffervat ziet u bij beide opstellingen. Het boilervat komt erbij wanneer de cv-ketel verdwijnt.</p>
        </section>

        <section className="w5-copy" data-copy="regeling" aria-labelledby="ws-title-6">
          <h2 id="ws-title-6">U kiest de temperatuur.<br /><em>Wij regelen de rest.</em></h2>
          <p className="w5-body">De thermostaat hangt beneden. De control unit regelt de warmtepomp en hangt bij de installatie. Ons team stelt het systeem in en legt de bediening uit.</p>
          <p className="w5-keyline">Ook het onderhoud en de service verzorgen wij zelf.</p>
        </section>

        <section className="w5-copy" data-copy="finale" aria-labelledby="ws-title-7">
          <h2 id="ws-title-7">Past het?<br /><em>Loont het?</em></h2>
          <p className="w5-body">Uw gasverbruik, huidige verwarming en isolatie vormen de basis van ons advies. Daarmee beoordelen we de opstelling en of overstappen financieel zinvol kan zijn.</p>
          <p className="w5-keyline">We vragen deze gegevens bij u na.</p>
          <div className="w5-actions"><Link className="w5-button" href="/offerte-aanvragen?dienst=warmtepomp">Vraag advies voor uw woning <span aria-hidden="true">↗</span></Link></div>
        </section>

      </div>
    </div>
  </div>;
}
