/** Opening chapter only. Every transform is a pure function of progress.
 * No simulation, visibility changes, material animation or accumulated motion.
 * Source geometry and materials stay untouched; the flue gets one uniform unit fit.
 */
export const OPENING_DURATION = 20;
export const OPENING_ASSETS = {
  boiler: "/models/cv-fotoreferentie/cv-concept.glb",
  flue: "/models/cv-fotoreferentie/concentrische-rookgasbuis-dakdoorvoer.glb",
  // Source flue is Z-up and has a 108 mm radius; boiler socket is 52 mm.
  flueScale: .052 / .108,
  flueSeat: [0, 1.047, .145] as [number, number, number],
};
export const OPENING_BEATS = [
  { label: "01 · Detail", position: 0 },
  { label: "02 · Onthulling", position: .23 },
  { label: "03 · Product", position: .43 },
  { label: "04 · Compositie", position: .62 },
  { label: "05 · Rookgasafvoer", position: .79 },
  { label: "06 · Eindbeeld", position: 1 },
];
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const phase = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function sampleCvOpening(progress: number) {
  const p = clamp(progress);
  const reveal = ease(phase(p, .025, .40));
  const settle = ease(phase(p, .22, .67));
  const compose = ease(phase(p, .43, .73));
  const approach = ease(phase(p, .55, .85));
  const seat = ease(phase(p, .80, .94));
  const widen = ease(phase(p, .57, .87));
  return {
    x: .92 * compose,
    y: .075 + .05 * (1 - settle),
    z: -.025 * (1 - settle),
    rotationY: mix(-.19, -.10, reveal) - .035 * settle,
    rotationZ: .008 * (1 - settle),
    // Vertical approach overlaps the last part of the boiler's settle.
    // Final 22 mm seat has its own restrained deceleration, no bounce.
    flueLift: 3.4 * (1 - approach) + .022 * (1 - seat),
    flueBack: -.28 * (1 - approach),
    camera: [mix(.38, .87, reveal) - .18 * widen,
      mix(.665, 1.00, reveal) + .30 * widen,
      mix(.67, 4.10, reveal) + 2.00 * widen] as [number, number, number],
    target: [mix(.155, 0, reveal) - .08 * compose,
      mix(.59, .47, reveal) + .69 * widen,
      .145] as [number, number, number],
  };
}
