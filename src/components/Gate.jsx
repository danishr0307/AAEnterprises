// The opening "grand doors" / "curtains" overlay with the wax-seal button.
const DoorArt = ({ right }) => (
  <svg
    viewBox="0 0 200 400"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    className={`absolute inset-0 w-full h-full text-gold2 opacity-90 ${right ? "-scale-x-100" : ""}`}
  >
    <rect x="14" y="14" width="172" height="372" rx="2" />
    <rect x="24" y="24" width="152" height="352" rx="2" opacity=".5" />
    <path
      d="M44 330V150Q44 70 120 70Q196 70 196 150V330Z"
      transform="translate(-20 0)"
    />
    <path
      d="M60 330V154Q60 86 120 86Q180 86 180 154V330Z"
      opacity=".5"
      transform="translate(-20 0)"
    />
    <g transform="translate(100 215)">
      <path d="M0 0C-8 -16 -8 -34 0 -50C8 -34 8 -16 0 0Z" />
      <path d="M0 0C-18 -6 -30 -20 -32 -34C-18 -32 -6 -20 0 0Z" />
      <path d="M0 0C18 -6 30 -20 32 -34C18 -32 6 -20 0 0Z" />
      <path d="M0 0C-22 6 -40 4 -52 -8C-38 -16 -16 -12 0 0Z" opacity=".7" />
      <path d="M0 0C22 6 40 4 52 -8C38 -16 16 -12 0 0Z" opacity=".7" />
    </g>
    <g opacity=".6">
      <circle cx="100" cy="60" r="4" />
      <circle cx="60" cy="350" r="3" />
      <circle cx="140" cy="350" r="3" />
    </g>
  </svg>
);

export default function Gate({
  phase,
  curtain,
  bride,
  groom,
  mono,
  tr,
  onOpen,
}) {
  const open = phase !== "closed";
  const gone = phase === "gone";

  const doorBase =
    "absolute top-0 bottom-0 w-[50.4%] transition-transform ease-[cubic-bezier(.68,0,.22,1)] [backface-visibility:hidden] shadow-[inset_0_0_90px_rgba(0,0,0,.45)]";
  const doorSkin = curtain
    ? "duration-[2400ms] bg-[repeating-linear-gradient(90deg,var(--door2)_0_18px,var(--door1)_18px_44px,var(--door2)_44px_62px)]"
    : "duration-[2100ms] bg-[linear-gradient(90deg,var(--door2),var(--door1)_55%,var(--door2))] after:content-[''] after:absolute after:top-1/2 after:w-3.5 after:h-14 after:rounded-lg after:bg-[linear-gradient(var(--gold2),var(--gold))] after:shadow-[0_0_14px_var(--glow)] after:-translate-y-1/2";
  const leftT = !open
    ? ""
    : curtain
      ? "[transform:translateX(-104%)_scaleX(.55)]"
      : "[transform:rotateY(-112deg)]";
  const rightT = !open
    ? ""
    : curtain
      ? "[transform:translateX(104%)_scaleX(.55)]"
      : "[transform:rotateY(112deg)]";

  return (
    <div
      aria-label="Invitation opening"
      className={`fixed inset-0 z-[100] overflow-hidden [perspective:1800px] bg-[radial-gradient(circle_at_50%_50%,var(--gold2),var(--gold)_38%,var(--door2)_90%)] ${
        gone
          ? "opacity-0 invisible transition-[opacity,visibility] duration-[900ms]"
          : ""
      } ${
        curtain
          ? "before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-[46px] before:z-[3] before:bg-[linear-gradient(var(--gold),var(--gold2))] before:shadow-[0_6px_22px_rgba(0,0,0,.4)]"
          : ""
      }`}
    >
      <div
        className={`${doorBase} ${doorSkin} left-0 origin-left after:right-3.5 ${leftT}`}
      >
        {!curtain && <DoorArt />}
      </div>
      <div
        className={`${doorBase} ${doorSkin} right-0 origin-right after:left-3.5 ${rightT}`}
      >
        {!curtain && <DoorArt right />}
      </div>

      <div
        className={`absolute inset-0 z-[4] grid place-content-center justify-items-center gap-3.5 text-center p-6 [transition:opacity_.6s,transform_.8s] ${
          open ? "opacity-0 scale-125 pointer-events-none" : ""
        }`}
      >
        <small className="text-[.74rem] tracking-[.42em] uppercase text-gold2">
          {tr("invited")}
        </small>
        <div className="font-script text-[length:clamp(2.2rem,9vw,3.4rem)] text-[#fff6dc] leading-[1.1] [text-shadow:0_2px_18px_rgba(0,0,0,.5)]">
          {bride} &amp; {groom}
        </div>
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open the invitation"
          className="relative w-[118px] h-[118px] rounded-full border-0 cursor-pointer text-onacc bg-[radial-gradient(circle_at_34%_28%,var(--gold2),var(--gold)_62%,var(--door2))] shadow-[0_10px_34px_rgba(0,0,0,.5),inset_0_0_0_4px_rgba(255,255,255,.25)] font-display text-[1.9rem] font-semibold tracking-[.04em]
            before:content-[''] before:absolute before:-inset-2 before:rounded-full before:border before:border-gold2 before:animate-sealping
            after:content-[''] after:absolute after:-inset-2 after:rounded-full after:border after:border-gold2 after:animate-sealping after:[animation-delay:1.2s]"
        >
          {mono}
        </button>
        <div className="text-[.8rem] tracking-[.3em] uppercase text-[#fff6dc] animate-breathe">
          {tr("open")}
        </div>
      </div>
    </div>
  );
}
