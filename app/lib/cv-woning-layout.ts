/** Reserve the story's half of the page before its model has finished loading. */
export function reserveCvJourneyHeight(section: HTMLElement) {
  const remaining = document.querySelector<HTMLElement>("#cv-vervolg");
  const chrome = [".site-footer", ".site-header", ".topline"].reduce(
    (sum, selector) => sum + (document.querySelector(selector)?.getBoundingClientRect().height || 0),
    0,
  );
  const height = Math.round(Math.max(window.innerHeight * 3.5, (remaining?.offsetHeight || 0) + chrome));
  const delta = height - section.offsetHeight;
  if (Math.abs(delta) > 1) section.style.height = `${height}px`;
  return Math.abs(delta) > 1 ? delta : 0;
}
