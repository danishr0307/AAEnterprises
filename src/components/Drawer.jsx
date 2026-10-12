import { useEffect, useRef } from 'react';
import { Pill } from './ui';

const SKINS = [
  ['ivory', 'Ivory Gold', 'linear-gradient(135deg,#7a1f30,#a97c22)'],
  ['emerald', 'Emerald', 'linear-gradient(135deg,#0f4a3a,#d9b45a)'],
  ['rose', 'Rose', 'linear-gradient(135deg,#c98b94,#f4dcdf)'],
  ['sapphire', 'Sapphire', 'linear-gradient(135deg,#1b2a6b,#d6b867)'],
];
const SECTIONS = [
  ['countdown', 'Countdown'], ['story', 'Our story'], ['events', 'Events'], ['venue', 'Venue, dress code, travel'],
  ['gallery', 'Photo slideshow'], ['rsvp', 'RSVP'], ['wishes', 'Wishes wall'],
];

export default function Drawer({ open, onClose, state, update, setSection, onMusicToggle, onReset, onReplay }) {
  const first = useRef(null);
  useEffect(() => {
    if (open) { const t = setTimeout(() => first.current && first.current.focus(), 300); return () => clearTimeout(t); }
  }, [open]);

  const field = (id, label, key, props = {}, Tag = 'input') => (
    <div>
      <label className="lab" htmlFor={id}>{label}</label>
      <Tag id={id} className="field" value={state[key]} onChange={(e) => update({ [key]: e.target.value })} {...props} />
    </div>
  );

  return (
    <aside
      aria-label="Customize invitation"
      aria-hidden={!open}
      className={`fixed z-[200] top-0 right-0 h-full w-[min(400px,100%)] bg-surface border-l border-line shadow-[-20px_0_60px_rgba(0,0,0,.35)] transition-[transform,visibility] duration-[450ms] ease-[cubic-bezier(.2,.8,.2,1)] overflow-y-auto pt-[calc(env(safe-area-inset-top,0px)+18px)] px-[18px] pb-[calc(env(safe-area-inset-bottom,0px)+28px)] ${
        open ? 'translate-x-0 visible' : 'translate-x-[105%] invisible'
      }`}
    >
      <button
        type="button" aria-label="Close" onClick={onClose}
        className="absolute top-[calc(env(safe-area-inset-top,0px)+14px)] right-3.5 w-[38px] h-[38px] rounded-full border border-line bg-transparent cursor-pointer text-[1.2rem]"
      >×</button>
      <h2 className="font-display font-medium text-[1.8rem] m-0">Make it yours</h2>
      <p className="hint">Sample names and venue are placeholders. Changes show instantly and stay in this browser.</p>

      <div className="grid gap-3.5 mt-4">
        <div>
          <span className="lab">Style</span>
          <div className="grid grid-cols-4 gap-2">
            {SKINS.map(([k, label, bg]) => (
              <button
                key={k} type="button" aria-pressed={state.skin === k} onClick={() => update({ skin: k })}
                className={`border-2 rounded-lg p-0 h-[58px] cursor-pointer overflow-hidden flex flex-col bg-transparent ${
                  state.skin === k ? 'border-gold shadow-[0_0_0_2px_color-mix(in_srgb,var(--gold)_30%,transparent)]' : 'border-line'
                }`}
              >
                <i className="flex-1" style={{ background: bg }} />
                <span className="text-[.62rem] tracking-[.06em] py-0.5 bg-surface text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="lab">Opening</span>
          <div className="flex flex-wrap gap-2">
            <Pill type="radio" name="open" value="doors" checked={state.open === 'doors'} onChange={() => update({ open: 'doors' })}>Grand doors</Pill>
            <Pill type="radio" name="open" value="curtain" checked={state.open === 'curtain'} onChange={() => update({ open: 'curtain' })}>Curtains</Pill>
          </div>
          <button className="btn ghost mt-3 !min-h-[38px]" type="button" onClick={onReplay}>Replay opening</button>
        </div>

        <div>
          <label className="lab" htmlFor="f-bride">First name</label>
          <input id="f-bride" ref={first} className="field" maxLength={24} value={state.bride} onChange={(e) => update({ bride: e.target.value })} />
        </div>
        {field('f-groom', 'Second name', 'groom', { type: 'text', maxLength: 24 })}
        {field('f-msg', 'Opening line', 'msg', { type: 'text', maxLength: 70 })}
        {field('f-date', 'Wedding date and time (IST)', 'date', { type: 'datetime-local' })}
        {field('f-venue', 'Venue name', 'venue', { type: 'text', maxLength: 60 })}
        {field('f-addr', 'Venue address', 'addr', { maxLength: 160, className: 'field min-h-[70px] resize-y' }, 'textarea')}
        {field('f-phone', 'WhatsApp for RSVPs (with country code)', 'phone', { type: 'tel', inputMode: 'numeric', placeholder: 'Enter phone number' })}

        <div>
          <span className="lab">Sections</span>
          <div className="grid gap-2">
            {SECTIONS.map(([k, label]) => (
              <label key={k} className="flex items-center gap-2.5 text-[.92rem] text-ink">
                <input type="checkbox" className="w-[18px] h-[18px] accent-gold" checked={state.sections[k] !== false} onChange={(e) => setSection(k, e.target.checked)} />
                {label}
              </label>
            ))}
            <label className="flex items-center gap-2.5 text-[.92rem] text-ink">
              <input type="checkbox" className="w-[18px] h-[18px] accent-gold" checked={!!state.music} onChange={(e) => onMusicToggle(e.target.checked)} />
              Background music
            </label>
          </div>
        </div>

        <button className="btn ghost" type="button" onClick={onReset}>Reset to sample</button>
      </div>
    </aside>
  );
}
