import { copyText } from "../lib/utils";
import { OrnCard, Rv, SectionHead } from "./ui";

const SWATCHES = ["#c9a24a", "#f3e6c8", "#0f6b55", "#9b2b4a", "#2b4a9b"];

function MapArt() {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      className="absolute inset-0 w-full h-full"
    >
      <rect width="400" height="300" fill="var(--bg2)" />
      <path
        d="M-10 230C80 200 120 250 210 220S340 150 420 170V320H-10Z"
        fill="var(--gold)"
        opacity=".16"
      />
      <g stroke="var(--line)" strokeWidth="10" strokeLinecap="round">
        <path d="M-10 90H410" />
        <path d="M130 -10V310" />
        <path d="M290 -10C270 80 320 160 300 310" />
        <path d="M-10 170L410 40" strokeWidth="6" />
      </g>
      <g
        stroke="var(--surface)"
        strokeWidth="3"
        strokeDasharray="8 10"
        opacity=".8"
      >
        <path d="M-10 90H410" />
        <path d="M130 -10V310" />
      </g>
      <g fill="var(--surface)" opacity=".9">
        <rect x="150" y="105" width="44" height="30" rx="3" />
        <rect x="40" y="110" width="58" height="36" rx="3" />
        <rect x="320" y="110" width="50" height="40" rx="3" />
        <rect x="40" y="20" width="60" height="44" rx="3" />
        <rect x="160" y="20" width="90" height="46" rx="3" />
      </g>
      <g transform="translate(205 150)">
        <circle
          r="16"
          stroke="var(--gold)"
          strokeWidth="2"
          className="animate-ringp [transform-origin:center] [transform-box:fill-box]"
        />
        <circle
          r="16"
          stroke="var(--gold)"
          strokeWidth="2"
          className="animate-ringp [transform-origin:center] [transform-box:fill-box] [animation-delay:1.3s]"
        />
        <path
          d="M0 -4C-18 -4 -26 -18 -26 -30C-26 -46 -14 -58 0 -58C14 -58 26 -46 26 -30C26 -18 18 -4 0 22C0 22 0 -4 0 -4Z"
          fill="var(--gold)"
          transform="translate(0 -4) scale(.95)"
        />
        <circle cy="-36" r="9" fill="var(--surface)" />
      </g>
    </svg>
  );
}

export default function Venue({ state, tr, hidden, toast }) {
  const mapHref =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(`${state.venue}, ${state.addr}`);
  const copy = () =>
    copyText(`${state.venue}, ${state.addr}`).then(
      (ok) => ok && toast(tr("copied")),
    );

  return (
    <section className="sec" id="venue" hidden={hidden}>
      <SectionHead eyebrow={tr("venue")} title={tr("venueh")} />

      <OrnCard className="mt-[34px] text-left overflow-hidden !p-0 grid grid-cols-1 min-[721px]:grid-cols-2">
        <div
          className="relative bg-bg2 min-h-[220px] min-[721px]:min-h-[280px]"
          aria-hidden="true"
        >
          <MapArt />
        </div>
        <div className="px-5 py-[26px] min-[721px]:px-7 min-[721px]:py-[34px] flex flex-col justify-center gap-2.5 min-w-0">
          <div className="eyebrow">{tr("venue")}</div>
          <h3 className="font-display font-medium text-[1.9rem] m-0">
            {state.venue}
          </h3>
          <p className="text-muted m-0">{state.addr}</p>
          <div className="flex flex-wrap gap-2.5 mt-2">
            <a
              className="btn"
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tr("maps")}
            </a>
            <button className="btn ghost" type="button" onClick={copy}>
              {tr("copyaddr")}
            </button>
          </div>
        </div>
      </OrnCard>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[18px] mt-[18px]">
        <OrnCard className="text-left">
          <h3 className="font-display font-medium text-[1.55rem] mt-[.5em] mb-[.2em]">
            {tr("dress")}
          </h3>
          <p className="text-muted m-0">{tr("dresstxt")}</p>
          <div className="flex gap-2 mt-3.5" aria-hidden="true">
            {SWATCHES.map((c) => (
              <i
                key={c}
                className="w-[30px] h-[30px] rounded-full border border-line"
                style={{ background: c }}
              />
            ))}
          </div>
        </OrnCard>
        <OrnCard className="text-left">
          <h3 className="font-display font-medium text-[1.55rem] mt-[.5em] mb-[.2em]">
            {tr("travel")}
          </h3>
          <p className="text-muted m-0">{tr("traveltxt")}</p>
        </OrnCard>
      </div>
    </section>
  );
}
