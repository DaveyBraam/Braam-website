"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const tiltSelector = [
  ".hero-service-grid > a",
  ".service-card",
  ".home-price-row > a",
  ".price-card",
  ".benefit-grid article",
  ".service-detail-grid article",
  ".option-grid article",
  ".service-contact-grid > a",
  ".case-grid article",
  ".maintenance-card",
  ".contact-route-grid > a",
  ".application-assurance",
  ".knowledge-card-published",
].join(",");

const parallaxSelector = [
  ".hero-project-image",
  ".page-hero-image img",
  ".image-story figure img",
  ".contact-details figure img",
  ".article-hero-image img",
].join(",");

const revealChildSelector = [
  ".service-grid > *",
  ".proof-grid > *",
  ".project-gallery > *",
  ".home-price-row > *",
  ".pricing-grid > *",
  ".benefit-grid > *",
  ".service-detail-grid > *",
  ".option-grid > *",
  ".service-contact-grid > *",
  ".case-grid > *",
  ".maintenance-choice-grid > *",
  ".maintenance-trust-grid > *",
  ".subscription-steps > *",
  ".faq-grid > *",
  ".story-points > *",
  ".contact-route-grid > *",
  ".knowledge-category-grid > *",
  ".knowledge-grid > *",
  ".article-related-grid > *",
  ".contact-options > a",
  ".place-list > *",
].join(",");

export function Experience() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    revealItems.forEach((section, sectionIndex) => {
      section.style.setProperty("--reveal-x", `${sectionIndex % 2 === 0 ? -12 : 12}px`);
      section.querySelectorAll<HTMLElement>(revealChildSelector).forEach((item, itemIndex) => {
        item.classList.add("reveal-item");
        item.style.setProperty("--reveal-delay", `${Math.min(itemIndex, 5) * 65}ms`);
        item.style.setProperty("--reveal-item-x", `${itemIndex % 2 === 0 ? -8 : 8}px`);
      });
    });

    root.classList.add("experience-ready");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.035, rootMargin: "0px 0px -7% 0px" },
      );
      revealItems.forEach((item) => observer.observe(item));
      cleanups.push(() => observer.disconnect());
    }

    const updatePageProgress = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--page-progress", `${Math.min(1, window.scrollY / maxScroll)}`);
    };
    updatePageProgress();
    window.addEventListener("scroll", updatePageProgress, { passive: true });
    window.addEventListener("resize", updatePageProgress, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", updatePageProgress);
      window.removeEventListener("resize", updatePageProgress);
    });

    if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
      let pointerFrame = 0;
      let pointerX = window.innerWidth / 2;
      let pointerY = window.innerHeight * 0.3;
      const updatePointer = () => {
        pointerFrame = 0;
        root.style.setProperty("--pointer-x", `${pointerX}px`);
        root.style.setProperty("--pointer-y", `${pointerY}px`);
      };
      const pointerMove = (event: PointerEvent) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!pointerFrame) pointerFrame = window.requestAnimationFrame(updatePointer);
      };
      window.addEventListener("pointermove", pointerMove, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("pointermove", pointerMove);
        if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      });

      const tiltItems = Array.from(document.querySelectorAll<HTMLElement>(tiltSelector));
      tiltItems.forEach((item) => {
        item.classList.add("tilt-surface");
        const move = (event: PointerEvent) => {
          const rect = item.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          item.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
          item.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
          item.style.setProperty("--glow-x", `${((x + 0.5) * 100).toFixed(1)}%`);
          item.style.setProperty("--glow-y", `${((y + 0.5) * 100).toFixed(1)}%`);
        };
        const leave = () => {
          item.style.setProperty("--tilt-x", "0deg");
          item.style.setProperty("--tilt-y", "0deg");
          item.style.setProperty("--glow-x", "50%");
          item.style.setProperty("--glow-y", "50%");
        };
        item.addEventListener("pointermove", move);
        item.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          item.removeEventListener("pointermove", move);
          item.removeEventListener("pointerleave", leave);
        });
      });

      const magneticItems = Array.from(
        document.querySelectorAll<HTMLElement>(".button, .plan-button, .text-link, .certificate-link"),
      );
      magneticItems.forEach((item) => {
        const move = (event: PointerEvent) => {
          const rect = item.getBoundingClientRect();
          const x = event.clientX - (rect.left + rect.width / 2);
          const y = event.clientY - (rect.top + rect.height / 2);
          item.style.setProperty("--magnet-x", `${(x * 0.1).toFixed(1)}px`);
          item.style.setProperty("--magnet-y", `${(y * 0.16).toFixed(1)}px`);
        };
        const leave = () => {
          item.style.setProperty("--magnet-x", "0px");
          item.style.setProperty("--magnet-y", "0px");
        };
        item.addEventListener("pointermove", move);
        item.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          item.removeEventListener("pointermove", move);
          item.removeEventListener("pointerleave", leave);
        });
      });
    }

    if (!reducedMotion) {
      const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>(parallaxSelector));
      let frame = 0;
      const updateParallax = () => {
        frame = 0;
        parallaxItems.forEach((item) => {
          const rect = item.parentElement?.getBoundingClientRect() ?? item.getBoundingClientRect();
          const center = rect.top + rect.height / 2 - window.innerHeight / 2;
          const offset = Math.max(-24, Math.min(24, center * -0.035));
          item.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
        });
      };
      const requestParallax = () => {
        if (!frame) frame = window.requestAnimationFrame(updateParallax);
      };
      updateParallax();
      window.addEventListener("scroll", requestParallax, { passive: true });
      window.addEventListener("resize", requestParallax, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", requestParallax);
        window.removeEventListener("resize", requestParallax);
        if (frame) window.cancelAnimationFrame(frame);
      });
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      root.classList.remove("experience-ready");
    };
  }, [pathname]);

  return (
    <div className="experience-layer" aria-hidden="true">
      <div className="scroll-progress" />
      <div className="pointer-aura" />
      <div className="ambient-orb ambient-orb-one" />
      <div className="ambient-orb ambient-orb-two" />
      <div className="page-grain" />
    </div>
  );
}
