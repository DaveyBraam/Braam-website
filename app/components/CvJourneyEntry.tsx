"use client";

import { useEffect, useRef, useState } from "react";
import { reserveCvJourneyHeight } from "../lib/cv-woning-layout";

type Phase = "intro" | "preparing" | "revealing" | "skipping" | "closed";

export function CvJourneyEntry() {
  const dialog = useRef<HTMLDialogElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const actions = useRef<{ start: () => void; skip: () => void } | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");

  useEffect(() => {
    const panel = dialog.current;
    const story = document.querySelector<HTMLElement>("#cv-woning");
    if (!panel || !story) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const opening = story.querySelector<HTMLElement>(".cvw-opening");
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const wasStopped = window.__lenis?.isStopped;
    let timer = 0;
    let intent: "story" | "information" | null = null;
    let leaving = false;
    let released = false;

    if (opening) opening.dataset.intro = reducedMotion.matches ? "complete" : "pending";
    const finishOpening = (event: AnimationEvent) => {
      if (event.animationName === "cvw-opening-text" && event.target instanceof Element && event.target.classList.contains("cvw-scroll-cue")) {
        if (opening) opening.dataset.intro = "complete";
      }
    };
    opening?.addEventListener("animationend", finishOpening);

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + scrollbar}px`;
    window.__lenis?.stop();
    // Reserve the final scroll length before either choice can be made.
    if (!reducedMotion.matches) {
      story.dataset.mode = "loading";
      reserveCvJourneyHeight(story);
    }
    panel.close();
    panel.showModal();
    startButton.current?.focus({ preventScroll: true });

    const unlock = () => {
      if (released) return;
      released = true;
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      if (!wasStopped) window.__lenis?.start();
      window.__lenis?.resize();
    };

    const moveTo = (top: number) => {
      if (window.__lenis) window.__lenis.scrollTo(top, { immediate: true, force: true });
      else window.scrollTo({ top, behavior: "instant" });
    };

    const reveal = (destination: "story" | "information") => {
      if (leaving) return;
      leaving = true;
      intent = destination;
      if (destination === "story") {
        moveTo(0);
        story.dispatchEvent(new Event("cvw:reset"));
      } else {
        if (opening) opening.dataset.intro = "complete";
        const information = document.querySelector<HTMLElement>("#cv-informatie");
        if (information) moveTo(window.scrollY + information.getBoundingClientRect().top - 28);
      }
      setPhase(destination === "story" ? "revealing" : "skipping");
      timer = window.setTimeout(() => {
        panel.close();
        unlock();
        setPhase("closed");
        // The card begins only once the white entry screen has faded away.
        if (opening && destination === "story") {
          opening.dataset.intro = reducedMotion.matches || story.dataset.mode !== "animated" ? "complete" : "drawing";
        }
        const target = document.querySelector<HTMLElement>(destination === "story" ? "#cv-woning h1" : "#cv-informatie h2");
        target?.setAttribute("tabindex", "-1");
        target?.focus({ preventScroll: true });
      }, reducedMotion.matches ? 0 : destination === "story" ? 1100 : 460);
    };

    const ready = () => { if (intent === "story") reveal("story"); };
    const start = () => {
      intent = "story";
      if (story.dataset.ready === "true") reveal("story");
      else setPhase("preparing");
    };
    const skip = () => reveal("information");
    const cancel = (event: Event) => { event.preventDefault(); skip(); };
    actions.current = { start, skip };
    story.addEventListener("cvw:ready", ready);
    panel.addEventListener("cancel", cancel);

    return () => {
      window.clearTimeout(timer);
      story.removeEventListener("cvw:ready", ready);
      panel.removeEventListener("cancel", cancel);
      panel.close();
      unlock();
      opening?.removeEventListener("animationend", finishOpening);
      if (opening) opening.dataset.intro = "complete";
      actions.current = null;
    };
  }, []);

  if (phase === "closed") return null;
  return (
    <>
      <dialog ref={dialog} open className="cvw-entry" data-phase={phase} data-lenis-prevent aria-labelledby="cvw-entry-titel">
        <div className="cvw-entry-copy">
          <span className="cvw-entry-mark">Ketelwijzer</span>
          <h2 id="cvw-entry-titel" className="cvw-entry-title">Van warm water<br /><span>tot rookgasafvoer.</span></h2>
          <p className="cvw-entry-line">Een rondgang door een woning, langs alles wat bij een cv-installatie hoort.</p>
          <div className="cvw-entry-actions">
            <button ref={startButton} type="button" className="cvw-entry-start" onClick={() => actions.current?.start()} disabled={phase === "preparing"} aria-busy={phase === "preparing"}>
              <span>Start het verhaal</span>
              <span className={phase === "preparing" ? "cvw-entry-spinner" : "cvw-entry-arrow"} aria-hidden="true">{phase === "preparing" ? "" : "→"}</span>
            </button>
            <button type="button" className="cvw-entry-info" onClick={() => actions.current?.skip()}>Ga direct naar informatie</button>
          </div>
        </div>
        <p className="sr-only" role="status">{phase === "preparing" ? "De woning wordt klaargezet. U kunt ook direct naar de informatie gaan." : ""}</p>
      </dialog>
      <noscript><style>{".cvw-entry { display: none !important; }"}</style></noscript>
    </>
  );
}
