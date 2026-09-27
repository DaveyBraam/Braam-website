/** Product study, not a plumbing drawing. Positions are presentation coordinates. */
export const modelNames = ["Buitenunit", "Control unit", "Cv-ketel", "Boilervat", "Buffervat", "Thermostaat"];
export type Placement = { model: number; x: number; y: number };
const shared: Placement[] = [{ model: 0, x: -.95, y: -.26 }, { model: 1, x: .28, y: .8 }, { model: 4, x: .28, y: -.23 }];
export const shots = [
  { items: [{ model: 0, x: 0, y: 0 }], angle: -.32, rise: .18, width: 1.75, height: 1.65 },
  { items: [...shared, { model: 2, x: 1.18, y: .12 }], angle: .12, rise: .08, width: 3.35, height: 2.75 },
  { items: [...shared, { model: 2, x: 1.18, y: .12 }], angle: .12, rise: .08, width: 3.35, height: 2.75 },
  { items: [...shared, { model: 3, x: 1.18, y: .05 }], angle: .12, rise: .08, width: 3.35, height: 2.75 },
  { items: [{ model: 4, x: -.65, y: -.405 }, { model: 3, x: .5, y: 0 }], angle: -.18, rise: .12, width: 2.15, height: 2.25 },
  { items: [{ model: 5, x: 0, y: 0 }], angle: .23, rise: .12, width: .48, height: .36 },
  { items: [...shared, { model: 3, x: 1.18, y: .05 }], angle: .12, rise: .08, width: 3.35, height: 2.75 },
];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
export function storyFrame(progress: number) {
  const value = Math.max(0, Math.min(shots.length - 1, progress));
  const index = Math.min(shots.length - 2, Math.floor(value)), t = value - index;
  const a = shots[index], b = shots[index + 1], movement = ease(t);
  const models = modelNames.map((name, model) => {
    const from = a.items.find(item => item.model === model), to = b.items.find(item => item.model === model);
    if (!from && !to) return { name, x: 0, y: 0, opacity: 0, visible: false };
    // The shared parts stay still during the only system exchange: boiler ↔ cylinder.
    if (from && to) return { name, x: from.x + (to.x - from.x) * movement, y: from.y + (to.y - from.y) * movement, opacity: 1, visible: true };
    const opacity = from ? 1 - ease(t) : ease(t);
    const point = from ?? to!;
    // Opacity applies to a flattened product render, never its mesh materials.
    return { name, x: point.x, y: point.y + (from ? .08 * (1 - opacity) : -.08 * (1 - opacity)), opacity, visible: opacity > .001 };
  });
  const composed = (n: number) => [1, 2, 3, 4, 6].includes(n) ? 1 : 0;
  const flow = (n: number) => [1, 2, 3].includes(n) ? 1 : 0;
  return { index, t, models, labels: composed(index) * (1 - t) + composed(index + 1) * t, flow: flow(index) * (1 - t) + flow(index + 1) * t };
}

/** Scroll-cinematic: a small reversible detail orbit, with still system comparisons. */
export function cinematicCamera(progress: number, reading: number) {
  const value = Math.max(0, Math.min(shots.length - 1, progress));
  const index = Math.min(shots.length - 2, Math.floor(value)), t = value - index;
  const a = shots[index], b = shots[index + 1], blend = ease(t);
  const detail = [0, 4, 5].includes(index);
  const emphasis = detail ? Math.sin(Math.PI * clamp(reading)) * (1 - blend) : 0;
  return {
    angle: a.angle + (b.angle - a.angle) * blend + emphasis * .055,
    rise: a.rise + (b.rise - a.rise) * blend,
    width: (a.width + (b.width - a.width) * blend) * (1 - emphasis * .025),
    height: (a.height + (b.height - a.height) * blend) * (1 - emphasis * .025),
  };
}
