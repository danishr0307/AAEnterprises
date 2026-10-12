// Wedding time is entered as IST wall-clock time. We keep it in UTC fields
// so that formatting never shifts with the visitor's own timezone.
export const LOC = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN' };

export function parts(date) {
  const m = (date || '').match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
  return m ? m.slice(1).map(Number) : [2027, 2, 21, 19, 30];
}

export function at(date, off, h, mi) {
  const p = parts(date);
  return new Date(Date.UTC(p[0], p[1] - 1, p[2] + off, h == null ? p[3] : h, mi == null ? p[4] : mi));
}

export function fmt(lang, d, o) {
  try {
    return new Intl.DateTimeFormat(LOC[lang] || 'en-IN', { timeZone: 'UTC', ...o }).format(d);
  } catch (e) {
    return '';
  }
}

export function targetMs(date) {
  const p = parts(date);
  return Date.UTC(p[0], p[1] - 1, p[2], p[3], p[4]) - 330 * 60000; // IST = UTC+5:30
}

export const icsStamp = (d) => d.toISOString().replace(/[-:]/g, '').slice(0, 15);

export const EVENTS = [
  { k: 'mehendi', off: -2, h: 16, m: 0, ic: 'i-leaf' },
  { k: 'sangeet', off: -1, h: 19, m: 0, ic: 'i-note' },
  { k: 'wedding', off: 0, ic: 'i-rings', main: true },
  { k: 'reception', off: 1, h: 20, m: 0, ic: 'i-star' },
];
