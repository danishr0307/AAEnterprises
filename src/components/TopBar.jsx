const LANGS = [['en', 'EN'], ['hi', 'हिं'], ['mr', 'मरा']];

export default function TopBar({ lang, setLang, musicOn, onMusic, onCustomize }) {
  return (
    <div className="fixed z-[150] top-[calc(env(safe-area-inset-top,0px)+10px)] right-2 min-[520px]:right-3 flex gap-1.5 min-[520px]:gap-2 items-center">
      <div role="group" aria-label="Language" className="glass inline-flex border border-line rounded-full overflow-hidden">
        {LANGS.map(([k, label]) => (
          <button
            key={k}
            type="button"
            aria-pressed={lang === k}
            onClick={() => setLang(k)}
            className="border-0 bg-transparent h-9 px-[11px] text-[.78rem] tracking-[.04em] cursor-pointer aria-pressed:bg-gold aria-pressed:text-onacc"
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-pressed={musicOn}
        aria-label={musicOn ? 'Mute music' : 'Play music'}
        onClick={onMusic}
        className="glass inline-flex items-center gap-1.5 h-[38px] px-2.5 min-[520px]:px-3 rounded-full border border-line cursor-pointer text-[.8rem] tracking-[.06em] transition hover:-translate-y-px"
      >
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-gold fill-none [stroke-width:1.6]">
          {musicOn ? (
            <path d="M4 9V15H8L13 19V5L8 9ZM16 9C17.5 10.5 17.5 13.5 16 15M18.5 6.5C21.5 9.5 21.5 14.5 18.5 17.5" />
          ) : (
            <path d="M4 9V15H8L13 19V5L8 9ZM17 9L22 15M22 9L17 15" />
          )}
        </svg>
      </button>

      <button
        type="button"
        aria-label="Customize"
        onClick={onCustomize}
        className="glass inline-flex items-center gap-1.5 h-[38px] px-2.5 min-[520px]:px-3 rounded-full border border-line cursor-pointer text-[.8rem] tracking-[.06em] transition hover:-translate-y-px"
      >
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] stroke-gold fill-none [stroke-width:1.6]">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2V5M12 19V22M2 12H5M19 12H22M4.9 4.9L7 7M17 17L19.1 19.1M19.1 4.9L17 7M7 17L4.9 19.1" />
        </svg>
        <span className="hidden min-[520px]:inline">Customize</span>
      </button>
    </div>
  );
}
