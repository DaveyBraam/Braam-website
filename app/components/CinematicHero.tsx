"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const highlights = ["Persoonlijk advies", "STEK & CO-VRIJ gecertificeerd", "Sinds 2000 actief"];

// Three photographed moments, each locked to its own clip. The camera moves,
// the scene never changes: every frame comes from that scene's own footage.
const scenes = [
  {
    dir: "01",
    frames: 60,
    label: "Aankomst",
    title: "De monteur komt voorrijden.",
    note: "Materiaal staat klaar achter in de bus.",
  },
  {
    dir: "02",
    frames: 60,
    label: "Uitleg",
    title: "Even laten zien hoe de thermostaat werkt.",
    note: "Zodat u er daarna zelf mee overweg kunt.",
  },
  {
    dir: "03",
    frames: 60,
    label: "Warmtepomp",
    title: "De warmtepomp staat op zijn plek.",
    note: "Netjes geplaatst en bereikbaar voor onderhoud.",
  },
];

const TOTAL_SCENES = scenes.length;
// Share of a scene's scroll segment spent dissolving into the next one. A hard
// cut looks broken when you scrub backwards, so the seam is always a fade.
const DISSOLVE = 0.12;

const framePath = (dir: string, index: number) =>
  `/home/hero/${dir}/frame_${String(index + 1).padStart(4, "0")}.jpg`;

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

type Loaded = Array<Array<HTMLImageElement | undefined>>;

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState(0);
  const [copyHidden, setCopyHidden] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 660px)");
    let variant = narrow.matches ? "m" : "";

    let images: Loaded = scenes.map((item) => new Array(item.frames));
    let frame = 0;
    let previous = 0;
    let eased = 0;
    let target = 0;
    let onScreen = true;
    let disposed = false;
    let lastKey = "";

    const load = (sceneIndex: number, frameIndex: number) =>
      new Promise<void>((resolve) => {
        if (images[sceneIndex][frameIndex]) return resolve();
        const image = new Image();
        image.decoding = "async";
        const keep = () => {
          images[sceneIndex][frameIndex] = image;
          resolve();
        };
        image.onload = () => {
          if (image.decode) image.decode().then(keep, keep);
          else keep();
        };
        image.onerror = () => resolve();
        image.src = framePath(variant + scenes[sceneIndex].dir, frameIndex);
      });

    const loadQueue = async (queue: Array<[number, number]>, onBatch?: () => void) => {
      let cursor = 0;
      const worker = async () => {
        while (!disposed) {
          const next = cursor;
          cursor += 1;
          if (next >= queue.length) return;
          await load(queue[next][0], queue[next][1]);
          if (onBatch && next % 12 === 11) onBatch();
        }
      };
      await Promise.all(
        Array.from({ length: Math.min(8, queue.length) }, worker),
      );
    };

    // Cover-fit: fill the stage without ever letterboxing or squashing.
    const paintImage = (image: HTMLImageElement, alpha: number) => {
      const width = canvas.width;
      const height = canvas.height;
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.globalAlpha = alpha;
      context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      context.globalAlpha = 1;
    };

    // Nearest already-decoded frame, so a not-yet-loaded frame shows its
    // neighbour instead of flashing an empty canvas.
    const nearest = (sceneIndex: number, frameIndex: number) => {
      const bucket = images[sceneIndex];
      if (bucket[frameIndex]) return bucket[frameIndex];
      for (let step = 1; step < scenes[sceneIndex].frames; step += 1) {
        if (bucket[frameIndex - step]) return bucket[frameIndex - step];
        if (bucket[frameIndex + step]) return bucket[frameIndex + step];
      }
      return undefined;
    };

    const resize = () => {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width === width && canvas.height === height) return false;
      canvas.width = width;
      canvas.height = height;
      return true;
    };

    const readProgress = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      return clamp01(-rect.top / distance);
    };

    const paint = (progress: number, force = false) => {
      const segment = 1 / TOTAL_SCENES;
      const index = Math.min(TOTAL_SCENES - 1, Math.floor(progress / segment));
      const local = clamp01((progress - index * segment) / segment);

      const count = scenes[index].frames;
      const current = Math.min(count - 1, Math.round(local * (count - 1)));

      // The seam: hold the next scene on its own first frame and fade it in.
      const hasNext = index < TOTAL_SCENES - 1;
      const dissolve = hasNext ? clamp01((local - (1 - DISSOLVE)) / DISSOLVE) : 0;

      const key = `${index}:${current}:${dissolve.toFixed(3)}`;
      if (!force && key === lastKey) return;
      lastKey = key;

      const base = nearest(index, current);
      if (base) paintImage(base, 1);
      if (dissolve > 0) {
        const incoming = nearest(index + 1, 0);
        if (incoming) paintImage(incoming, dissolve);
      }

      const copy = 1 - smoothstep((progress - 0.06) / 0.14);
      section.style.setProperty("--cinema-copy-opacity", copy.toFixed(3));
      section.style.setProperty("--cinema-copy-y", `${(progress * -22).toFixed(2)}px`);
      section.style.setProperty("--cinema-work", progress.toFixed(3));
      section.style.setProperty("--cinema-bridge", dissolve.toFixed(3));
      scenes.forEach((_, position) => {
        const from = position * segment;
        section.style.setProperty(
          `--cchapter-${position + 1}`,
          clamp01((progress - from) / segment).toFixed(3),
        );
      });

      const active = dissolve > 0.5 ? Math.min(TOTAL_SCENES - 1, index + 1) : index;
      setScene((value) => (value === active ? value : active));
      const hidden = copy < 0.3;
      setCopyHidden((value) => (value === hidden ? value : hidden));
    };

    const step = (time: number) => {
      frame = 0;
      const delta = previous ? Math.min(0.064, (time - previous) / 1000) : 1 / 60;
      previous = time;

      target = readProgress();
      // Exponential smoothing gives the camera weight, so it glides on after
      // the wheel stops instead of tracking the scrollbar one to one.
      eased += (target - eased) * (1 - Math.exp(-delta * 7.5));
      if (Math.abs(target - eased) < 0.0004) eased = target;

      paint(eased);

      if (eased !== target) frame = window.requestAnimationFrame(step);
      else previous = 0;
    };

    const wake = () => {
      if (frame || !onScreen || reducedMotion.matches) return;
      previous = 0;
      frame = window.requestAnimationFrame(step);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    };

    const onResize = () => {
      if (resize()) paint(eased, true);
      wake();
    };

    const boot = async () => {
      resize();
      // First frame first: the hero is painted before the rest streams in.
      await load(0, 0);
      if (disposed) return;
      eased = readProgress();
      target = eased;
      paint(eased, true);

      const queue: Array<[number, number]> = [];
      scenes.forEach((item, sceneIndex) => {
        for (let index = 0; index < item.frames; index += 1) {
          if (sceneIndex === 0 && index === 0) continue;
          queue.push([sceneIndex, index]);
        }
      });
      await loadQueue(queue, () => paint(eased, true));
      if (!disposed) paint(eased, true);
    };

    void boot();

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) wake();
        else stop();
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(section);

    const onMotionChange = () => {
      stop();
      if (reducedMotion.matches) {
        eased = 0;
        target = 0;
        paint(0, true);
      } else {
        wake();
      }
    };

    const onVariantChange = () => {
      const next = narrow.matches ? "m" : "";
      if (next === variant) return;
      variant = next;
      images = scenes.map((item) => new Array(item.frames));
      lastKey = "";
      void boot();
    };

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    reducedMotion.addEventListener("change", onMotionChange);
    narrow.addEventListener("change", onVariantChange);

    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      reducedMotion.removeEventListener("change", onMotionChange);
      narrow.removeEventListener("change", onVariantChange);
    };
  }, []);

  return (
    <section
      className="cinema-sequence"
      id="top"
      ref={sectionRef}
      data-scene={scene}
      aria-labelledby="home-cinematic-title"
    >
      <div className="cinema-stage">
        <div className="cinema-camera" aria-hidden="true">
          <canvas className="cinema-canvas" ref={canvasRef} />
        </div>
        <div className="cinema-depth" aria-hidden="true" />
        <div className="cinema-grade" aria-hidden="true" />
        <div className="cinema-grain" aria-hidden="true" />

        <div className="shell cinema-content">
          <div className="cinema-copy" inert={copyHidden || undefined}>
            <p className="eyebrow eyebrow-light"><span /> Installatiebedrijf uit &apos;s-Hertogenbosch</p>
            <h1 id="home-cinematic-title">
              <span className="cinema-line"><span>Installatie en onderhoud.</span></span>
              <span className="cinema-line"><em>Persoonlijk geregeld.</em></span>
            </h1>
            <p className="cinema-lead">Bij Braam krijgt u advies, installatie, onderhoud en service van hetzelfde team. Vanuit &apos;s-Hertogenbosch werken we in Noord-Brabant en aangrenzende delen van Gelderland.</p>
            <div className="cinema-actions">
              <Link className="button button-primary" href="/contact#contact-keuze">Offerte aanvragen <span aria-hidden="true">↗</span></Link>
              <a className="phone-link" href="tel:+31736222199"><span className="phone-icon" aria-hidden="true">↗</span><span><small>Even overleggen?</small><strong>073 622 2199</strong></span></a>
            </div>
          </div>

          <div className="cinema-story" aria-hidden="true">
            {scenes.map((item, index) => (
              <figure className={index === scene ? "is-active" : ""} key={item.label}>
                <figcaption><i />0{index + 1} — {item.label}</figcaption>
                <strong>{item.title}</strong>
                <p>{item.note}</p>
              </figure>
            ))}
          </div>

          <div className="cinema-footer">
            <div className="cinema-proofs" aria-label="Zekerheden">
              {highlights.map((item) => <span className="cinema-proof" key={item}><i aria-hidden="true" />{item}</span>)}
            </div>

            <div className="cinema-route" aria-label={`Scène ${scene + 1} van ${scenes.length}: ${scenes[scene].label}`}>
              <ol aria-hidden="true">
                {scenes.map((item, index) => (
                  <li className={index === scene ? "is-active" : ""} key={item.label}>
                    <span className="cinema-route-bar"><i style={{ transform: `scaleX(var(--cchapter-${index + 1}, 0))` }} /></span>
                    <span className="cinema-route-label"><b>0{index + 1}</b>{item.label}</span>
                  </li>
                ))}
              </ol>
            </div>

            <span className="cinema-scroll-cue">Scroll om mee te bewegen <span aria-hidden="true">↓</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}
