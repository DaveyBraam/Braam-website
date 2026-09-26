/** Hold the current camera while reading, then travel as the text leaves. */
export function readingTravel({ holdEnd, stickyTop, nextTop, readingLine }: {
  holdEnd: number; stickyTop: number; nextTop: number; readingLine: number;
}) {
  const departure = holdEnd - stickyTop;
  const distance = Math.max(1, nextTop - readingLine - departure);
  const t = Math.max(0, Math.min(1, -departure / distance));
  return t * t * t * (t * (t * 6 - 15) + 10);
}
