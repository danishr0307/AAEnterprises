export const clone = (o) => JSON.parse(JSON.stringify(o));

export const reduceMotion =
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Read the current skin's gold / petal colours from CSS variables. */
export function readColors() {
  const cs = getComputedStyle(document.documentElement);
  return {
    gold: cs.getPropertyValue('--gold').trim() || '#c9a24a',
    gold2: cs.getPropertyValue('--gold2').trim() || '#f4dc94',
    petal: cs.getPropertyValue('--petal').trim() || '#d98a8a',
  };
}

export async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* fall through */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch (e) {
    return false;
  }
}

export function monogram(bride, groom) {
  const b = (bride || 'A').trim()[0] || 'A';
  const g = (groom || 'V').trim()[0] || 'V';
  return (b + '&' + g).toUpperCase();
}
