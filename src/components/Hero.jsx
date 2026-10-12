import { at, fmt } from '../lib/date';

function Mandala() {
  const rings = [[60, 12], [92, 16], [124, 20], [156, 24], [188, 32]];
  return (
    <svg viewBox="-200 -200 400 400" fill="none" stroke="currentColor" strokeWidth=".8" className="w-full h-full animate-slowspin">
      {rings.map(([R, n], idx) => {
        const w = R * 0.22;
        return (
          <g key={R}>
            {Array.from({ length: n }, (_, i) => {
              const a = (i * 360) / n + (idx % 2 ? 180 / n : 0);
              return (
                <path
                  key={i}
                  transform={`rotate(${a.toFixed(2)})`}
                  d={`M0 -${R} Q ${w} -${R * 1.12} 0 -${R * 1.3} Q -${w} -${R * 1.12} 0 -${R}Z`}
                />
              );
            })}
            <circle r={R} />
          </g>
        );
      })}
      <circle r="14" />
      <circle r="6" fill="currentColor" />
    </svg>
  );
}

export default function Hero({ state, tr, live, mandRef, mono }) {
  const d0 = at(state.date, 0);
  const L = state.lang;
  const heroDate =
    fmt(L, d0, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
    ' · ' +
    fmt(L, d0, { hour: 'numeric', minute: '2-digit' });
  const opening = state.msg === 'Together with their families' ? tr('together') : state.msg;

  // staggered entrance once the doors have opened
  const ha = (d, cls = '') => ({
    className: `${cls} ${live ? 'animate-rise' : ''}`,
    style: { animationDelay: `${d}s` },
  });

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-[clamp(84px,14vw,130px)] pb-[clamp(56px,9vw,90px)] bg-[radial-gradient(ellipse_at_50%_0,var(--bg2),transparent_70%)]"
    >
      <div
        ref={mandRef}
        aria-hidden="true"
        className="absolute left-1/2 top-[44%] w-[min(980px,170vw)] aspect-square [translate:-50%_-50%] text-gold opacity-[.22] pointer-events-none will-change-transform"
      >
        <Mandala />
      </div>

      <div className="sec relative z-[2] !py-0">
        <div
          {...ha(0.1, 'w-[min(300px,76vw)] mx-auto mb-7 aspect-[3/4] rounded-[999px_999px_10px_10px] border border-gold p-2.5 relative')}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-[999px_999px_6px_6px] overflow-hidden relative bg-[linear-gradient(180deg,var(--door1),var(--door2)_62%,var(--bg2))] grid place-items-center text-gold2">
            <div className="absolute top-[18%] left-1/2 w-[46%] aspect-square [translate:-50%_0] rounded-full bg-[radial-gradient(circle,var(--gold2),transparent_68%)] animate-sunpulse" />
            <svg
              viewBox="0 0 300 160" fill="none" stroke="currentColor" strokeWidth="1.4"
              className="absolute -bottom-[4%] left-1/2 w-[128%] [translate:-50%_0] opacity-90"
            >
              <g transform="translate(150 150)">
                <path d="M0 0C-16 -30 -16 -80 0 -120C16 -80 16 -30 0 0Z" />
                <path d="M0 0C-40 -20 -62 -60 -60 -100C-30 -84 -8 -44 0 0Z" />
                <path d="M0 0C40 -20 62 -60 60 -100C30 -84 8 -44 0 0Z" />
                <path d="M0 0C-70 -6 -110 -36 -124 -72C-82 -70 -30 -42 0 0Z" opacity=".75" />
                <path d="M0 0C70 -6 110 -36 124 -72C82 -70 30 -42 0 0Z" opacity=".75" />
                <path d="M0 0C-90 10 -140 0 -160 -26C-110 -34 -44 -20 0 0Z" opacity=".5" />
                <path d="M0 0C90 10 140 0 160 -26C110 -34 44 -20 0 0Z" opacity=".5" />
              </g>
            </svg>
            <div className="relative font-display text-[length:clamp(2.6rem,12vw,3.6rem)] font-medium text-[#fff4d4] tracking-[.06em] [text-shadow:0_2px_14px_rgba(0,0,0,.4)] -mt-[18%]">
              {mono}
            </div>
          </div>
        </div>

        <div {...ha(0.45, 'eyebrow')}>{opening}</div>
        <h1 {...ha(0.65, 'font-script font-normal text-[length:clamp(3.3rem,15vw,6.6rem)] leading-[1.02] my-[.2em]')}>
          <span>{state.bride}</span>
          <span className="block font-display italic text-[.34em] text-gold my-[.15em]">&amp;</span>
          <span>{state.groom}</span>
        </h1>
        <p {...ha(0.9, 'm-0 text-muted')}>{tr('invite')}</p>
        <svg {...ha(1, 'block w-[150px] h-7 mx-auto mt-3.5 text-gold')} aria-hidden="true"><use href="#divider" /></svg>
        <div {...ha(1.1, 'font-display text-[length:clamp(1.25rem,4vw,1.7rem)] tracking-[.06em]')}>{heroDate}</div>
        <div {...ha(1.2, 'text-muted tracking-[.14em] uppercase text-[.78rem] mt-1.5')}>{state.venue}</div>
        <a
          {...ha(1.4, "block mx-auto mt-[34px] w-[26px] h-11 border-[1.5px] border-gold rounded-[14px] relative after:content-[''] after:absolute after:left-1/2 after:top-2 after:w-1 after:h-2 after:rounded-sm after:bg-gold after:[translate:-50%_0] after:animate-cue")}
          href="#date"
          aria-label="Scroll"
        />
      </div>
    </section>
  );
}
