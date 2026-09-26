'use client';
/* Locally compressed poster, independent of an image service. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { ProductScene } from './scene';
import { connectionCues } from './connection-cues';

const subscribe = (cb: () => void) => {
  const queries = [matchMedia('(prefers-reduced-motion: reduce)'), matchMedia('(max-width: 699px)')];
  queries.forEach(query => query.addEventListener('change', cb));
  return () => queries.forEach(query => query.removeEventListener('change', cb));
};
const restricted = () => matchMedia('(prefers-reduced-motion: reduce)').matches || Boolean(
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
);
const names = ['Ketelkeuze', 'Aansluitingen', 'Veiligheid', 'Oplevering'];

export function Story({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null), host = useRef<HTMLDivElement>(null);
  const view = useRef<ProductScene | null>(null), progress = useRef(0);
  const heating = useRef(0), gas = useRef(0);
  const reduced = useSyncExternalStore(subscribe, restricted, () => true);
  const [paused, setPaused] = useState(false), [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false), [chapter, setChapter] = useState(0);
  const [inView, setInView] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const storybar = useRef<HTMLElement>(null), chapterPicker = useRef<HTMLButtonElement>(null);
  const active = !reduced && !paused && !failed;

  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!storybar.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); chapterPicker.current?.focus(); }
    };
    const resize = () => setMenuOpen(false);
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    window.addEventListener('resize', resize);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('resize', resize);
    };
  }, [menuOpen]);

  // Navigation stays live even when animation is disabled or WebGL fails.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const sections = Array.from(el.querySelectorAll<HTMLElement>('.ps-chapter'));
    const heatingText = el.querySelector<HTMLElement>('[data-heating-detail]');
    const gasText = el.querySelector<HTMLElement>('.ps-gas-focus');
    let raf = 0;
    const update = () => {
      raf = 0;
      const { top, bottom } = el.getBoundingClientRect();
      const height = window.innerHeight;
      const ease = (value: number) => {
        const t = Math.max(0, Math.min(1, value));
        return t * t * (3 - 2 * t);
      };
      // The product dissolves first; the chapter menu follows as the reading
      // section enters. Both fades reverse naturally when scrolling back up.
      const sceneOpacity = ease((bottom - height * .65) / (height * .75));
      const menuOpacity = ease((height - top) / (height * .2))
        * ease((bottom - height * .45) / (height * .6));
      el.style.setProperty('--ps-scene-opacity', String(sceneOpacity));
      el.style.setProperty('--ps-menu-opacity', String(menuOpacity));
      setInView(menuOpacity > .01);
      const offsets = sections.map(section => section.getBoundingClientRect().top - top);
      // The shared anchor navigation leaves a 90px reading margin.
      const readingLine = window.innerWidth < 700
        ? (el.querySelector<HTMLElement>('.ps-stage')?.offsetHeight ?? 0) + 91 : 91;
      const y = -top + readingLine;
      let index = 0;
      while (index < sections.length - 1 && y >= offsets[index + 1]) index++;
      const distance = index < sections.length - 1 ? offsets[index + 1] - offsets[index] : sections[index].offsetHeight;
      const part = Math.max(0, Math.min(1, (y - offsets[index]) / Math.max(1, distance)));
      // A continuous ease with zero acceleration at chapter boundaries.
      // The same curve works when the visitor scrolls backwards.
      const smooth = (n: number) => n * n * n * (n * (n * 6 - 15) + 10);
      const textBox = heatingText?.getBoundingClientRect();
      const gasBox = gasText?.getBoundingClientRect();
      const cues = index === 1 && textBox && gasBox ? connectionCues({
        height, readingTop: readingLine, radiatorTop: textBox.top,
        gasTop: gasBox.top, gasBottom: gasBox.bottom,
        nextTop: sections[2].getBoundingClientRect().top,
      }) : { radiator: 0, gas: 0, exit: 0 };
      const travel = index === 1 ? cues.exit : smooth(part);
      // Four reading chapters still complete all four original camera transitions.
      progress.current = Math.min(4, index + travel) / 4;
      heating.current = cues.radiator; gas.current = cues.gas;
      el.dataset.connectionBeat = cues.gas > 0 ? 'gas' : cues.radiator > 0 ? 'radiator' : 'pipes';
      view.current?.progress(progress.current, heating.current, gas.current);
      setChapter(index);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(update); };
    const resize = new ResizeObserver(wake);
    sections.forEach(section => resize.observe(section));
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    wake();
    return () => {
      resize.disconnect(); cancelAnimationFrame(raf);
      window.removeEventListener('scroll', wake); window.removeEventListener('resize', wake);
    };
  }, [active]);

  useEffect(() => {
    const el = root.current, mount = host.current;
    if (!active || !el || !mount) return;
    let dead = false, intersects = true;
    const visibility = () => view.current?.visible(intersects && !document.hidden);
    const observer = new IntersectionObserver(entries => { intersects = entries[0].isIntersecting; visibility(); });
    observer.observe(el);
    document.addEventListener('visibilitychange', visibility);
    import('./scene').then(({ createProductScene }) => {
      if (dead) return;
      view.current = createProductScene(mount, () => { if (!dead) setLoaded(true); }, () => { if (!dead) setFailed(true); });
      view.current.progress(progress.current, heating.current, gas.current);
      visibility();
    }).catch(() => { if (!dead) setFailed(true); });
    return () => {
      dead = true; observer.disconnect(); document.removeEventListener('visibilitychange', visibility);
      view.current?.dispose(); view.current = null;
    };
  }, [active]);

  return <div className="ps-story" ref={root} data-live={active && loaded ? 'true' : 'false'} data-motion={active ? 'on' : 'off'} data-chapter={chapter} id="product-story">
    <div className="ps-stage">
      <div className="ps-visual" aria-hidden="true">
      <div className="ps-webgl" ref={host} />
      <img className="ps-poster" src="/concept-3d/cv-ketels/installation-overview.webp" alt="" width="1000" height="1100" />
      <div className="ps-gas-marker" data-gas-marker><i /><span>Gasleiding</span></div>
      <div className="ps-radiator-key" data-radiator-key><span><b>→ Aanvoer</b>Van ketel naar radiator</span><span><b>← Retour</b>Terug naar de ketel</span></div>
      </div>
    <aside className="ps-storybar" ref={storybar} aria-label="Op deze pagina" data-visible={inView} data-menu-open={menuOpen} inert={!inView} aria-hidden={!inView}>
      <span className="ps-current">0{chapter + 1}<i>/ 0{names.length}</i></span>
      <button className="ps-chapter-picker" ref={chapterPicker} aria-label={`Hoofdstukken: ${names[chapter]}`} aria-expanded={menuOpen} aria-controls="ps-chapter-links" onClick={() => setMenuOpen(!menuOpen)}>
        <span className="ps-picker-number">0{chapter + 1}</span><span>{names[chapter]}</span>
        <svg className="ps-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m7 14 5-5 5 5" /></svg>
      </button>
      <nav id="ps-chapter-links" aria-label="Hoofdstukken">{names.map((name, index) => <a key={name} href={`#ps-scene-${index + 1}`} aria-label={name} aria-current={index === chapter ? 'step' : undefined} onClick={() => { if (menuOpen) { setMenuOpen(false); chapterPicker.current?.focus(); } }}><span aria-hidden="true">0{index + 1}</span><span>{name}</span></a>)}</nav>
      {!reduced && !failed && <button className="ps-motion-toggle" onClick={() => { setLoaded(false); setPaused(!paused); }} aria-label={paused ? 'Beweging hervatten' : 'Beweging pauzeren'} aria-pressed={paused}>
        <svg className="ps-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{paused ? <path d="m8 5 11 7-11 7Z"/> : <path d="M8 5v14M16 5v14"/>}</svg>
        <span className="ps-toggle-label">{paused ? 'Beweging aan' : 'Beweging uit'}</span>
      </button>}
    </aside>
    </div>
    <div className="ps-chapters">{children}</div>
    <div className="ps-outro" aria-hidden="true" />
  </div>;
}
