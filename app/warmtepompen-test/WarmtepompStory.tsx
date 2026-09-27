"use client";
/* Existing model renders are used unchanged as the static fallback. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type MouseEvent } from "react";
import { readingTravel } from "../concept-product/cv-ketels/reading-travel";
import type { WarmtepompScene } from "./story-scene";

const names = ["Buitenlucht", "Werking", "Hybride", "Elektrisch", "De vaten", "Regeling", "Uw woning"];
const descriptions = ["De buitenunit", "Van buitenlucht naar verwarmingswater", "Hybride · de cv-ketel blijft", "Volledig elektrisch · het boilervat neemt de plaats over", "Buffervat voor verwarming · boilervat voor douche en kraan", "Thermostaat · beneden in de leefruimte", "Eén installatie · door ons ontworpen, geplaatst en onderhouden"];
const subscribe = (callback: () => void) => { const media = matchMedia("(prefers-reduced-motion: reduce)"); media.addEventListener("change", callback); return () => media.removeEventListener("change", callback); };
const restricted = () => matchMedia("(prefers-reduced-motion: reduce)").matches || Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
const subscribeHydration = () => () => {};
const smooth = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t * t * t * (t * (t * 6 - 15) + 10); };

export function WarmtepompStory({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null), host = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null);
  const view = useRef<WarmtepompScene | null>(null), progress = useRef(0), reading = useRef(0);
  const menu = useRef<HTMLElement>(null), picker = useRef<HTMLButtonElement>(null);
  const reduced = useSyncExternalStore(subscribe, restricted, () => true);
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const [paused, setPaused] = useState(false), [loaded, setLoaded] = useState(false), [failed, setFailed] = useState(false);
  const [chapter, setChapter] = useState(0), [percent, setPercent] = useState(0), [attempt, setAttempt] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false), [inView, setInView] = useState(true);
  const active = !reduced && !failed;
  const pauseRef = useRef(false);
  useEffect(() => { pauseRef.current = paused; }, [paused]);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const sections = Array.from(el.querySelectorAll<HTMLElement>(".ws-chapter"));
    const panels = sections.map(section => section.querySelector<HTMLElement>(".ws-panel")!);
    let sizes = panels.map(panel => panel.offsetHeight), layoutDirty = true;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, bottom } = el.getBoundingClientRect(), height = innerHeight;
      const mobile = innerWidth < 700;
      const readingLine = mobile ? (stage.current?.offsetHeight ?? 0) + 94 : Math.max(120, height * .18);
      const offset = sections.map(section => section.getBoundingClientRect().top - top);
      const y = -top + readingLine;
      let index = 0;
      while (index < sections.length - 1 && y >= offset[index + 1]) index++;
      const readingTop = mobile ? readingLine : Math.max(120, height * .18);
      if (layoutDirty) {
        sizes = panels.map(panel => panel.offsetHeight);
        sections.forEach((section, n) => {
          section.style.setProperty("--ws-reading-top", `${mobile ? readingTop : Math.min(readingTop, height - sizes[n] - 28)}px`);
          section.style.setProperty("--ws-reading-size", `${sizes[n]}px`);
          section.style.setProperty("--ws-reading-hold", `${reduced ? 0 : Math.max(160, height * .3)}px`);
        });
        layoutDirty = false;
        frame = requestAnimationFrame(update);
        return;
      }
      const block = sections[index].querySelector<HTMLElement>(".ws-panel");
      const beat = block?.parentElement;
      const nextTop = sections[index + 1]?.getBoundingClientRect().top ?? sections[index].getBoundingClientRect().bottom;
      const travel = block && beat ? readingTravel({ holdEnd: beat.getBoundingClientRect().bottom - block.offsetHeight, stickyTop: mobile ? readingTop : Math.min(readingTop, height - block.offsetHeight - 28), nextTop, readingLine }) : 0;
      progress.current = Math.min(sections.length - 1, index + travel);
      reading.current = block && beat ? Math.max(0, Math.min(1, (readingTop - beat.getBoundingClientRect().top) / Math.max(1, beat.offsetHeight - block.offsetHeight))) : 0;
      if (!pauseRef.current) view.current?.progress(progress.current, false, reading.current);
      setChapter(index);
      const opacity = smooth((bottom - height * .55) / (height * .6));
      el.style.setProperty("--ws-opacity", String(opacity));
      const visible = top < height * .85 && opacity > .01;
      setInView(visible);
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = () => { layoutDirty = true; wake(); };
    const observer = new ResizeObserver(resize); sections.forEach(section => { observer.observe(section); const panel = section.querySelector(".ws-panel"); if (panel) observer.observe(panel); });
    window.addEventListener("scroll", wake, { passive: true }); window.addEventListener("resize", resize); wake();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", wake); window.removeEventListener("resize", resize); };
  }, [active, reduced]);

  useEffect(() => {
    const mount = host.current, element = root.current; if (!active || !mount || !element) return;
    const abort = new AbortController(); let dead = false, intersects = true;
    // Keep the studio empty until its first complete frame is ready. The still
    // has different lighting and must not masquerade as the initial 3D frame.
    setLoaded(false);
    const visibility = () => view.current?.visible(intersects && !document.hidden);
    const observer = new IntersectionObserver(entries => { intersects = entries[0].isIntersecting; visibility(); }); observer.observe(element);
    document.addEventListener("visibilitychange", visibility);
    const timeout = setTimeout(() => { if (!dead && !view.current) { setFailed(true); abort.abort(); } }, 30000);
    import("./story-scene").then(({ createWarmtepompScene }) => {
      if (dead) return;
      return createWarmtepompScene(mount, value => { if (!dead) setPercent(value); }, () => { if (!dead) { setFailed(true); setLoaded(false); } }, abort.signal, value => { if (!dead) setWaiting(value); });
    }).then(scene => {
      clearTimeout(timeout); if (!scene) return;
      if (dead) { scene.dispose(); return; }
      view.current = scene; scene.progress(progress.current, true, reading.current); scene.paused(pauseRef.current); visibility(); setLoaded(true);
    }).catch(() => { clearTimeout(timeout); if (!dead) { setFailed(true); setLoaded(false); } });
    return () => { dead = true; clearTimeout(timeout); abort.abort(); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); view.current?.dispose(); view.current = null; };
  }, [active, attempt]);

  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) setMenuOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenuOpen(false); picker.current?.focus(); } };
    document.addEventListener("pointerdown", dismiss); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", escape); };
  }, [menuOpen]);

  useEffect(() => {
    view.current?.paused(paused);
    if (!paused) view.current?.progress(progress.current, false, reading.current);
  }, [paused]);

  useEffect(() => {
    const alignHash = () => {
      if (!/^#ws-scene-[1-7]$/.test(location.hash)) return;
      const section = document.querySelector(location.hash);
      if (!section) return;
      const offset = innerWidth < 700 ? (stage.current?.offsetHeight ?? 0) + 86 : 100;
      window.__lenis?.scrollTo(section.getBoundingClientRect().top + scrollY - offset, { immediate: true });
      if (!window.__lenis) window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - offset });
    };
    const frame = requestAnimationFrame(alignHash);
    window.addEventListener("hashchange", alignHash);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("hashchange", alignHash); };
  }, []);

  const navigate = (event: MouseEvent<HTMLElement>, index: number) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(`ws-scene-${index + 1}`); if (!section) return;
    event.preventDefault();
    // Land slightly past the reading line to avoid subpixel rounding selecting the previous chapter.
    const offset = innerWidth < 700 ? (stage.current?.offsetHeight ?? 0) + 86 : 100;
    if (window.__lenis) window.__lenis.scrollTo(section.getBoundingClientRect().top + scrollY - offset, { immediate: reduced });
    else window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - offset, behavior: reduced ? "instant" : "smooth" });
    setMenuOpen(false); picker.current?.focus({ preventScroll: true });
  };

  return <div className="ws-story" id="warmtepomp-story" ref={root} data-live={active && loaded && !waiting} data-motion={active && !paused ? "on" : "off"} data-chapter={chapter}>
    <div className="ws-stage" ref={stage}>
      <div className="ws-visual" aria-hidden="true">
        <div className="ws-studio-title"><span>Van buitenlucht</span><span>naar wooncomfort</span></div>
        <div className="ws-webgl" ref={host} />
        {hydrated && (!active || waiting) && <div className="ws-poster"><img src={`/warmtepompen-test/stills-v1/scene-${chapter}.webp`} alt="" width="1200" height="1000" /></div>}
        <p className="ws-figure-caption">{descriptions[chapter]}{chapter >= 1 && chapter <= 3 && <span>Warmtestroom schematisch weergegeven</span>}</p>
      </div>
      <div className="ws-view-state" role="status">{failed ? <><span>U ziet het productbeeld. 3D is nu niet beschikbaar.</span><button onClick={() => { setFailed(false); setLoaded(false); setPercent(0); setAttempt(n => n + 1); }}>Probeer 3D opnieuw</button></> : !hydrated || active && !loaded ? `3D wordt geladen · ${percent}%` : waiting ? "Opstelling wordt voorbereid" : paused ? "Beeld gepauzeerd" : reduced ? "Beweging uit · productbeeld" : "Scroll en ontdek"}</div>
      <aside className="ws-storybar" ref={menu} aria-label="Hoofdstukken van het warmtepompverhaal" data-open={menuOpen} data-visible={inView} inert={!inView} aria-hidden={!inView}>
        <span className="ws-current"><i aria-hidden="true" />Volg de warmte</span>
        <button className="ws-picker" ref={picker} aria-expanded={menuOpen} aria-controls="ws-links" onClick={() => setMenuOpen(!menuOpen)}><span>0{chapter + 1} / 07</span> {names[chapter]} <span aria-hidden="true">⌃</span></button>
        <nav id="ws-links" aria-label="Verhaalhoofdstukken">{names.map((name, index) => <a key={name} href={`#ws-scene-${index + 1}`} aria-current={chapter === index ? "step" : undefined} onClick={event => navigate(event, index)}><span>0{index + 1}</span>{name}</a>)}</nav>
        {!reduced && <button className="ws-motion" aria-label={paused ? "Beweging hervatten" : "Beweging pauzeren"} aria-pressed={paused} onClick={() => setPaused(!paused)}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button>}
      </aside>
    </div>
    <div className="ws-chapters" onClick={event => {
      const anchor = (event.target as HTMLElement).closest("a");
      const match = anchor?.getAttribute("href")?.match(/^#ws-scene-([1-7])$/);
      if (match) navigate(event, Number(match[1]) - 1);
    }}>{children}</div>
    <div className="ws-outro" aria-hidden="true" />
  </div>;
}
