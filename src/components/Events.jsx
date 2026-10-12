import { EVENTS, at, fmt, icsStamp } from '../lib/date';
import { T } from '../lib/i18n';
import { Icon, OrnCard, SectionHead } from './ui';

export default function Events({ state, tr, hidden }) {
  const L = state.lang;
  return (
    <section className="sec" id="events" hidden={hidden}>
      <SectionHead eyebrow={tr('evs')} title={tr('evsh')} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px] mt-[34px]">
        {EVENTS.map((ev) => {
          const d = at(state.date, ev.off, ev.h, ev.m);
          const end = new Date(d.getTime() + 3 * 3600 * 1000);
          const cal =
            'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
            encodeURIComponent(`${state.bride} & ${state.groom} · ${T.en[ev.k]}`) +
            `&dates=${icsStamp(d)}/${icsStamp(end)}&ctz=Asia/Kolkata&location=` +
            encodeURIComponent(`${state.venue}, ${state.addr}`);
          return (
            <OrnCard
              key={ev.k}
              className={`group !px-5 !pt-[30px] !pb-6 flex flex-col items-center gap-1 transition-[transform,box-shadow] duration-[350ms] hover:-translate-y-1.5 ${
                ev.main
                  ? 'border-gold shadow-[0_0_0_4px_color-mix(in_srgb,var(--gold)_14%,transparent)]'
                  : 'hover:shadow-[0_22px_40px_-26px_var(--glow)]'
              }`}
            >
              {ev.main && (
                <span className="absolute -top-[11px] bg-gold text-onacc text-[.62rem] tracking-[.24em] uppercase px-3 py-0.5 rounded-full">
                  {tr('main')}
                </span>
              )}
              <div className="w-[54px] h-[54px] rounded-full grid place-items-center border border-gold text-gold transition group-hover:bg-gold group-hover:text-onacc">
                <Icon id={ev.ic} className="w-[26px] h-[26px] fill-none stroke-current [stroke-width:1.5]" />
              </div>
              <h3 className="font-display font-medium text-[1.55rem] mt-[.5em] mb-[.2em]">{tr(ev.k)}</h3>
              <div className="font-display text-[1.15rem]">{fmt(L, d, { weekday: 'short', day: 'numeric', month: 'long' })}</div>
              <div className="text-muted text-[.9rem]">{fmt(L, d, { hour: 'numeric', minute: '2-digit' })}</div>
              <a className="btn ghost mt-3.5 !min-h-[38px] !px-[18px] !text-[.68rem]" href={cal} target="_blank" rel="noopener noreferrer">
                {tr('addcal')}
              </a>
            </OrnCard>
          );
        })}
      </div>
    </section>
  );
}
