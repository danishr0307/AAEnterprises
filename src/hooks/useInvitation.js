import { useCallback, useEffect, useState } from 'react';
import { clone } from '../lib/utils';

export const DEF = {
  bride: 'Aarohi',
  groom: 'Vihaan',
  msg: 'Together with their families',
  date: '2027-02-21T19:30',
  venue: 'The Grand Meridian Gardens',
  addr: 'Juhu Tara Road, Juhu, Mumbai, Maharashtra 400049',
  // phone: '919800000000',
  skin: 'ivory',
  open: 'doors',
  lang: 'en',
  music: true,
  sections: { countdown: true, story: true, events: true, venue: true, gallery: true, rsvp: true, wishes: true },
};

function load() {
  const state = clone(DEF);
  try {
    const sv = JSON.parse(localStorage.getItem('inv-v1') || 'null');
    if (sv) {
      for (const k in sv) {
        if (k === 'sections') Object.assign(state.sections, sv.sections);
        else state[k] = sv[k];
      }
    }
  } catch (e) { /* ignore */ }
  return state;
}

export function useInvitation() {
  const [state, setState] = useState(load);

  useEffect(() => {
    try { localStorage.setItem('inv-v1', JSON.stringify(state)); } catch (e) { /* ignore */ }
  }, [state]);

  const update = useCallback((patch) => setState((s) => ({ ...s, ...patch })), []);
  const setSection = useCallback(
    (k, v) => setState((s) => ({ ...s, sections: { ...s.sections, [k]: v } })),
    []
  );
  const reset = useCallback(() => setState(clone(DEF)), []);

  return { state, update, setSection, reset };
}
