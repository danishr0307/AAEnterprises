import { useEffect, useRef, useState } from "react";

/** Hidden SVG sprite: corner ornament, divider and icons (referenced with <use>). */
export function SvgDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <symbol id="corner" viewBox="0 0 48 48">
          <g fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M2 46V12Q2 2 12 2H46" />
            <path d="M8 46V16Q8 8 16 8H46" opacity=".5" />
            <circle cx="15" cy="15" r="2.4" fill="currentColor" stroke="none" />
            <path d="M22 15Q30 8 38 15" opacity=".7" />
            <path d="M15 22Q8 30 15 38" opacity=".7" />
          </g>
        </symbol>
        <symbol id="divider" viewBox="0 0 150 28">
          <g fill="none" stroke="currentColor" strokeWidth="1.1">
            <path d="M0 14H54M96 14H150" opacity=".7" />
            <path d="M75 4C69 9 69 17 75 24C81 17 81 9 75 4Z" />
            <path
              d="M75 24C66 22 60 16 58 10C65 10 71 14 75 24Z"
              opacity=".8"
            />
            <path
              d="M75 24C84 22 90 16 92 10C85 10 79 14 75 24Z"
              opacity=".8"
            />
            <circle cx="50" cy="14" r="1.8" fill="currentColor" />
            <circle cx="100" cy="14" r="1.8" fill="currentColor" />
          </g>
        </symbol>
        <symbol id="i-leaf" viewBox="0 0 24 24">
          <path d="M5 19C5 10 10 5 20 4C19 14 14 19 5 19ZM5 19L13 11" />
        </symbol>
        <symbol id="i-note" viewBox="0 0 24 24">
          <path d="M9 18V5L19 3V16" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
        </symbol>
        <symbol id="i-rings" viewBox="0 0 24 24">
          <circle cx="9" cy="14" r="5.5" />
          <circle cx="15" cy="14" r="5.5" />
          <path d="M9 4L11 6.5L9 8L7 6.5Z" />
        </symbol>
        <symbol id="i-star" viewBox="0 0 24 24">
          <path d="M12 3L14.4 9.2L21 9.8L16 14.2L17.6 20.8L12 17.3L6.4 20.8L8 14.2L3 9.8L9.6 9.2Z" />
        </symbol>
        <symbol id="i-heart" viewBox="0 0 24 24">
          <path d="M12 20S4 15 4 9.5C4 6.5 6.4 5 8.4 5C10 5 11.3 5.9 12 7.2C12.7 5.9 14 5 15.6 5C17.6 5 20 6.5 20 9.5C20 15 12 20 12 20Z" />
        </symbol>
        <symbol id="i-chai" viewBox="0 0 24 24">
          <path d="M5 9H17V14C17 17 15 19 11 19C7 19 5 17 5 14ZM17 10H19C20.5 10 20.5 14 18.5 14H17M8 3C8 5 10 5 10 7M12 3C12 5 14 5 14 7" />
        </symbol>
        <symbol id="i-umb" viewBox="0 0 24 24">
          <path d="M3 12C3 7 7 4 12 4C17 4 21 7 21 12ZM12 12V18C12 20 9.5 20 9.5 18" />
        </symbol>
        <symbol id="i-chev" viewBox="0 0 24 24">
          <path d="M9 5L16 12L9 19" />
        </symbol>
      </defs>
    </svg>
  );
}

export const Icon = ({ id, className = "" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <use href={`#${id}`} />
  </svg>
);

/** Reveal-on-scroll wrapper (IntersectionObserver). */
export function Rv({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`rv ${on ? "in" : ""} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

const CORNERS = [
  "top-2 left-2",
  "top-2 right-2 -scale-x-100",
  "bottom-2 left-2 -scale-y-100",
  "bottom-2 right-2 -scale-100",
];
export const Corners = () => (
  <>
    {CORNERS.map((p, i) => (
      <svg
        key={i}
        aria-hidden="true"
        className={`absolute w-[34px] h-[34px] text-gold pointer-events-none ${p}`}
      >
        <use href="#corner" />
      </svg>
    ))}
  </>
);

/** A card with gold corner ornaments that fades in on scroll. */
export function OrnCard({ className = "", children, ...rest }) {
  return (
    <Rv className={`card ${className}`} {...rest}>
      {children}
      <Corners />
    </Rv>
  );
}

export const Divider = ({ className = "" }) => (
  <Rv
    as="svg"
    aria-hidden="true"
    className={`block w-[150px] h-7 mx-auto mt-3.5 text-gold ${className}`}
  >
    <use href="#divider" />
  </Rv>
);

export function SectionHead({ eyebrow, title }) {
  return (
    <>
      <Rv className="eyebrow">{eyebrow}</Rv>
      <Rv as="h2" className="h2t">
        {title}
      </Rv>
      <Divider />
    </>
  );
}

/** Pill-style radio / checkbox. */
export function Pill({ type = "checkbox", children, ...input }) {
  return (
    <label className="relative">
      <input
        type={type}
        className="peer absolute inset-0 opacity-0 cursor-pointer"
        {...input}
      />
      <span
        className="block px-4 py-[9px] border border-line rounded-full text-[.88rem] tracking-[.02em] normal-case text-ink transition
        peer-checked:bg-gold peer-checked:border-gold peer-checked:text-onacc
        peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold"
      >
        {children}
      </span>
    </label>
  );
}

export function Toast({ msg, show }) {
  return (
    <div
      role="status"
      className={`fixed z-[300] left-1/2 bottom-[calc(env(safe-area-inset-bottom,0px)+22px)] bg-ink text-bg px-5 py-2.5 rounded-full text-[.88rem] pointer-events-none transition-all duration-[350ms] ${
        show
          ? "opacity-100 [translate:-50%_0]"
          : "opacity-0 [translate:-50%_20px]"
      }`}
    >
      {msg}
    </div>
  );
}
