import { useEffect, useState } from 'react';
import { targetMs } from '../lib/date';
import { Rv } from './ui';

function Box({ value, label }) {
  return (
    <div className="border border-line bg-surface rounded-md pt-4 px-1 pb-3">
      {/* key changes every tick -> flip animation replays */}
      <b key={value} className="block font-display font-medium text-[length:clamp(2rem,9vw,3.4rem)] leading-none text-gold tabular-nums animate-flip">
        {value}
      </b>
      <span className="text-[.66rem] tracking-[.22em] uppercase text-muted">{label}</span>
    </div>
  );
}

export default function Countdown({ state, tr, hidden }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  let ms = targetMs(state.date) - now;
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);

  return (
    <section className="sec" id="count" hidden={hidden}>
      <Rv className="eyebrow">{tr('countdown')}</Rv>
      <Rv role="timer" aria-live="off" className="grid grid-cols-4 gap-2.5 max-w-[640px] mx-auto mt-[30px]">
        <Box value={Math.floor(s / 86400)} label={tr('days')} />
        <Box value={Math.floor((s % 86400) / 3600)} label={tr('hours')} />
        <Box value={Math.floor((s % 3600) / 60)} label={tr('mins')} />
        <Box value={s % 60} label={tr('secs')} />
      </Rv>
    </section>
  );
}
