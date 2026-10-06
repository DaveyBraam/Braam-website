"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Only what can be checked. "Persoonlijk advies" was a claim standing in a
// proof row; certification and trading years are facts a visitor can verify.
const highlights = ["CO-gecertificeerd bedrijf", "STEK-gecertificeerde monteurs", "Sinds 2000"];

// Four moments of one visit. They play as one film behind the copy; the
// caption and the chapter bars at the bottom follow the film.
const scenes = [
  {
    dir: "01",
    label: "Aankomst",
    title: "De monteur komt voorrijden.",
    note: "Gereedschap en materiaal staan klaar in de bus.",
  },
  {
    dir: "02",
    label: "Het werk",
    title: "De warmtepomp wordt nagelopen.",
    note: "Metingen, afstellen en controleren wat er nodig is.",
  },
  {
    dir: "03",
    label: "Uitleg",
    title: "Even laten zien hoe de thermostaat werkt.",
    note: "Zodat u er daarna zelf mee overweg kunt.",
  },
  {
    dir: "04",
    label: "Afronding",
    title: "Klaar, en u weet waar u aan toe bent.",
    note: "Heeft u later een vraag, dan belt u gewoon.",
  },
];

// One continuous film (public/home/film): the four scenes joined by 0.8 s
// dissolves into a seamless loop of 13.8 s, played 12% faster than generated and
// with a short handshake at the end. It plays on its own behind the copy;
// nothing on this hero follows the scroll.
const FILM = "/home/film/";
const FILM_LENGTH = 13.834;
/** Film time at which each scene takes over (halfway through its dissolve); the last
    entry is where the first scene comes back. */
const CHANGES = [0, 3.43, 7.218, 11.005, 13.505];

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const wrap = (time: number) => ((time % FILM_LENGTH) + FILM_LENGTH) % FILM_LENGTH;

/** Which scene is on screen at a moment of the film. */
const sceneAt = (time: number) => {
  const t = wrap(time);
  for (let index = scenes.length - 1; index >= 0; index -= 1) if (t >= CHANGES[index] && t < CHANGES[index + 1]) return index;
  return 0;
};
/** How far along its own stretch of the film a scene is (0 before, 1 after). */
const chapterProgress = (time: number, index: number) =>
  clamp01((wrap(time) - CHANGES[index]) / (CHANGES[index + 1] - CHANGES[index]));

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 660px)");
    let onScreen = true;
    let frame = 0;

    const source = () => `${FILM}${narrow.matches ? "mobile" : "desktop"}-v2.mp4`;

    // The chapter bars and caption follow the film's own clock.
    const tick = () => {
      frame = 0;
      const time = video.currentTime;
      scenes.forEach((_, index) => {
        section.style.setProperty(`--cchapter-${index + 1}`, chapterProgress(time, index).toFixed(3));
      });
      const active = sceneAt(time);
      setScene((value) => (value === active ? value : active));
      if (!video.paused) frame = window.requestAnimationFrame(tick);
    };

    const play = () => {
      if (reducedMotion.matches || !onScreen || document.hidden) {
        video.pause();
        return;
      }
      if (video.getAttribute("src") !== source()) {
        video.src = source();
        video.load();
      }
      video.muted = true;
      void video.play().catch(() => {
        // Autoplay refused (power saving, data saver): the poster stays.
      });
    };

    const onPlaying = () => {
      section.dataset.playing = "true";
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    const onPause = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    // Only play while the hero can be seen: no decoding for nobody further down the page.
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) play();
      else video.pause();
    });
    observer.observe(section);

    const onVisibility = () => (document.hidden ? video.pause() : play());
    const onVariant = () => {
      if (video.getAttribute("src")) video.removeAttribute("src");
      play();
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", play);
    narrow.addEventListener("change", onVariant);
    play();

    return () => {
      onPause();
      observer.disconnect();
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", play);
      narrow.removeEventListener("change", onVariant);
      video.pause();
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
          <picture className="cinema-poster">
            <source media="(max-width: 660px)" srcSet={`${FILM}poster-mobile.jpg`} />
            <img src={`${FILM}poster.jpg`} alt="" fetchPriority="high" />
          </picture>
          <video className="cinema-video" ref={videoRef} muted loop playsInline preload="auto" disablePictureInPicture tabIndex={-1} />
        </div>
        <div className="cinema-depth" aria-hidden="true" />
        <div className="cinema-grade" aria-hidden="true" />
        <div className="cinema-grain" aria-hidden="true" />

        <div className="shell cinema-content">
          <div className="cinema-copy">
            <h1 id="home-cinematic-title">
              <span className="cinema-line">Dezelfde mensen die het installeren,</span>
              <span className="cinema-line">onderhouden het ook.</span>
            </h1>
            <p className="cinema-lead">Warmtepompen, cv-ketels, airco en elektra. Vanuit &apos;s-Hertogenbosch, in Noord-Brabant en aangrenzend Gelderland.</p>
            <div className="cinema-actions">
              <a className="cinema-call" href="tel:+31736222199">
                <small>Storing of een vraag?</small>
                <strong>073 622 2199</strong>
              </a>
              <Link className="button button-primary" href="/offerte-aanvragen">Offerte aanvragen</Link>
            </div>
          </div>

          <div className="cinema-story" aria-hidden="true">
            {scenes.map((item, index) => (
              <figure className={index === scene ? "is-active" : ""} key={item.label}>
                <figcaption>0{index + 1} / {item.label}</figcaption>
                <strong>{item.title}</strong>
                <p>{item.note}</p>
              </figure>
            ))}
          </div>

          <div className="cinema-footer">
            <div className="cinema-proofs" aria-label="Zekerheden">
              {highlights.map((item) => <span className="cinema-proof" key={item}>{item}</span>)}
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

          </div>
        </div>
      </div>
    </section>
  );
}
