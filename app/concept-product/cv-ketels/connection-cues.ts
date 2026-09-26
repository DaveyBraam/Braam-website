const ease = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

/** Reading positions drive one ordered camera visit, in either scroll direction. */
export function connectionCues({ height, readingTop, radiatorTop, gasTop, gasBottom, nextTop }: {
  height: number; readingTop: number; radiatorTop: number;
  gasTop: number; gasBottom: number; nextTop: number;
}) {
  const readingHeight = Math.max(160, height - readingTop);
  const focus = readingTop + readingHeight * .4;
  const ramp = readingHeight * .26;
  const arrive = ease((focus + readingHeight * .14 - radiatorTop) / ramp);
  // Return before the gas text reaches the reading position. Its label starts later.
  const returnToBoiler = ease((focus + readingHeight * .3 - gasTop) / ramp);
  const gas = ease((focus - gasTop) / (readingHeight * .14))
    * ease((gasBottom - readingTop) / (readingHeight * .18));
  const exit = ease((readingTop - gasBottom) / Math.max(1, nextTop - gasBottom));
  return { radiator: arrive * (1 - returnToBoiler), gas, exit };
}
