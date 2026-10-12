import { useEffect, useRef, useState } from "react";
import { reduceMotion } from "../lib/utils";
import { Rv, SectionHead } from "./ui";

/* ---- built-in illustrated slides (used until guests add real photos) ---- */
const Bg = () => (
  <>
    <rect width="400" height="500" fill="var(--surface)" />
    <circle cx="200" cy="240" r="176" fill="var(--bg2)" />
    <circle
      cx="200"
      cy="240"
      r="176"
      fill="none"
      stroke="var(--gold)"
      strokeOpacity=".35"
    />
  </>
);
const Petals = ({ cx, cy, n, len, wid, rot0 }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const a = rot0 + i * (180 / (n - 1 || 1));
      return (
        <path
          key={i}
          transform={`translate(${cx} ${cy}) rotate(${a})`}
          d={`M0 0C${wid} -${len * 0.35} ${wid} -${len * 0.8} 0 -${len}C-${wid} -${len * 0.8} -${wid} -${len * 0.35} 0 0Z`}
        />
      );
    })}
  </>
);

const SCENES = [
  // rings
  () => (
    <>
      <Bg />
      <g fill="none" stroke="currentColor" strokeWidth="5">
        <circle cx="165" cy="270" r="62" />
        <circle cx="235" cy="270" r="62" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M200 140L220 168L200 196L180 168Z" />
        <path d="M200 140V104M178 118L200 100L222 118" opacity=".7" />
      </g>
      <g stroke="var(--gold)" strokeOpacity=".5" strokeWidth="1.5">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i * Math.PI) / 4;
          return (
            <line
              key={i}
              x1={(200 + Math.cos(a) * 120).toFixed(1)}
              y1={(270 + Math.sin(a) * 120).toFixed(1)}
              x2={(200 + Math.cos(a) * 150).toFixed(1)}
              y2={(270 + Math.sin(a) * 150).toFixed(1)}
            />
          );
        })}
      </g>
    </>
  ),
  // lotus
  () => (
    <>
      <Bg />
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <Petals cx={200} cy={350} n={7} len={190} wid={40} rot0={-90} />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="2" opacity=".6">
        <Petals cx={200} cy={350} n={5} len={130} wid={28} rot0={-72} />
      </g>
      <circle cx="200" cy="350" r="9" fill="currentColor" />
    </>
  ),
  // diya
  () => (
    <>
      <Bg />
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M110 330C120 390 280 390 290 330Z" />
        <path d="M100 330H300" />
        <path d="M165 392H235" />
      </g>
      <g className="animate-flick [transform-origin:50%_100%] [transform-box:fill-box]">
        <path
          d="M200 308C170 276 186 238 200 206C214 238 230 276 200 308Z"
          fill="var(--gold2)"
          stroke="var(--gold)"
          strokeWidth="2"
        />
        <path
          d="M200 300C188 280 195 262 200 248C206 262 212 280 200 300Z"
          fill="var(--surface)"
          opacity=".8"
        />
      </g>
      <g fill="var(--gold)" opacity=".5">
        <circle cx="110" cy="200" r="3" />
        <circle cx="300" cy="170" r="2.5" />
        <circle cx="270" cy="230" r="2" />
        <circle cx="130" cy="150" r="2" />
      </g>
    </>
  ),
  // mandap
  () => (
    <>
      <Bg />
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <path d="M110 400V240M290 400V240M90 400H310" />
        <path d="M110 240Q110 140 200 140Q290 140 290 240" />
        <path d="M130 240Q130 164 200 164Q270 164 270 240" opacity=".55" />
        <path d="M200 140V110M190 112H210" />
        <circle cx="200" cy="100" r="8" />
        <path d="M110 240H290" />
      </g>
      <g fill="var(--gold)">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <circle
            key={i}
            cx={122 + i * 19.5}
            cy={246 + Math.sin(i * 1.3) * 3}
            r="5"
            opacity=".75"
          />
        ))}
      </g>
    </>
  ),
  // arches
  () => (
    <>
      <Bg />
      <g fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M120 420V250Q120 150 200 150Q280 150 280 250V420Z" />
        <path
          d="M148 420V260Q148 184 200 184Q252 184 252 260V420Z"
          opacity=".65"
        />
        <path
          d="M174 420V272Q174 214 200 214Q226 214 226 272V420Z"
          opacity=".4"
        />
      </g>
      <path
        d="M200 108L208 130L232 130L212 144L220 166L200 152L180 166L188 144L168 130L192 130Z"
        fill="var(--gold)"
      />
    </>
  ),
];

export default function Gallery({ tr, hidden }) {
  const [photos, setPhotos] = useState([]);
  const [cur, setCur] = useState(0);
  const [bump, setBump] = useState(0); // changes on manual navigation -> autoplay timer restarts
  const x0 = useRef(null);
  const n = photos.length || SCENES.length;

  const go = (i) => {
    setCur(((i % n) + n) % n);
    setBump((b) => b + 1);
  };
  const step = (d) => {
    setCur((c) => (c + d + n) % n);
    setBump((b) => b + 1);
  };

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => {
      if (!document.hidden) setCur((c) => (c + 1) % n);
    }, 4600);
    return () => clearInterval(t);
  }, [n, bump]);

  useEffect(
    () => () => photos.forEach((u) => URL.revokeObjectURL(u)),
    [photos],
  );

  const onFiles = (e) => {
    const fs = Array.from(e.target.files || []).slice(0, 12);
    if (!fs.length) return;
    setPhotos(fs.map((f) => URL.createObjectURL(f)));
    setCur(0);
    setBump((b) => b + 1);
    e.target.value = "";
  };

  return (
    <section className="sec" id="gallery" hidden={hidden}>
      <SectionHead eyebrow={tr("gal")} title={tr("galh")} />

      <Rv
        aria-roledescription="carousel"
        aria-label="Photo slideshow"
        className="relative w-[min(420px,88vw)] aspect-[4/5] mt-[34px] mx-auto rounded-[9px_9px_4px_4px] border border-gold p-[9px]"
      >
        <div
          className="absolute inset-[9px] rounded-[9px_9px_8px_8px] overflow-hidden bg-surface touch-pan-y"
          onPointerDown={(e) => {
            x0.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (x0.current == null) return;
            const dx = e.clientX - x0.current;
            x0.current = null;
            if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
          }}
          onPointerCancel={() => {
            x0.current = null;
          }}
        >
          {Array.from({ length: n }, (_, i) => (
            <div
              key={i}
              role="group"
              aria-label={`${i + 1} / ${n}`}
              className={`absolute inset-0 transition-opacity duration-[1100ms] ease-linear ${cur === i ? "opacity-100" : "opacity-0"}`}
            >
              {photos.length ? (
                <img
                  src={photos[i]}
                  alt=""
                  className={`w-full h-full object-cover block ${cur === i ? "animate-kb" : "scale-[1.14]"}`}
                />
              ) : (
                <svg
                  viewBox="0 0 400 500"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                  className="w-full h-full block text-gold"
                >
                  {SCENES[i]()}
                </svg>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous"
          onClick={() => step(-1)}
          className="absolute top-1/2 -left-2 z-[3] w-10 h-10 rounded-full border border-line bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] cursor-pointer grid place-items-center [translate:0_-50%]"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 fill-none stroke-gold [stroke-width:2] -scale-x-100"
          >
            <use href="#i-chev" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => step(1)}
          className="absolute top-1/2 -right-2 z-[3] w-10 h-10 rounded-full border border-line bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] cursor-pointer grid place-items-center [translate:0_-50%]"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 fill-none stroke-gold [stroke-width:2]"
          >
            <use href="#i-chev" />
          </svg>
        </button>
      </Rv>

      <div className="flex justify-center gap-2 mt-[18px]">
        {Array.from({ length: n }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            aria-current={cur === i}
            onClick={() => go(i)}
            className={`h-[9px] rounded-full border border-gold p-0 cursor-pointer transition-[width] duration-300 ${
              cur === i ? "w-[26px] bg-gold" : "w-[9px] bg-transparent"
            }`}
          />
        ))}
      </div>

      <label className="btn ghost mt-5" htmlFor="photos">
        {tr("upload")}
      </label>
      <input
        id="photos"
        type="file"
        accept="image/*"
        multiple
        onChange={onFiles}
        className="sr-only"
      />
    </section>
  );
}
