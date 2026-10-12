import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useInvitation } from './hooks/useInvitation';
import { useMusic } from './hooks/useMusic';
import { useToast } from './hooks/useToast';
import { makeT } from './lib/i18n';
import { monogram, reduceMotion } from './lib/utils';

import { SvgDefs, Toast } from './components/ui';
import Particles from './components/Particles';
import Gate from './components/Gate';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import SaveDate from './components/SaveDate';
import Countdown from './components/Countdown';
import Story from './components/Story';
import Events from './components/Events';
import Venue from './components/Venue';
import Gallery from './components/Gallery';
import Rsvp from './components/Rsvp';
import Wishes from './components/Wishes';
import Footer from './components/Footer';
import Drawer from './components/Drawer';

export default function App() {
  const { state, update, setSection, reset } = useInvitation();
  const tr = useMemo(() => makeT(state.lang), [state.lang]);
  const music = useMusic(state.music);
  const { toast, msg: toastMsg, show: toastShow } = useToast();

  const fx = useRef(null);
  const progRef = useRef(null);
  const mandRef = useRef(null);
  const gateTimer = useRef();

  // 'closed' -> doors shut | 'open' -> doors swinging | 'gone' -> invitation live
  const [phase, setPhase] = useState('closed');
  const [drawer, setDrawer] = useState(false);
  const live = phase === 'gone';

  const burst = useCallback((x, y, n) => fx.current && fx.current.burst(x, y, n), []);

  // skin + language live on <html> so CSS variables switch the whole theme.
  // (layout effect => runs before child effects that read the CSS colours)
  useLayoutEffect(() => {
    const r = document.documentElement;
    r.dataset.skin = state.skin;
    r.lang = state.lang;
  }, [state.skin, state.lang]);

  useEffect(() => {
    document.title = `${state.bride} & ${state.groom} Wedding`;
  }, [state.bride, state.groom]);

  // lock page scroll until the gate has opened
  useEffect(() => {
    document.body.classList.toggle('lock', phase !== 'gone');
    return () => document.body.classList.remove('lock');
  }, [phase]);

  useEffect(() => () => clearTimeout(gateTimer.current), []);

  // scroll progress bar + mandala parallax
  useEffect(() => {
    let tick = false;
    const run = () => {
      tick = false;
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progRef.current) progRef.current.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      if (!reduceMotion && mandRef.current) mandRef.current.style.transform = `translateY(${(y * 0.18).toFixed(1)}px)`;
    };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(run); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    run();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Esc closes the drawer
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setDrawer(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const openGate = () => {
    if (phase !== 'closed') return;
    setPhase('open');
    burst(window.innerWidth / 2, window.innerHeight / 2, 90);
    music.start();
    gateTimer.current = setTimeout(() => setPhase('gone'), reduceMotion ? 400 : 1900);
  };

  const replay = () => {
    clearTimeout(gateTimer.current);
    setDrawer(false);
    setPhase('closed');
    window.scrollTo(0, 0);
  };

  const toggleMusicBtn = () => {
    if (music.on) music.stop();
    else { update({ music: true }); music.start(true); }
  };

  const drawerMusic = (checked) => {
    update({ music: checked });
    if (!checked) music.stop();
  };

  const doReset = () => { reset(); toast('Reset'); };

  const mono = monogram(state.bride, state.groom);
  const show = (k) => state.sections[k] === false;

  return (
    <>
      <SvgDefs />
      <div
        ref={progRef}
        className="fixed z-[149] left-0 top-0 h-[3px] w-0 bg-gradient-to-r from-gold to-gold2 shadow-[0_0_12px_var(--glow)]"
      />

      <TopBar
        lang={state.lang}
        setLang={(lang) => update({ lang })}
        musicOn={music.on}
        onMusic={toggleMusicBtn}
        onCustomize={() => setDrawer(true)}
      />

      <Gate
        phase={phase}
        curtain={state.open === 'curtain'}
        bride={state.bride}
        groom={state.groom}
        mono={mono}
        tr={tr}
        onOpen={openGate}
      />
      <Particles ref={fx} skin={state.skin} />

      <main id="inv">
        <Hero state={state} tr={tr} live={live} mandRef={mandRef} mono={mono} />
        <SaveDate state={state} tr={tr} burst={burst} />
        <Countdown state={state} tr={tr} hidden={show('countdown')} />
        <Story tr={tr} hidden={show('story')} />
        <Events state={state} tr={tr} hidden={show('events')} />
        <Venue state={state} tr={tr} hidden={show('venue')} toast={toast} />
        <Gallery tr={tr} hidden={show('gallery')} />
        <Rsvp state={state} tr={tr} hidden={show('rsvp')} toast={toast} burst={burst} />
        <Wishes tr={tr} hidden={show('wishes')} burst={burst} />
        <Footer state={state} tr={tr} />
      </main>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        state={state}
        update={update}
        setSection={setSection}
        onMusicToggle={drawerMusic}
        onReset={doReset}
        onReplay={replay}
      />
      <Toast msg={toastMsg} show={toastShow} />
    </>
  );
}
