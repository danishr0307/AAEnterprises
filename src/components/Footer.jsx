export default function Footer({ state, tr }) {
  const tag = `#${(state.bride || '').replace(/\s+/g, '')}Weds${(state.groom || '').replace(/\s+/g, '')}`;
  return (
    <footer className="pt-[70px] px-4 pb-[90px] text-center bg-gradient-to-b from-transparent to-bg2">
      <svg aria-hidden="true" className="block w-[150px] h-7 mx-auto mb-2.5 text-gold"><use href="#divider" /></svg>
      <div className="font-script text-[length:clamp(2.4rem,9vw,3.6rem)] text-gold">
        <span>{state.bride}</span> &amp; <span>{state.groom}</span>
      </div>
      <p className="text-muted my-1.5">{tr('foot')}</p>
      <p className="text-muted my-1.5 tracking-[.2em] text-[.8rem]">{tag}</p>
    </footer>
  );
}
