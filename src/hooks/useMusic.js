import { useCallback, useEffect, useRef, useState } from 'react';

// Synthesised ambient melody (Web Audio) - no audio files needed.
const SC = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25];
const MEL = [4,-1,2,-1,3,2,1,-1, 0,-1,2,3,4,-1,-1,-1, 5,-1,4,3,2,-1,1,2, 0,-1,-1,-1,1,-1,-1,-1];

export function useMusic(enabled) {
  const [on, setOn] = useState(false);
  const enabledRef = useRef(enabled);
  const a = useRef({ ac: null, master: null, timer: null, step: 0, nextT: 0, on: false });

  useEffect(() => { enabledRef.current = enabled; }, [enabled]);

  const note = (freq, t, dur, vol) => {
    const { ac, master } = a.current;
    const o = ac.createOscillator(), o2 = ac.createOscillator();
    const g = ac.createGain(), g2 = ac.createGain();
    o.type = 'sine'; o2.type = 'triangle';
    o.frequency.value = freq; o2.frequency.value = freq * 2.005;
    g2.gain.value = 0.25;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(master);
    o.start(t); o2.start(t); o.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
  };

  const sched = () => {
    const s = a.current;
    if (!s.ac) return;
    while (s.nextT < s.ac.currentTime + 0.4) {
      const i = MEL[s.step % MEL.length];
      if (i >= 0) note(SC[i], s.nextT, 2.2, 0.16);
      if (s.step % 8 === 0) { note(130.81, s.nextT, 3.4, 0.09); note(196, s.nextT, 3.4, 0.06); }
      s.nextT += 0.46;
      s.step++;
    }
  };

  const start = useCallback((force) => {
    if (!force && !enabledRef.current) return;
    const s = a.current;
    try {
      if (!s.ac) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return;
        s.ac = new C();
        s.master = s.ac.createGain();
        s.master.gain.value = 0;
        const dl = s.ac.createDelay(1); dl.delayTime.value = 0.34;
        const fb = s.ac.createGain(); fb.gain.value = 0.38;
        s.master.connect(s.ac.destination);
        s.master.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(s.ac.destination);
      }
      s.ac.resume();
      s.master.gain.cancelScheduledValues(s.ac.currentTime);
      s.master.gain.linearRampToValueAtTime(0.9, s.ac.currentTime + 1.5);
      s.nextT = s.ac.currentTime + 0.1;
      clearInterval(s.timer);
      s.timer = setInterval(sched, 120);
      s.on = true;
      setOn(true);
    } catch (e) { /* ignore */ }
  }, []); // eslint-disable-line

  const stop = useCallback(() => {
    const s = a.current;
    s.on = false;
    clearInterval(s.timer);
    if (s.ac && s.master) {
      s.master.gain.cancelScheduledValues(s.ac.currentTime);
      s.master.gain.linearRampToValueAtTime(0, s.ac.currentTime + 0.4);
    }
    setOn(false);
  }, []);

  useEffect(() => {
    const onVis = () => {
      const s = a.current;
      if (!s.ac) return;
      if (document.hidden) s.ac.suspend();
      else if (s.on) s.ac.resume();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      clearInterval(a.current.timer);
      if (a.current.ac) a.current.ac.close().catch(() => {});
    };
  }, []);

  return { on, start, stop };
}
