import { useCallback, useEffect, useRef, useState } from "react";
import { at, fmt } from "../lib/date";
import { readColors } from "../lib/utils";
import { Corners, Rv, SectionHead } from "./ui";

/** Gold foil canvas the guest scratches off with finger / mouse. */
function ScratchCard({ day, month, week, label, skin, revealed, onReveal }) {
  const cv = useRef(null);
  const st = useRef({
    down: false,
    last: null,
    moves: 0,
    W: 0,
    H: 0,
    D: 1,
    done: false,
  });

  const paint = useCallback(() => {
    const c = cv.current;
    if (!c) return;
    const box = c.parentElement.getBoundingClientRect();
    if (!box.width) return;
    const D = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.round(box.width * D),
      H = Math.round(box.height * D);
    Object.assign(st.current, { W, H, D });
    c.width = W;
    c.height = H;
    if (revealed) return;
    const col = readColors();
    const sx = c.getContext("2d");
    sx.globalCompositeOperation = "source-over";
    const g = sx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, col.gold);
    g.addColorStop(0.35, col.gold2);
    g.addColorStop(0.6, col.gold);
    g.addColorStop(1, col.gold2);
    sx.fillStyle = g;
    sx.fillRect(0, 0, W, H);
    for (let i = 0; i < 900; i++) {
      sx.fillStyle = "rgba(255,255,255," + Math.random() * 0.35 + ")";
      sx.fillRect(
        Math.random() * W,
        Math.random() * H,
        D * (1 + Math.random() * 2),
        D * (1 + Math.random() * 2),
      );
    }
    sx.strokeStyle = "rgba(255,255,255,.55)";
    sx.lineWidth = D * 1.5;
    sx.strokeRect(D * 12, D * 12, W - D * 24, H - D * 24);
    sx.fillStyle = "rgba(60,40,10,.78)";
    sx.textAlign = "center";
    sx.textBaseline = "middle";
    sx.font = "600 " + Math.round(D * 22) + "px Jost, sans-serif";
    try {
      sx.letterSpacing = D * 6 + "px";
    } catch (e) {
      /* older browsers */
    }
    sx.fillText((label || "").toUpperCase(), W / 2, H / 2);
  }, [revealed, label]);

  // repaint when skin / language / text changes, on resize, and after fonts load
  useEffect(() => {
    paint();
  }, [paint, skin, day, month, week]);
  useEffect(() => {
    const onResize = () => paint();
    window.addEventListener("resize", onResize);
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(paint);
    return () => window.removeEventListener("resize", onResize);
  }, [paint]);

  const doReveal = () => {
    const s = st.current;
    if (s.done || revealed) return;
    s.done = true;
    const r = cv.current.parentElement.getBoundingClientRect();
    onReveal(r.left + r.width / 2, r.top + r.height / 2);
  };
  const check = () => {
    const s = st.current;
    try {
      const d = cv.current.getContext("2d").getImageData(0, 0, s.W, s.H).data;
      let clear = 0,
        tot = 0;
      for (let i = 3; i < d.length; i += 64) {
        tot++;
        if (d[i] < 40) clear++;
      }
      if (clear / tot > 0.5) doReveal();
    } catch (e) {
      /* ignore */
    }
  };
  const pos = (e) => {
    const r = cv.current.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * st.current.D,
      y: (e.clientY - r.top) * st.current.D,
    };
  };
  const scrub = (e) => {
    const s = st.current;
    if (!s.down || revealed) return;
    const sx = cv.current.getContext("2d");
    const p = pos(e),
      a = s.last || p;
    sx.globalCompositeOperation = "destination-out";
    sx.lineCap = "round";
    sx.lineJoin = "round";
    sx.lineWidth = 46 * s.D;
    sx.beginPath();
    sx.moveTo(a.x, a.y);
    sx.lineTo(p.x, p.y);
    sx.stroke();
    s.last = p;
    if (++s.moves % 8 === 0) check();
  };
  const end = () => {
    st.current.down = false;
    st.current.last = null;
    check();
  };

  return (
    <>
      <div className="font-display text-[length:clamp(4.6rem,22vw,7rem)] leading-[.95] font-medium text-gold">
        {day}
      </div>
      <div className="font-display text-[1.8rem] tracking-[.14em] uppercase">
        {month}
      </div>
      <div className="text-muted tracking-[.2em] uppercase text-[.8rem] mt-1.5">
        {week}
      </div>
      <canvas
        ref={cv}
        aria-label="Scratch card"
        onPointerDown={(e) => {
          st.current.down = true;
          st.current.last = null;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch (_) {
            /* ignore */
          }
          scrub(e);
        }}
        onPointerMove={scrub}
        onPointerUp={end}
        onPointerCancel={end}
        className={`absolute inset-0 w-full h-full touch-none cursor-crosshair transition-opacity duration-[900ms] ${
          revealed ? "opacity-0 pointer-events-none" : ""
        }`}
      />
    </>
  );
}

export default function SaveDate({ state, tr, burst }) {
  const [revealed, setRevealed] = useState(false);
  const d0 = at(state.date, 0);
  const L = state.lang;
  const reveal = (x, y) => {
    setRevealed(true);
    burst(x, y, 110);
  };

  return (
    <section className="sec" id="date">
      <SectionHead eyebrow={tr("savedate")} title={tr("scratch")} />
      <Rv
        id="scratch-card"
        className="relative max-w-[460px] mx-auto mt-[30px] px-5 py-[34px] rounded-md bg-surface border border-gold shadow-[0_20px_50px_-24px_var(--glow)] overflow-hidden select-none"
      >
        <ScratchCard
          day={fmt(L, d0, { day: "numeric" })}
          month={fmt(L, d0, { month: "long" })}
          week={`${fmt(L, d0, { weekday: "long" })} · ${fmt(L, d0, { year: "numeric" })} · ${fmt(L, d0, { hour: "numeric", minute: "2-digit" })}`}
          label={tr("scratch")}
          skin={state.skin}
          revealed={revealed}
          onReveal={reveal}
        />
        <Corners />
      </Rv>
      {!revealed && (
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("scratch-card");
            const r = el
              ? el.getBoundingClientRect()
              : { left: 0, top: 0, width: innerWidth, height: innerHeight };
            setRevealed(true);
            burst(r.left + r.width / 2, r.top + r.height / 2, 110);
          }}
          className="bg-transparent border-0 text-muted underline cursor-pointer text-[.82rem] mt-3.5"
        >
          {tr("showdate")}
        </button>
      )}
    </section>
  );
}
