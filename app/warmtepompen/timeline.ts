/* The daylight journey for /warmtepompen (test version 5), as pure functions.

   Version 2's journey, made light and calm: the same house on a sunny winter
   morning, straight in to the outdoor unit, a soft fade into the garage, on to
   the living room, and back out as the day turns to evening and the lights in
   the house and the outdoor lamps come on one by one, exactly with the scroll.

   Scroll position t (in viewport-heights) maps to a Frame that the page and the
   3D scene both read, so the models stay glued to the photographs. A plate's
   view is a zoom relative to "cover", the photo point (fx, fy) and the screen
   point it lands on (sx, sy). All photos share one 16:9 frame. */

export type PlateId = "ext" | "gar" | "liv";
export type View = { zoom: number; fx: number; fy: number; sx: number; sy: number };
export type CopyId = "hero" | "werking" | "hybride" | "elektrisch" | "vaten" | "regeling" | "finale";
export type Frame = {
  t: number;
  plates: Record<PlateId, { opacity: number; view: View }>;
  /** exterior photograph: 1 = sunny morning, 0 = dusk */
  daylight: number;
  /** 0..1 how far the blue hour has deepened into evening */
  night: number;
  /** 0..1 per light, in the order they switch on (see LIGHTS) */
  lights: number[];
  /** 3D layer opacity per photographed room */
  scenes: { ext: number; gar: number; liv: number };
  /** 0 = hybride (ketel), 1 = volledig elektrisch (boilervat) */
  swap: number;
  copy: Record<CopyId, number>;
};

export const TRACK = 10.9;

/** The evening lights, in the order they switch on: one layer each (public/warmtepomp-test-v3/licht-*.webp). */
export const LIGHTS = ["buren", "woonkamer", "boven-links", "boven-rechts", "garage", "lamp-schuifpui", "lamp-links", "lamp-garage"] as const;
export const FRAME = { width: 1600, height: 900 };

/** Where things are in the photographs, as fractions of the 16:9 frame. */
export const marks = {
  unit: { fx: 0.7625, fy: 0.72 },
  installation: { fx: 0.49, fy: 0.5 },
  vessels: { fx: 0.49, fy: 0.6 },
  thermostat: { fx: 0.78, fy: 0.47 },
};

const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
const mix = (a: number, b: number, k: number) => a + (b - a) * k;
/** smootherstep between a and b */
export const ease = (a: number, b: number, t: number) => { const k = clamp((t - a) / (b - a)); return k * k * k * (k * (k * 6 - 15) + 10); };
const mixView = (a: View, b: View, k: number): View => ({ zoom: a.zoom * Math.pow(b.zoom / a.zoom, k), fx: mix(a.fx, b.fx, k), fy: mix(a.fy, b.fy, k), sx: mix(a.sx, b.sx, k), sy: mix(a.sy, b.sy, k) });
const V = (zoom: number, fx: number, fy: number, sx = 0.5, sy = 0.5): View => ({ zoom, fx, fy, sx, sy });
const scaled = (v: View, k: number): View => ({ ...v, zoom: v.zoom * k });
/** A plateau window: ramps in, holds at full strength, ramps out. */
const windowed = (t: number, from: number, to: number, ramp = 0.22) => Math.min(ease(from, from + ramp, t), 1 - ease(to - ramp, to, t));

/** Zoom that shows the whole frame inside the viewport (letterboxed), relative to cover. */
export function containZoom(vw: number, vh: number) {
  return Math.min(vw / FRAME.width, vh / FRAME.height) / Math.max(vw / FRAME.width, vh / FRAME.height);
}

/** Screen rectangle of a plate's full 16:9 frame for a view. A covering plate keeps
    covering; a smaller one (the phone finale) is placed exactly where asked. */
export function plateRect(view: View, vw: number, vh: number) {
  const cover = Math.max(vw / FRAME.width, vh / FRAME.height);
  const width = FRAME.width * cover * view.zoom, height = FRAME.height * cover * view.zoom;
  const freeLeft = view.sx * vw - view.fx * width, freeTop = view.sy * vh - view.fy * height;
  const left = width >= vw ? Math.min(0, Math.max(vw - width, freeLeft)) : freeLeft;
  const top = height >= vh ? Math.min(0, Math.max(vh - height, freeTop)) : freeTop;
  return { left, top, width, height };
}

/** Re-express a view so that a given photo point is its focus, keeping the framing. */
function anchored(view: View, fx: number, fy: number, vw: number, vh: number): View {
  const r = plateRect(view, vw, vh);
  return { zoom: view.zoom, fx, fy, sx: (r.left + fx * r.width) / vw, sy: (r.top + fy * r.height) / vh };
}

export function frameAt(rawT: number, mobile: boolean, vw: number, vh: number, reduced = false): Frame {
  const t = clamp(rawT, 0, TRACK);
  const m = mobile;
  // Desktop: the copy reads on paper at the left, the subject sits right of centre.
  // Phones: the subject sits in the upper half, the copy on paper below it.
  const sx = m ? 0.5 : 0.64, up = m ? 0.32 : 0.5;
  const { unit } = marks;

  const E0 = m ? V(2.1, 0.75, 0.66, 0.5, 0.3) : V(1, 0.58, 0.5);
  const E1 = m ? V(2.15, 0.752, 0.665, 0.5, 0.3) : V(1.06, 0.6, 0.53);
  const E2 = m ? V(2.6, unit.fx, unit.fy, 0.5, up) : V(2.4, unit.fx, unit.fy, sx, 0.55);
  const G1 = m ? V(1, marks.installation.fx + 0.025, marks.installation.fy, 0.5, up) : V(1, marks.installation.fx, marks.installation.fy, sx, 0.5);
  const G2 = m ? V(1.25, marks.vessels.fx + 0.03, marks.vessels.fy, 0.5, up) : V(1.3, marks.vessels.fx + 0.02, marks.vessels.fy, sx, 0.52);
  const L0 = m ? V(1.15, marks.thermostat.fx - 0.06, 0.5, 0.5, up) : V(1.05, 0.62, 0.5, sx, 0.5);
  const L1 = m ? V(1.5, marks.thermostat.fx, marks.thermostat.fy, 0.5, up) : V(1.6, marks.thermostat.fx, marks.thermostat.fy, sx, 0.48);
  const F0 = m ? V(1, 0.6, 0.55, 0.5, 0.4) : V(1.04, 0.6, 0.52);
  const F1 = m ? V(containZoom(vw, vh), 0.5, 0.5, 0.5, 0.27) : V(1, 0.58, 0.5);

  // Every change of room is a soft fade while the camera keeps drifting forward:
  // the room you leave grows a little, the room you enter settles to its framing.
  let ext: View;
  if (t < 1.1) ext = mixView(E0, E1, ease(0, 1.1, t));
  // Straight in to the unit: it holds its place on screen while the camera closes in.
  else if (t < 2.45) ext = mixView(anchored(E1, unit.fx, unit.fy, vw, vh), E2, ease(1.1, 2.3, t));
  else if (t < 7.95) ext = mixView(E2, scaled(E2, 1.12), ease(2.45, 3.25, t));
  // Back in the garden: the camera settles first, then the evening comes.
  else ext = mixView(F0, F1, ease(8.05, 9.6, t));

  // The garage fades in already in its final framing and holds still while its copy
  // arrives: entering zoomed out left it narrower than a wide window, so it slid
  // sideways and grew just as the text came in.
  // Phones show a narrow strip of the garage: with the swap it pans right so the
  // boilervat and the hydraulic station beside it are both in view.
  const GE = m ? V(1, 0.635, marks.installation.fy, 0.5, up) : G1;
  const gar = t < 4.5 ? G1 : t < 5.4 ? mixView(G1, GE, ease(4.5, 5.1, t)) : mixView(GE, G2, ease(5.4, 6.3, t));
  // The living room starts at its own covering framing for the same reason.
  const liv = mixView(L0, L1, ease(6.45, 7.8, t));

  // Bottom to top: ext, gar, liv. A later plate fading in covers the earlier one.
  const garIn = ease(2.6, 3.2, t), livIn = ease(6.45, 6.9, t), livOut = ease(7.95, 8.35, t);
  const extOpacity = t < 3.2 || t >= 7.95 ? 1 : 0;
  const garOpacity = t >= 2.6 && t < 6.9 ? garIn : 0;
  const livOpacity = t >= 6.45 && t < 8.35 ? livIn * (1 - livOut) : 0;
  // Models fade a little ahead of their photograph: a dark product on a light wall
  // would otherwise linger as a ghost over the next room.
  const lead = (o: number) => Math.pow(o, 1.6);
  const scenes = {
    ext: lead(extOpacity * (1 - garOpacity) * (1 - livOpacity)),
    gar: lead(garOpacity * (1 - livOpacity)),
    liv: lead(livOpacity),
  };

  const copy: Record<CopyId, number> = {
    hero: 1 - ease(0.7, 1.05, t),
    werking: windowed(t, 1.3, 2.75),
    hybride: windowed(t, 3.1, 4.4),
    elektrisch: windowed(t, 4.75, 5.45),
    vaten: windowed(t, 5.7, 6.5),
    regeling: windowed(t, 6.85, 7.95),
    finale: ease(9.0, 9.4, t),
  };

  const frame: Frame = {
    t,
    plates: {
      ext: { opacity: extOpacity, view: ext },
      gar: { opacity: garOpacity, view: gar },
      liv: { opacity: livOpacity, view: liv },
    },
    // Morning becomes blue hour in the same frame, the evening deepens, and then
    // the lights come on one at a time: first in the house, then the outdoor lamps.
    daylight: 1 - ease(8.55, 9.25, t),
    night: ease(9.05, 9.85, t),
    lights: [9.2, 9.36, 9.52, 9.66, 9.82, 9.98, 10.12, 10.26].map(start => ease(start, start + 0.22, t)),
    scenes,
    swap: ease(4.5, 5.1, t),
    copy,
  };
  if (reduced) {
    // One framing per beat; only opacity and the time of day change.
    frame.plates.ext.view = t >= 7.95 ? F1 : t < 1.1 ? E0 : E2;
    frame.plates.gar.view = t < 4.75 ? G1 : t < 5.4 ? GE : G2;
    frame.plates.liv.view = L1;
    const on = t >= 9.8 ? 1 : 0;
    frame.night = on; frame.lights = frame.lights.map(() => on);
  }
  return frame;
}
